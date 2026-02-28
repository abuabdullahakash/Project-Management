import React from 'react';
import { Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNewProject: () => void;
}

export function Layout({ children, onNewProject }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-300 font-sans">
      <header className="flex justify-between items-center py-6 px-8">
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <button 
          onClick={onNewProject}
          className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </header>
      <main className="px-8 pb-8">
        {children}
      </main>
    </div>
  );
}
