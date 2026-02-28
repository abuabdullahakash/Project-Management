import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Project } from '../types';

interface ProjectContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  updateProject: (id: string, updates: Partial<Project>) => void;
  touchProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'lastUpdatedAt' | 'notes'>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useLocalStorage<Project[]>('dpcc_projects', []);

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newProject = { ...p, ...updates, lastUpdatedAt: new Date().toISOString() };
        if (updates.status === 'Delivered' && p.status !== 'Delivered') {
          newProject.deliveredAt = new Date().toISOString();
        } else if (updates.status && updates.status !== 'Delivered') {
          newProject.deliveredAt = undefined;
        }
        return newProject;
      }
      return p;
    }));
  };

  const touchProject = (id: string) => {
    updateProject(id, {});
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addProject = (projectData: any) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      deliveredAt: projectData.status === 'Delivered' ? new Date().toISOString() : undefined,
      notes: [],
    };
    setProjects(prev => [...prev, newProject]);
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, 
      setProjects, 
      updateProject, 
      touchProject, 
      deleteProject,
      addProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
