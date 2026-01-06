import React, { useState } from 'react';
import { Save, User, Shield, Bell, Briefcase, Camera } from 'lucide-react';
import { ProjectSettings } from '../types';

interface Props {
  settings: ProjectSettings;
  onSave: (settings: ProjectSettings) => void;
}

const SettingsView: React.FC<Props> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<ProjectSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, userPicture: reader.result as string }));
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">System Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure project parameters and user profile.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Project Manager Profile
        </h3>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
             {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center">
                        {formData.userPicture ? (
                            <img src={formData.userPicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                        <Camera className="w-6 h-6" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <label className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                    Change Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        name="manager"
                        value={formData.manager}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                    <input 
                        type="text" 
                        name="userTitle"
                        value={formData.userTitle}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                        type="email" 
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        className="w-full p-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Project Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Phase</label>
                <select 
                    name="phase"
                    value={formData.phase}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                >
                    <option value="Initiation">Initiation</option>
                    <option value="Planning">Planning</option>
                    <option value="Execution">Execution</option>
                    <option value="Monitoring & Control">Monitoring & Control</option>
                    <option value="Closure">Closure</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Methodology</label>
                <select 
                    name="methodology"
                    value={formData.methodology}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 dark:text-white"
                >
                    <option value="Predictive (Waterfall)">Predictive (Waterfall)</option>
                    <option value="Agile (Scrum)">Agile (Scrum)</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700 flex items-center justify-end gap-3">
             {isSaved && <span className="text-sm text-green-600 dark:text-green-400 animate-fade-in">Settings Saved!</span>}
             <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-medium"
             >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
        </div>
      </div>

       <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Preferences
        </h3>

        <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-slate-700">
                <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Auto-Analysis</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically analyze stakeholder engagement on data update.</p>
                </div>
                <div className="flex items-center">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                </div>
            </div>
             <div className="flex items-center justify-between py-3">
                <div className="flex items-start gap-3">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive system alerts for overdue items.</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;