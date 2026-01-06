import React, { useState } from 'react';
import { Stakeholder, EngagementLevel } from '../types';
import { analyzeEngagementGaps } from '../services/geminiService';
import { AlertCircle, CheckCircle2, TrendingUp, RefreshCw, Zap, Sparkles, ArrowRight } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface Props {
  stakeholders: Stakeholder[];
  searchQuery: string;
}

const MonitorEngagement: React.FC<Props> = ({ stakeholders, searchQuery }) => {
  const [analysis, setAnalysis] = useState<{ summary: string; actions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeEngagementGaps(stakeholders);
      setAnalysis({ summary: result.analysis, actions: result.actions });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredStakeholders = stakeholders.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            Monitor Stakeholder Engagement
            <InfoTooltip text="The process of monitoring project stakeholder relationships and tailoring strategies for engaging stakeholders through modification of engagement strategies and plans." />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">PMBOK Process 5.6 - Assess and adjust engagement strategies.</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
          Analyze Gaps
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Matrix (SEAM) - Takes up 2/3 */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center gap-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Stakeholder Engagement Assessment Matrix</h3>
            <InfoTooltip text="SEAM: A matrix that compares current and desired stakeholder engagement levels." />
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 sticky left-0 bg-gray-50 dark:bg-slate-800 z-10 border-r dark:border-slate-700">Stakeholder</th>
                  <th className="px-4 py-3">
                    Power
                    <InfoTooltip text="Level of authority or ability to influence the project outcome." />
                  </th>
                  <th className="px-4 py-3">
                    Interest
                    <InfoTooltip text="Level of concern about the project's outcomes." />
                  </th>
                  <th className="px-4 py-3 text-center">
                    Unaware
                    <InfoTooltip text="Unaware of project and potential impacts." />
                  </th>
                  <th className="px-4 py-3 text-center">
                    Resistant
                    <InfoTooltip text="Aware of project and potential impacts and resistant to change." />
                  </th>
                  <th className="px-4 py-3 text-center">
                    Neutral
                    <InfoTooltip text="Aware of project yet neither supportive nor resistant." />
                  </th>
                  <th className="px-4 py-3 text-center">
                    Supportive
                    <InfoTooltip text="Aware of project and potential impacts and supportive to change." />
                  </th>
                  <th className="px-4 py-3 text-center">
                    Leading
                    <InfoTooltip text="Aware of project and potential impacts and actively engaged in ensuring project success." />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredStakeholders.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/30 z-10 border-r dark:border-slate-700">
                      {s.name}
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-normal">{s.role}</span>
                    </td>
                    <td className="px-4 py-3">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                         s.power === 'High' 
                           ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-600/20 dark:ring-red-400/30' 
                           : 'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-400/20'
                       }`}>
                        {s.power}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                         s.interest === 'High' 
                           ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-400/30' 
                           : 'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-400/20'
                       }`}>
                        {s.interest}
                      </span>
                    </td>
                    {/* Render Matrix Cells */}
                    {[EngagementLevel.Unaware, EngagementLevel.Resistant, EngagementLevel.Neutral, EngagementLevel.Supportive, EngagementLevel.Leading].map((level) => {
                      const isCurrent = s.currentEngagement === level;
                      const isDesired = s.desiredEngagement === level;
                      return (
                        <td key={level} className="px-4 py-3 text-center align-middle">
                          <div className="flex justify-center gap-1">
                            {isCurrent && (
                              <span className="w-6 h-6 flex items-center justify-center rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 font-bold text-xs cursor-default" title="Current Level">C</span>
                            )}
                            {isDesired && (
                              <span className="w-6 h-6 flex items-center justify-center rounded bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200 font-bold text-xs cursor-default" title="Desired Level">D</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {filteredStakeholders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No matching stakeholders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 h-full transition-colors flex flex-col">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              AI Insights & Recommendations
            </h3>
            
            {!analysis ? (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500 flex-1 flex flex-col justify-center items-center">
                <TrendingUp className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">Click "Analyze Gaps" to generate insights.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex flex-col">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                  <h4 className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase mb-2 tracking-wide">Executive Summary</h4>
                  <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed">{analysis.summary}</p>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 tracking-wide">Recommended Actions</h4>
                  <div className="space-y-3">
                    {analysis.actions.map((action, i) => (
                      <div key={i} className="group p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all flex gap-3 items-start">
                        <div className="bg-green-100 dark:bg-green-900/40 p-1.5 rounded-full shrink-0 mt-0.5 group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-green-700 dark:text-green-300" />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                          {action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full mt-auto py-2.5 text-sm font-medium border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-2 group">
                  Generate Change Request
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorEngagement;