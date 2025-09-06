"use client";

import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import ThemeToggle from '@/components/common/ThemeToggle';

interface ChatSidebarProps {
  onCloseSidebar: () => void;
}

export default function ChatSidebar({ onCloseSidebar }: ChatSidebarProps) {
  const { state, dispatch } = useApp();

  const handleRoomSelect = (roomId: string) => {
    dispatch({ type: 'SET_CURRENT_ROOM', payload: roomId });
    onCloseSidebar();
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'SET_CURRENT_ROOM', payload: null });
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'general':
        return '💬';
      case 'ai':
        return '🤖';
      case 'custom':
        return '🗨️';
      default:
        return '💬';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={state.currentUser?.avatar} />
            <AvatarFallback>
              {state.currentUser?.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-sm font-semibold">{state.currentUser?.username}</h2>
            <p className="text-xs text-muted-foreground">{state.currentUser?.status}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            ⚡
          </Button>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Chat Rooms
          </h3>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {state.rooms.map((room) => (
                <Button
                  key={room.id}
                  variant={state.currentRoomId === room.id ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleRoomSelect(room.id)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-lg">{getRoomIcon(room.type)}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{room.name}</span>
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            {room.unreadCount > 9 ? '9+' : room.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {room.lastMessage && (
                        <p className="text-xs text-muted-foreground truncate">
                          {room.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Chat App v1.0</span>
            <span>{state.rooms.length} rooms</span>
          </div>
        </div>
      </div>
    </div>
  );
}