import { User, ChatRoom, Message } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'john_doe',
    email: 'john@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0042b21f-98a9-422c-8be3-58744bee2e0b.png',
    status: 'online',
    joinedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    username: 'jane_smith',
    email: 'jane@example.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a90c5197-7ae9-4cd7-a1e4-8d0385e3a886.png',
    status: 'away',
    joinedAt: new Date('2024-01-20'),
  },
  {
    id: 'ai-assistant',
    username: 'AI Assistant',
    email: 'ai@chatapp.com',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e30fe7f9-545f-48e4-9b67-1c068282cfa5.png',
    status: 'online',
    joinedAt: new Date('2024-01-01'),
  },
];

export const mockRooms: ChatRoom[] = [
  {
    id: 'general',
    name: 'General Chat',
    type: 'general',
    participants: [mockUsers[0], mockUsers[1]],
    unreadCount: 0,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'ai-chat',
    name: 'AI Assistant',
    type: 'ai',
    participants: [mockUsers[2]],
    unreadCount: 0,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'tech-talk',
    name: 'Tech Discussion',
    type: 'custom',
    participants: [mockUsers[0], mockUsers[1]],
    unreadCount: 0,
    createdAt: new Date('2024-01-16'),
  },
];

export const mockMessages: Record<string, Message[]> = {
  'general': [
    {
      id: 'msg-1',
      content: 'Hey everyone! Welcome to the chat app!',
      sender: mockUsers[0],
      roomId: 'general',
      timestamp: new Date('2024-01-15T10:00:00'),
      type: 'text',
    },
    {
      id: 'msg-2',
      content: 'Thanks! This looks great. Love the clean interface.',
      sender: mockUsers[1],
      roomId: 'general',
      timestamp: new Date('2024-01-15T10:01:00'),
      type: 'text',
    },
    {
      id: 'msg-3',
      content: 'The dark mode is really nice too!',
      sender: mockUsers[0],
      roomId: 'general',
      timestamp: new Date('2024-01-15T10:02:00'),
      type: 'text',
    },
  ],
  'ai-chat': [
    {
      id: 'ai-msg-1',
      content: 'Hello! I\'m your AI assistant. I can help you with questions, provide information, or just have a conversation. What would you like to talk about?',
      sender: mockUsers[2],
      roomId: 'ai-chat',
      timestamp: new Date('2024-01-15T09:00:00'),
      type: 'ai-response',
    },
  ],
  'tech-talk': [
    {
      id: 'tech-msg-1',
      content: 'Anyone working on interesting projects lately?',
      sender: mockUsers[0],
      roomId: 'tech-talk',
      timestamp: new Date('2024-01-16T14:00:00'),
      type: 'text',
    },
    {
      id: 'tech-msg-2',
      content: 'I\'ve been exploring Next.js 15 and React 19. The new features are impressive!',
      sender: mockUsers[1],
      roomId: 'tech-talk',
      timestamp: new Date('2024-01-16T14:01:00'),
      type: 'text',
    },
  ],
};