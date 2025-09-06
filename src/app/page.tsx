"use client";

import { useApp } from '@/lib/store';
import { useEffect } from 'react';
import ChatApp from '@/components/chat/ChatApp';
import AuthPage from '@/components/auth/AuthPage';

export default function HomePage() {
  const { state, dispatch } = useApp();

  // Auto-login with first user for development
  useEffect(() => {
    if (!state.currentUser) {
      // Auto-login for development - in production this would redirect to auth
      const mockUser = {
        id: 'user-1',
        username: 'john_doe',
        email: 'john@example.com',
        avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/508e1bdc-5288-4c6a-9b2d-d8017ddef7a4.png',
        status: 'online' as const,
        joinedAt: new Date('2024-01-15'),
      };
      dispatch({ type: 'SET_CURRENT_USER', payload: mockUser });
      dispatch({ type: 'SET_CURRENT_ROOM', payload: 'general' });
    }
  }, [state.currentUser, dispatch]);

  if (!state.currentUser) {
    return <AuthPage />;
  }

  return <ChatApp />;
}