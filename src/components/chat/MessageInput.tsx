"use client";

import { useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Message } from '@/lib/types';

interface MessageInputProps {
  roomId: string;
  roomType: string;
}

export default function MessageInput({ roomId, roomType }: MessageInputProps) {
  const { state, dispatch } = useApp();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (!message.trim() || !state.currentUser) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message.trim(),
      sender: state.currentUser,
      roomId,
      timestamp: new Date(),
      type: 'text',
    };

    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
    setMessage('');

    // If it's an AI room, send message to AI and get response
    if (roomType === 'ai') {
      setIsLoading(true);
      try {
        const aiResponse = await sendToAI(message.trim());
        
        const aiMessage: Message = {
          id: `ai-msg-${Date.now()}`,
          content: aiResponse,
          sender: {
            id: 'ai-assistant',
            username: 'AI Assistant',
            email: 'ai@chatapp.com',
            avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/17f7c274-6320-4cff-ad9a-8f6352c67308.png',
            status: 'online',
            joinedAt: new Date(),
          },
          roomId,
          timestamp: new Date(),
          type: 'ai-response',
        };

        dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
      } catch (error) {
        console.error('AI response error:', error);
        
        const errorMessage: Message = {
          id: `error-msg-${Date.now()}`,
          content: 'Sorry, I encountered an error processing your message. Please try again.',
          sender: {
            id: 'ai-assistant',
            username: 'AI Assistant',
            email: 'ai@chatapp.com',
            avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2b380ad2-bd3c-4ca6-bcbd-d6ce316a3f0a.png',
            status: 'online',
            joinedAt: new Date(),
          },
          roomId,
          timestamp: new Date(),
          type: 'ai-response',
        };

        dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendToAI = async (userMessage: string): Promise<string> => {
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'guilhempratz@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: state.aiConfig.model,
        messages: [
          {
            role: 'system',
            content: state.aiConfig.systemPrompt,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: state.aiConfig.temperature,
        max_tokens: state.aiConfig.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              roomType === 'ai' 
                ? 'Ask the AI assistant anything...' 
                : 'Type your message...'
            }
            className="min-h-[40px] max-h-32 resize-none"
            disabled={isLoading}
          />
        </div>
        <Button 
          onClick={sendMessage}
          disabled={!message.trim() || isLoading}
          size="sm"
          className="px-4"
        >
          {isLoading ? '⏳' : '📤'}
        </Button>
      </div>
      
      {roomType === 'ai' && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Model: {state.aiConfig.model.split('/').pop()}</span>
          <span>Shift+Enter for new line</span>
        </div>
      )}
    </div>
  );
}