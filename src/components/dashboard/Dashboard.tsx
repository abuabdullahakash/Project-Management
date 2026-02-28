import React, { useState } from 'react';
import { ProjectList } from '../projects/ProjectList';
import { useProjects } from '../../hooks/useProjects';
import { Briefcase, CheckCircle, AlertTriangle, CalendarX } from 'lucide-react';

export function Dashboard() {
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState<'running' | 'delivered' | 'revision'>('running');
  
  const runningProjects = projects.filter(p => p.status === 'Active' || p.status === 'Revision');
  
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return new Date().getMonth().toString();
  });
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return new Date().getFullYear();
  });

  const deliveredInSelectedMonth = projects.filter(p => {
    if (p.status !== 'Delivered' || !p.deliveredAt) return false;
    const deliveredDate = new Date(p.deliveredAt);
    const monthMatch = selectedMonth === 'All' || deliveredDate.getMonth() === parseInt(selectedMonth);
    const yearMatch = deliveredDate.getFullYear() === selectedYear;
    return monthMatch && yearMatch;
  });

  const inRevision = projects.filter(p => p.status === 'Revision');
  
  const totalValue = (() => {
    if (activeTab === 'running') {
      return runningProjects.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    }
    if (activeTab === 'delivered') {
      return deliveredInSelectedMonth.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    }
    return 0;
  })();

  const valueLabel = (() => {
    if (activeTab === 'running') return 'Total Running Value';
    if (activeTab === 'delivered') return 'Total Delivered Value';
    return 'Total Value';
  })();

  const [filterStage, setFilterStage] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('Nearest Deadline');
  const [onlyOverdue, setOnlyOverdue] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar Stats */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <h2 className="text-lg font-semibold text-white mb-2">Statistics</h2>
        
        <div 
          onClick={() => setActiveTab('running')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'running' 
              ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
              : 'bg-[#111827] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className={`p-2 rounded-lg ${activeTab === 'running' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'}`}>
            <Briefcase size={20} />
          </div>
          <div>
            <div className="text-sm text-gray-400">Running Projects</div>
            <div className="text-xl font-bold text-white">{runningProjects.length}</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('delivered')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'delivered' 
              ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
              : 'bg-[#111827] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className={`p-2 rounded-lg ${activeTab === 'delivered' ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500'}`}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-sm text-gray-400">Delivered</div>
            <div className="text-xl font-bold text-white">{deliveredInSelectedMonth.length}</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('revision')}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
            activeTab === 'revision' 
              ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
              : 'bg-[#111827] border-gray-800 hover:border-gray-700'
          }`}
        >
          <div className={`p-2 rounded-lg ${activeTab === 'revision' ? 'bg-yellow-500 text-white' : 'bg-yellow-500/10 text-yellow-500'}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-sm text-gray-400">Revision Projects</div>
            <div className="text-xl font-bold text-white">{inRevision.length}</div>
          </div>
        </div>

        {activeTab !== 'revision' && (
          <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex items-center gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-400">{valueLabel}</div>
              <div className="text-xl font-bold text-white">${totalValue}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Filters */}
        <div className="bg-[#111827] p-4 rounded-xl border border-gray-800 flex flex-wrap gap-6 mb-6 items-end">
          {activeTab === 'delivered' && (
            <>
              <div className="space-y-1.5 flex-1 min-w-[150px]">
                <label className="text-xs text-gray-400">Delivery Month</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
                >
                  <option value="All">All Months</option>
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </select>
              </div>
              <div className="space-y-1.5 flex-1 min-w-[100px]">
                <label className="text-xs text-gray-400">Year</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full bg-[#0B0F19] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
                >
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </>
          )}
          <div className="space-y-1.5 flex-1 min-w-[120px]">
            <label className="text-xs text-gray-400">Stage</label>
            <select 
              value={filterStage}
              onChange={e => setFilterStage(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
            >
              <option>All</option>
              <option>First Stage</option>
              <option>Middle Stage</option>
              <option>Final Stage</option>
              <option>Delivered</option>
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[120px]">
            <label className="text-xs text-gray-400">Priority</label>
            <select 
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="space-y-1.5 flex-1 min-w-[120px]">
            <label className="text-xs text-gray-400">Sort by</label>
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full bg-[#0B0F19] border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-gray-600"
            >
              <option>Nearest Deadline</option>
              <option>Highest Priority</option>
              <option>Recently Updated</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input 
              type="checkbox" 
              id="onlyOverdue"
              checked={onlyOverdue}
              onChange={e => setOnlyOverdue(e.target.checked)}
              className="rounded border-gray-800 bg-[#0B0F19] text-blue-500 focus:ring-blue-500 focus:ring-offset-[#111827]"
            />
            <label htmlFor="onlyOverdue" className="text-sm text-gray-400">Only Overdue</label>
          </div>
        </div>

        <ProjectList 
          activeTab={activeTab}
          filterStage={filterStage}
          filterPriority={filterPriority}
          sortBy={sortBy}
          onlyOverdue={onlyOverdue}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
