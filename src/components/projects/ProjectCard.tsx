import React, { useState } from 'react';
import { Project } from '../../types';
import { getRemainingTime, formatRelativeTime } from '../../utils/dateUtils';
import { Clock, MessageSquare, Edit2, Trash2, CheckSquare, ChevronUp, ChevronDown, Minus, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  key?: string;
  project: Project;
  onTouch: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenNotes: () => void;
}

export function ProjectCard({ project, onTouch, onUpdate, onEdit, onDelete, onOpenNotes }: ProjectCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const timeInfo = getRemainingTime(project.endDate);
  const isDelivered = project.status === 'Delivered';
  const isActive = !isDelivered;
  
  // Check if it was overdue when delivered or if it is currently overdue
  const wasOverdueAtDelivery = isDelivered && project.deliveredAt && new Date(project.deliveredAt) > new Date(project.endDate);
  const showOverdue = (isActive && timeInfo.isOverdue) || wasOverdueAtDelivery;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active': return 'text-blue-500';
      case 'Revision': return 'text-yellow-500';
      case 'Delivered': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleMarkDelivered = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ 
      status: 'Delivered', 
      deliveredAt: new Date().toISOString(), 
      stage: 'Delivered' 
    });
    setShowConfirm(false);
  };

  const getPriorityIcon = (priority: Project['priority']) => {
    switch (priority) {
      case 'High': return <ChevronUp size={16} className="text-red-500" />;
      case 'Medium': return <ChevronUp size={16} className="text-yellow-500" />;
      case 'Low': return <ChevronDown size={16} className="text-blue-500" />;
      default: return <Minus size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group">
      {showOverdue && (
        <div className="bg-[#3F1616] text-[#FCA5A5] text-center py-2 text-xs font-semibold uppercase tracking-wider">
          {isDelivered ? `Delivered Overdue (${Math.ceil((new Date(project.deliveredAt!).getTime() - new Date(project.endDate).getTime()) / (1000 * 60 * 60 * 24))}d)` : `Overdue by ${timeInfo.days} days`}
        </div>
      )}
      {isActive && !timeInfo.isOverdue && (
        <div className="bg-blue-900/20 text-blue-400 text-center py-2 text-xs font-semibold uppercase tracking-wider border-b border-blue-900/30">
          Remaining: {timeInfo.days}d {timeInfo.hours}h
        </div>
      )}
      {isDelivered && (
        <div className="bg-green-900/20 text-green-400 text-center py-2 text-xs font-semibold uppercase tracking-wider border-b border-green-900/30">
          Delivered: {new Date(project.deliveredAt!).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-white text-lg leading-tight truncate group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              {project.websiteLink && (
                <a 
                  href={project.websiteLink.startsWith('http') ? project.websiteLink : `https://${project.websiteLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-all shrink-0"
                  title="Visit Website"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-400 truncate">{project.clientName}</p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-white font-bold text-lg">${project.price || 0}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(project.status).replace('text-', 'bg-')}`}></div>
              {isDelivered ? (
                <span className="text-green-500 text-[10px] font-bold uppercase tracking-wider">Delivered</span>
              ) : (
                <select 
                  value={project.status || 'Active'}
                  onChange={(e) => onUpdate({ status: e.target.value as Project['status'] })}
                  className={`bg-transparent border-none p-0 text-[10px] font-bold uppercase tracking-wider focus:ring-0 cursor-pointer ${getStatusColor(project.status)}`}
                >
                  <option value="Active" className="bg-[#111827] text-gray-300">Active</option>
                  <option value="Revision" className="bg-[#111827] text-gray-300">Revision</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <select
              value={project.stage || 'First Stage'}
              disabled={isDelivered}
              onChange={(e) => onUpdate({ stage: e.target.value as Project['stage'] })}
              className="flex-1 bg-[#0B0F19] border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
            >
              <option value="First Stage">First Stage</option>
              <option value="Middle Stage">Middle Stage</option>
              <option value="Final Stage">Final Stage</option>
              <option value="Delivered">Delivered</option>
            </select>

            {!isDelivered && !showConfirm && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                className="p-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all"
                title="Mark Delivered"
              >
                <CheckCircle2 size={18} />
              </button>
            )}
          </div>

          {showConfirm && (
            <div className="mt-3 bg-[#0B0F19] border border-gray-800 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-2">Are you sure?</p>
              <div className="flex gap-2">
                <button 
                  onClick={handleMarkDelivered}
                  className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Yes
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              {getPriorityIcon(project.priority)}
              <span className="uppercase tracking-wider">{project.priority}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <Clock size={12} />
              <span>{formatRelativeTime(project.lastUpdatedAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <button 
                onClick={onOpenNotes} 
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all relative"
                title="Notes"
              >
                <MessageSquare size={18} />
                {project.notes?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-[#111827]">
                    {project.notes.length}
                  </span>
                )}
              </button>
              
              {!isDelivered && (
                <>
                  <button 
                    onClick={onEdit} 
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={onDelete} 
                    className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isDelivered ? (
                <button 
                  onClick={() => onUpdate({ status: 'Revision' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <AlertTriangle size={14} />
                  Revision
                </button>
              ) : (
                <button 
                  onClick={(e) => { e.preventDefault(); onTouch(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20"
                >
                  <CheckSquare size={14} />
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
