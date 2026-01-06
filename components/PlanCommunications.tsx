import React, { useState } from 'react';
import { Stakeholder, CommRequirement, ProjectSettings } from '../types';
import { generateCommPlanStrategy } from '../services/geminiService';
import { Loader2, Plus, Save, Sparkles, Trash2, Download } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface Props {
  stakeholders: Stakeholder[];
  searchQuery: string;
  projectSettings: ProjectSettings;
}

const PlanCommunications: React.FC<Props> = ({ stakeholders, searchQuery, projectSettings }) => {
  const [requirements, setRequirements] = useState<CommRequirement[]>([
    {
      id: '1',
      stakeholderId: '1',
      stakeholderName: 'Dr. Emily Chen',
      infoNeeded: 'Project Status Report',
      format: 'PDF Dashboard',
      frequency: 'Weekly',
      channel: 'Email',
      owner: 'Project Manager'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAutoGenerate = async () => {
    setLoading(true);
    try {
      const suggestions = await generateCommPlanStrategy(stakeholders);
      const newReqs = suggestions.map((s, idx) => ({
        id: `auto-${Date.now()}-${idx}`,
        stakeholderId: '', // Would map to real ID in prod
        stakeholderName: s.stakeholderName || 'Unknown',
        infoNeeded: s.infoNeeded || '',
        format: s.format || '',
        frequency: s.frequency || '',
        channel: s.channel || '',
        owner: 'Project Manager'
      }));
      setRequirements(newReqs);
    } catch (e) {
      alert("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequirements = requirements.filter(req => 
    req.stakeholderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.infoNeeded.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            Plan Communications Management
            <InfoTooltip text="The process of developing an appropriate approach and plan for project communication activities based on the information needs of each stakeholder or group." />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">PMBOK Process 5.3 - Define how information will be shared.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={handleAutoGenerate}
            disabled={loading}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            AI Auto-Plan
          </button>
          <button className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 text-sm transition-colors">
            <Download className="w-4 h-4" />
            Export Plan
          </button>
        </div>
      </div>

      {/* Project Context Card */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Project Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded md:bg-transparent md:p-0">
            <span className="text-gray-500 dark:text-gray-400 block">Project Name</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{projectSettings.name}</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded md:bg-transparent md:p-0">
            <span className="text-gray-500 dark:text-gray-400 block">Phase</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{projectSettings.phase}</span>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded md:bg-transparent md:p-0">
            <span className="text-gray-500 dark:text-gray-400 block">Manager</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{projectSettings.manager}</span>
          </div>
        </div>
      </div>

      {/* Requirements Matrix */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Communication Requirements Matrix</h3>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Row
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-700/50 border-b dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Stakeholder</th>
                <th className="px-6 py-3 whitespace-nowrap">
                  Information Needed
                  <InfoTooltip text="The specific content or report required by the stakeholder." />
                </th>
                <th className="px-6 py-3 whitespace-nowrap">
                  Format
                  <InfoTooltip text="The layout or presentation method (e.g., Memo, Report, Email, Dashboard)." />
                </th>
                <th className="px-6 py-3 whitespace-nowrap">
                  Frequency
                  <InfoTooltip text="How often the information is distributed (e.g., Weekly, Monthly)." />
                </th>
                <th className="px-6 py-3 whitespace-nowrap">
                  Channel
                  <InfoTooltip text="The medium used to convey the information (e.g., Email, Meeting, Portal)." />
                </th>
                <th className="px-6 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{req.stakeholderName}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{req.infoNeeded}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                      {req.format}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{req.frequency}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{req.channel}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <button 
                      onClick={() => setRequirements(requirements.filter(r => r.id !== req.id))}
                      className="text-red-400 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRequirements.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {requirements.length === 0 
                ? 'No requirements defined. Click "AI Auto-Plan" to generate a baseline.'
                : 'No matching requirements found.'}
            </div>
          )}
        </div>
      </div>

      {/* Assumptions & Constraints */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Assumptions & Constraints</h3>
        <textarea 
          className="w-full h-24 p-3 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Enter communication constraints (e.g., secure channels only for financials) or assumptions..."
          defaultValue="- All financial reports must use encrypted email.&#10;- Steering committee meets monthly on the first Tuesday."
        />
      </div>
    </div>
  );
};

export default PlanCommunications;