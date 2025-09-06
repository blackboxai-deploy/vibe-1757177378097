"use client";

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Message } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface MessageBubbleProps {
  message: Message;
  isFirstFromSender: boolean;
  isLastFromSender: boolean;
}

export default function MessageBubble({ 
  message, 
  isFirstFromSender, 
  isLastFromSender 
}: MessageBubbleProps) {
  const { state, dispatch } = useApp();
  const [showActions, setShowActions] = useState(false);
  const isOwnMessage = message.sender.id === state.currentUser?.id;
  const isAIMessage = message.type === 'ai-response';

  const handleDeleteMessage = () => {
    dispatch({ type: 'DELETE_MESSAGE', payload: message.id });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMessageTypeColor = () => {
    switch (message.type) {
      case 'ai-response':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100';
      case 'system':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';
      default:
        return isOwnMessage 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div 
      className={`flex items-start space-x-3 group ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {isFirstFromSender && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback className="text-xs">
            {message.sender.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      {/* Message content */}
      <div className={`flex-1 ${!isFirstFromSender ? (isOwnMessage ? 'mr-11' : 'ml-11') : ''}`}>
        {/* Sender name and timestamp */}
        {isFirstFromSender && (
          <div className={`flex items-center space-x-2 mb-1 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <span className="text-sm font-medium">{message.sender.username}</span>
            {isAIMessage && <Badge variant="secondary" className="text-xs">AI</Badge>}
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            {message.isEdited && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
        )}
        
        {/* Message bubble */}
        <div className="relative flex items-center space-x-2">
          <div className={`
            rounded-2xl px-4 py-2 max-w-prose
            ${isLastFromSender ? '' : 'mb-1'}
            ${getMessageTypeColor()}
            ${isOwnMessage 
              ? 'rounded-br-md' 
              : 'rounded-bl-md'
            }
          `}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          
          {/* Message actions */}
          {showActions && isOwnMessage && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    •••
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
                  <DropdownMenuItem onClick={handleDeleteMessage}>
                    🗑️ Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}