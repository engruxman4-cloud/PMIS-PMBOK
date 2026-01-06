import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  Radio, 
  FileText, 
  Settings as SettingsIcon, 
  Bell,
  Search,
  UserCircle,
  Database,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import PlanCommunications from './components/PlanCommunications';
import MonitorEngagement from './components/MonitorEngagement';
import MonitorPerformance from './components/MonitorPerformance';
import Reports from './components/Reports';
import DataInput from './components/DataInput';
import SettingsView from './components/SettingsView';
import { Stakeholder, EngagementLevel, ProjectSettings } from './types';

// Default Mock Data (used if no input provided)
const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  { id: '1', name: 'Dr. Emily Chen', role: 'Sponsor', currentEngagement: EngagementLevel.Supportive, desiredEngagement: EngagementLevel.Leading, power: 'High', interest: 'High' },
  { id: '2', name: 'Mark Davis', role: 'Product Owner', currentEngagement: EngagementLevel.Neutral, desiredEngagement: EngagementLevel.Supportive, power: 'High', interest: 'High' },
  { id: '3', name: 'Sarah Miller', role: 'Eng. Lead', currentEngagement: EngagementLevel.Resistant, desiredEngagement: EngagementLevel.Supportive, power: 'Low', interest: 'High' },
  { id: '4', name: 'Steering Comm.', role: 'Governance', currentEngagement: EngagementLevel.Neutral, desiredEngagement: EngagementLevel.Supportive, power: 'High', interest: 'Low' },
  { id: '5', name: 'End Users', role: 'User Group', currentEngagement: EngagementLevel.Unaware, desiredEngagement: EngagementLevel.Supportive, power: 'Low', interest: 'High' },
];

const INITIAL_SETTINGS: ProjectSettings = {
  name: 'Enterprise CRP Migration',
  manager: 'Alex Rivera, PMP',
  userTitle: 'Project Manager',
  userEmail: 'alex.rivera@example.com',
  phase: 'Execution',
  methodology: 'Predictive (Waterfall)'
};

enum View {
  Dashboard = 'Dashboard',
  PlanComm = 'PlanComm',
  MonitorEngage = 'MonitorEngage',
  MonitorPerf = 'MonitorPerf',
  Reports = 'Reports',
  DataInput = 'DataInput',
  Settings = 'Settings'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(INITIAL_STAKEHOLDERS);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>(INITIAL_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle Theme Toggle
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  // Dashboard Component (Internal for simplicity of props sharing)
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Stakeholders', value: stakeholders.length.toString(), color: 'border-l-blue-500' },
          { label: 'Engagement Health', value: '82%', sub: 'Based on current assessment', color: 'border-l-green-500' },
          { label: 'Comm. Effectiveness', value: '78/100', color: 'border-l-indigo-500' },
          { label: 'Open Issues', value: '3', sub: '1 Critical', color: 'border-l-red-500' },
        ].map((kpi, idx) => (
          <div key={idx} className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 border-l-4 ${kpi.color}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">{kpi.value}</h3>
            {kpi.sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{kpi.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Project Alerts</h3>
          <div className="space-y-3">
             <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-900/30">
                <Bell className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Low Engagement Detected</h4>
                  <p className="text-sm text-red-600 dark:text-red-400">Stakeholder engagement dropped. Review Monitor Engagement module.</p>
                </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                <Bell className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Delayed Communication</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">Monthly Steering Committee Report is 2 days overdue.</p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-lg text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">PMIS Assistant</h3>
            <p className="text-indigo-200 text-sm mb-4">Need to update project data? Use the Data Input module to extract stakeholders from documents.</p>
          </div>
          <button 
            onClick={() => handleNavClick(View.DataInput)}
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 flex flex-col 
        transition-transform duration-300 ease-in-out transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        border-r border-slate-800
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">P</div>
            CommManager
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => handleNavClick(View.Dashboard)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.Dashboard ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>

           <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Data Management
          </div>

          <button 
            onClick={() => handleNavClick(View.DataInput)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.DataInput ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Database className="w-5 h-5" />
            <span className="text-sm font-medium">Data Input</span>
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            PMBOK Modules
          </div>

          <button 
            onClick={() => handleNavClick(View.PlanComm)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.PlanComm ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Megaphone className="w-5 h-5" />
            <span className="text-sm font-medium">Plan Comms (5.3)</span>
          </button>

          <button 
            onClick={() => handleNavClick(View.MonitorEngage)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.MonitorEngage ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Monitor Engage (5.6)</span>
          </button>

          <button 
            onClick={() => handleNavClick(View.MonitorPerf)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.MonitorPerf ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-sm font-medium">Monitor Perf (5.7)</span>
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System
          </div>

          <button 
            onClick={() => handleNavClick(View.Reports)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.Reports ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={() => handleNavClick(View.Settings)}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${currentView === View.Settings ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
           >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center px-4 md:px-8 sticky top-0 z-20 shadow-sm md:shadow-none transition-colors">
          <div className="flex items-center gap-3 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md md:hidden focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-gray-300 dark:focus:border-slate-600 focus:ring-0 sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 pl-4">
             <button 
                onClick={toggleTheme}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Toggle theme"
             >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
             <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
             </button>
             <div 
               className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
               onClick={() => handleNavClick(View.Settings)}
               title="Edit Profile"
             >
                {projectSettings.userPicture ? (
                 <img 
                   src={projectSettings.userPicture} 
                   alt="Profile" 
                   className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700" 
                 />
               ) : (
                 <UserCircle className="w-8 h-8 text-gray-300 dark:text-slate-500" />
               )}
               <div className="text-sm hidden md:block text-left">
                 <p className="font-medium text-gray-700 dark:text-gray-200">{projectSettings.manager}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{projectSettings.userTitle}</p>
               </div>
             </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-4 md:p-8 flex-1 overflow-auto bg-gray-50/50 dark:bg-slate-950/50">
          {currentView === View.Dashboard && <Dashboard />}
          {currentView === View.DataInput && <DataInput onSaveStakeholders={setStakeholders} />}
          {currentView === View.PlanComm && <PlanCommunications stakeholders={stakeholders} searchQuery={searchQuery} projectSettings={projectSettings} />}
          {currentView === View.MonitorEngage && <MonitorEngagement stakeholders={stakeholders} searchQuery={searchQuery} />}
          {currentView === View.MonitorPerf && <MonitorPerformance searchQuery={searchQuery} />}
          {currentView === View.Reports && <Reports searchQuery={searchQuery} />}
          {currentView === View.Settings && <SettingsView settings={projectSettings} onSave={setProjectSettings} />}
        </div>
      </main>
    </div>
  );
};

export default App;