"use client";

import { useApp } from '@/lib/store';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { useState } from 'react';

export default function ChatApp() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full w-full">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:flex
        h-full bg-sidebar border-r border-border
        w-80 transition-transform duration-300 z-50
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ChatSidebar onCloseSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea onOpenSidebar={() => setSidebarOpen(true)} />
      </div>
    </div>
  );
}