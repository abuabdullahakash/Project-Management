import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectFormModal } from './components/projects/ProjectFormModal';
import { useProjects } from './hooks/useProjects';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addProject } = useProjects();

  const handleCreateProject = (projectData: any) => {
    addProject(projectData);
    setIsModalOpen(false);
  };

  return (
    <Layout onNewProject={() => setIsModalOpen(true)}>
      <Dashboard />
      <ProjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateProject}
      />
    </Layout>
  );
}
