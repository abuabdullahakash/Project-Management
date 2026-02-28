import React from 'react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <h1 className="font-semibold text-lg tracking-tight">Command Center</h1>
      </div>
      <nav className="flex-1 p-4">
        {/* Placeholder for navigation links */}
        <ul className="space-y-2">
          <li>
            <a href="#" className="block px-3 py-2 rounded-md bg-neutral-100 text-neutral-900 font-medium text-sm">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="block px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 font-medium text-sm">
              Projects
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
