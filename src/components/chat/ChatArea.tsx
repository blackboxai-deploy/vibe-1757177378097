"use client";

import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  onOpenSidebar: () => void;
}

export default function ChatArea({ onOpenSidebar }: ChatAreaProps) {
  const { state } = useApp();
  
  const currentRoom = state.rooms.find(room => room.id === state.currentRoomId);
  const messages = state.messages[state.currentRoomId || ''] || [];

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome to Chat App</h2>
          <p className="text-muted-foreground">Select a room to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onOpenSidebar}
          >
            ☰
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{currentRoom.name}</h1>
            <p className="text-xs text-muted-foreground">
              {currentRoom.participants.length} participants
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {currentRoom.type === 'ai' && (
            <Button variant="outline" size="sm">
              ⚙️ AI Settings
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm">
        <MessageInput roomId={currentRoom.id} roomType={currentRoom.type} />
      </div>
    </div>
  );
}