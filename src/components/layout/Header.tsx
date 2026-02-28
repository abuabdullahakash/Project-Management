import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onNewProject: () => void;
}

export function Header({ onNewProject }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center px-6 justify-between">
      <div className="text-sm font-medium text-neutral-500">
        Overview
      </div>
      <div>
        <button 
          onClick={onNewProject}
          className="flex items-center gap-1.5 bg-neutral-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>
    </header>
  );
}
