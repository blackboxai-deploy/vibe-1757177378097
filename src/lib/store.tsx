"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, ChatRoom, Message, AIConfig } from './types';
import { mockRooms, mockMessages } from './mockData';

type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_CURRENT_ROOM'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { messageId: string; content: string } }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'ADD_ROOM'; payload: ChatRoom }
  | { type: 'UPDATE_AI_CONFIG'; payload: Partial<AIConfig> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const initialState: AppState = {
  currentUser: null,
  currentRoomId: null,
  rooms: mockRooms,
  messages: mockMessages,
  aiConfig: {
    model: 'openrouter/anthropic/claude-sonnet-4',
    systemPrompt: 'You are a helpful AI assistant. Be concise, friendly, and informative in your responses.',
    temperature: 0.7,
    maxTokens: 2000,
  },
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoomId: action.payload };
    case 'ADD_MESSAGE': {
      const message = action.payload;
      const roomMessages = state.messages[message.roomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message],
        },
        rooms: state.rooms.map(room =>
          room.id === message.roomId
            ? { ...room, lastMessage: message, unreadCount: room.unreadCount + 1 }
            : room
        ),
      };
    }
    case 'UPDATE_MESSAGE': {
      const { messageId, content } = action.payload;
      const updatedMessages = { ...state.messages };
      
      Object.keys(updatedMessages).forEach(roomId => {
        updatedMessages[roomId] = updatedMessages[roomId].map(msg =>
          msg.id === messageId
            ? { ...msg, content, isEdited: true, editedAt: new Date() }
            : msg
        );
      });
      
      return { ...state, messages: updatedMessages };
    }
    case 'DELETE_MESSAGE': {
      const messageId = action.payload;
      const updatedMessages = { ...state.messages };
      
      Object.keys(updatedMessages).forEach(roomId => {
        updatedMessages[roomId] = updatedMessages[roomId].filter(msg => msg.id !== messageId);
      });
      
      return { ...state, messages: updatedMessages };
    }
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
        messages: { ...state.messages, [action.payload.id]: [] },
      };
    case 'UPDATE_AI_CONFIG':
      return {
        ...state,
        aiConfig: { ...state.aiConfig, ...action.payload },
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => null });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('chatApp');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      currentUser: state.currentUser,
      currentRoomId: state.currentRoomId,
      messages: state.messages,
      aiConfig: state.aiConfig,
    };
    localStorage.setItem('chatApp', JSON.stringify(stateToSave));
  }, [state.currentUser, state.currentRoomId, state.messages, state.aiConfig]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}