export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  joinedAt: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'general' | 'ai' | 'custom';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  roomId: string;
  timestamp: Date;
  type: 'text' | 'ai-response' | 'system';
  isEdited?: boolean;
  editedAt?: Date;
}

export interface AIConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface AppState {
  currentUser: User | null;
  currentRoomId: string | null;
  rooms: ChatRoom[];
  messages: Record<string, Message[]>;
  aiConfig: AIConfig;
  isLoading: boolean;
}