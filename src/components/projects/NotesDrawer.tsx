import React, { useState } from 'react';
import { Project, NoteTag, Note } from '../../types';
import { X } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';

const CATEGORIES: NoteTag[] = [
  'Clarification',
  'Update Message',
  'Follow Up',
  'Delivery',
  'Meeting Summary',
  'Fixing Update',
  'Extend Message',
  'Ask For Additional Charge',
  'Hyper Client Convenience'
];

interface NotesDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

export function NotesDrawer({ project, isOpen, onClose, onUpdateProject }: NotesDrawerProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteTag>('Clarification');

  if (!isOpen || !project) return null;

  const notes = project.notes || [];

  const getNoteCount = (category: NoteTag) => {
    return notes.filter(n => n.tags.includes(category)).length;
  };

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      content: newNoteContent.trim(),
      timestamp: new Date().toISOString(),
      tags: [selectedCategory]
    };

    onUpdateProject(project.id, {
      notes: [...notes, newNote]
    });

    setNewNoteContent('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0B0F19] border-l border-gray-800 shadow-2xl z-50 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#111827]">
          <h2 className="text-lg font-semibold text-white">Notes for {project.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {notes.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No notes yet.</div>
          ) : (
            CATEGORIES.map(category => {
              const categoryNotes = notes.filter(n => n.tags.includes(category));
              if (categoryNotes.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h3 className="text-sm font-medium text-blue-400">{category}</h3>
                    <span className="text-xs font-medium bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                      {categoryNotes.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {categoryNotes.map(note => (
                      <div key={note.id} className="bg-[#111827] p-3 rounded-lg border border-gray-800">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{note.content}</p>
                        <span className="text-xs text-gray-500 mt-2 block">
                          {formatRelativeTime(note.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#111827]">
          <textarea
            className="w-full bg-[#0B0F19] border border-gray-700 rounded-md p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none mb-3"
            rows={3}
            placeholder="Add a new note..."
            value={newNoteContent}
            onChange={e => setNewNoteContent(e.target.value)}
          />
          <div className="flex gap-3">
            <select
              className="flex-1 bg-[#0B0F19] border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as NoteTag)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c} ({getNoteCount(c)})</option>
              ))}
            </select>
            <button
              onClick={handleAddNote}
              className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
