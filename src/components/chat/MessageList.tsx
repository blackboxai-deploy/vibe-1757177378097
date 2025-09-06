"use client";

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/lib/types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">📭</p>
          <p>No messages yet</p>
          <p className="text-sm">Start a conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div ref={scrollRef} className="p-4 space-y-4">
        {messages.map((message, index) => {
          const isFirstFromSender = index === 0 || messages[index - 1].sender.id !== message.sender.id;
          const isLastFromSender = index === messages.length - 1 || messages[index + 1].sender.id !== message.sender.id;
          
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isFirstFromSender={isFirstFromSender}
              isLastFromSender={isLastFromSender}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
}