import React, { useState } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from './ProjectCard';
import { calculateRemainingDays } from '../../utils/dateUtils';
import { ProjectFormModal } from './ProjectFormModal';
import { NotesDrawer } from './NotesDrawer';
import { Project } from '../../types';

interface ProjectListProps {
  activeTab: 'running' | 'delivered' | 'revision';
  filterStage: string;
  filterPriority: string;
  sortBy: string;
  onlyOverdue: boolean;
  selectedMonth: string;
  selectedYear: number;
}

export function ProjectList({ activeTab, filterStage, filterPriority, sortBy, onlyOverdue, selectedMonth, selectedYear }: ProjectListProps) {
  const { projects, touchProject, updateProject, deleteProject } = useProjects();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [notesProject, setNotesProject] = useState<Project | null>(null);

  let filteredProjects = projects.filter(p => {
    if (activeTab === 'running') {
      if (p.status !== 'Active' && p.status !== 'Revision') return false;
    } else if (activeTab === 'delivered') {
      if (p.status !== 'Delivered') return false;
      if (!p.deliveredAt) return false;
      const deliveredDate = new Date(p.deliveredAt);
      const monthMatch = selectedMonth === 'All' || deliveredDate.getMonth() === parseInt(selectedMonth);
      const yearMatch = deliveredDate.getFullYear() === selectedYear;
      if (!monthMatch || !yearMatch) {
        return false;
      }
    } else if (activeTab === 'revision') {
      if (p.status !== 'Revision') return false;
    }

    if (filterStage !== 'All' && p.stage !== filterStage) return false;
    if (filterPriority !== 'All' && p.priority !== filterPriority) return false;
    if (onlyOverdue) {
      if (p.status === 'Delivered') return false;
      if (calculateRemainingDays(p.endDate) >= 0) return false;
    }
    return true;
  });

  filteredProjects.sort((a, b) => {
    if (sortBy === 'Nearest Deadline') {
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    }
    if (sortBy === 'Highest Priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (sortBy === 'Recently Updated') {
      return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
    }
    return 0;
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 bg-[#111827] rounded-xl border border-gray-800">
        <p className="text-sm">No projects found.</p>
      </div>
    );
  }

  const groupedProjects = filteredProjects.reduce((acc, project) => {
    const status = project.status || 'Active';
    if (!acc[status]) acc[status] = [];
    acc[status].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const statusOrder: Project['status'][] = ['Active', 'Revision', 'Delivered'];

  return (
    <div className="space-y-8">
      {statusOrder.map(status => {
        const projectsInStatus = groupedProjects[status];
        if (!projectsInStatus || projectsInStatus.length === 0) return null;

        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between px-1 border-b border-gray-800/50 pb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'Active' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                  status === 'Revision' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 
                  status === 'Delivered' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-500'
                }`} />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
                  {status}
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-gray-800/50 text-gray-500 px-2 py-0.5 rounded-full border border-gray-800">
                {projectsInStatus.length} {projectsInStatus.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projectsInStatus.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onTouch={() => touchProject(project.id)} 
                  onUpdate={(updates) => updateProject(project.id, updates)}
                  onEdit={() => setEditingProject(project)}
                  onDelete={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      deleteProject(project.id);
                    }
                  }}
                  onOpenNotes={() => setNotesProject(project)}
                />
              ))}
            </div>
          </div>
        );
      })}

      <ProjectFormModal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        initialData={editingProject}
        onSubmit={(updates) => {
          if (editingProject) {
            updateProject(editingProject.id, updates);
          }
        }}
      />

      <NotesDrawer
        isOpen={!!notesProject}
        onClose={() => setNotesProject(null)}
        project={notesProject}
        onUpdateProject={(id, updates) => {
          updateProject(id, updates);
          setNotesProject(prev => prev ? { ...prev, ...updates } : null);
        }}
      />
    </div>
  );
}
