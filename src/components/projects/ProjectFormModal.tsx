import React, { useState, useEffect } from 'react';
import { Project, Priority, Stage, Status } from '../../types';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdatedAt' | 'notes'>) => void;
  initialData?: Project | null;
}

export function ProjectFormModal({ isOpen, onClose, onSubmit, initialData }: ProjectFormModalProps) {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [stage, setStage] = useState<Stage>('First Stage');
  const [status, setStatus] = useState<Status>('Active');
  const [websiteLink, setWebsiteLink] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setClientName(initialData.clientName || '');
        setDescription(initialData.description || '');
        setPrice(initialData.price ?? '');
        setPriority(initialData.priority || 'Medium');
        setStartDate(initialData.startDate || new Date().toISOString().split('T')[0]);
        setEndDate(initialData.endDate || '');
        setStage(initialData.stage || 'First Stage');
        setStatus(initialData.status || 'Active');
        setWebsiteLink(initialData.websiteLink || '');
      } else {
        setTitle('');
        setClientName('');
        setDescription('');
        setPrice('');
        setPriority('Medium');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setStage('First Stage');
        setStatus('Active');
        setWebsiteLink('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      clientName,
      description,
      price: Number(price) || 0,
      priority,
      startDate,
      endDate,
      stage,
      status,
      websiteLink,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111827] rounded-xl shadow-2xl border border-gray-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">{initialData ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Project Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Client Name</label>
              <input 
                required
                type="text" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Price ($)</label>
              <input 
                required
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
                placeholder="e.g. 1500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm resize-none"
              placeholder="Brief project details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Start Date</label>
              <input 
                required
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">End Date</label>
              <input 
                required
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
              >
                <option value="Active">Active</option>
                <option value="Revision">Revision</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Stage</label>
            <select 
              value={stage}
              onChange={(e) => setStage(e.target.value as Stage)}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
            >
              <option value="First Stage">First Stage</option>
              <option value="Middle Stage">Middle Stage</option>
              <option value="Final Stage">Final Stage</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Website Link (Optional)</label>
            <input 
              type="url" 
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0F19] border border-gray-800 text-white rounded-md focus:outline-none focus:border-blue-500 sm:text-sm"
              placeholder="https://example.com"
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-800 bg-[#0B0F19] flex justify-end space-x-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-700 rounded-md hover:bg-gray-800 focus:outline-none transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none transition-colors"
          >
            {initialData ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}
