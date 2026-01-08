import React, { useState } from 'react';
import { CommIssue, CommFeedback } from '../types';
import { evaluateCommunicationPerformance } from '../services/geminiService';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { AlertTriangle, Check, FileText, Activity, MessageSquare, Plus, Star, X } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

interface Props {
  searchQuery: string;
}

const MonitorPerformance: React.FC<Props> = ({ searchQuery }) => {
  const [activeTab, setActiveTab] = useState<'issues' | 'feedback'>('issues');
  
  const [issues] = useState<CommIssue[]>([
    { id: '1', date: '2023-10-15', stakeholder: 'Engineering Lead', description: 'Didn\'t receive architecture specs on time', impact: 'High', status: 'Resolved' },
    { id: '2', date: '2023-10-18', stakeholder: 'Marketing VP', description: 'Weekly report too technical', impact: 'Medium', status: 'Open' },
    { id: '3', date: '2023-10-20', stakeholder: 'External Vendor', description: 'Email firewall blocking attachments', impact: 'High', status: 'Open' },
  ]);

  const [feedbacks, setFeedbacks] = useState<CommFeedback[]>([
    { id: '1', date: '2023-10-22', stakeholder: 'Sponsor', item: 'Monthly Steering Deck', rating: 5, comment: 'Excellent summary, very clear.' },
    { id: '2', date: '2023-10-24', stakeholder: 'Dev Team', item: 'Daily Standup Notes', rating: 3, comment: 'Arriving too late in the day.' },
  ]);

  const [aiReport, setAiReport] = useState<{ score: number; feedback: string; improvements: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Feedback Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState<Partial<CommFeedback>>({ rating: 5 });

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const result = await evaluateCommunicationPerformance(issues);
      setAiReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeedback = () => {
    if (!newFeedback.stakeholder || !newFeedback.item || !newFeedback.comment) return;
    
    const feedback: CommFeedback = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        stakeholder: newFeedback.stakeholder,
        item: newFeedback.item,
        rating: newFeedback.rating || 3,
        comment: newFeedback.comment
    };
    
    setFeedbacks(prev => [feedback, ...prev]);
    setIsModalOpen(false);
    setNewFeedback({ rating: 5 });
  };

  const radarData = [
    { subject: 'Timeliness', A: 85, fullMark: 100 },
    { subject: 'Clarity', A: 65, fullMark: 100 },
    { subject: 'Relevance', A: 90, fullMark: 100 },
    { subject: 'Consistency', A: 70, fullMark: 100 },
    { subject: 'Feedback Loop', A: 60, fullMark: 100 },
  ];

  const filteredIssues = issues.filter(issue => 
    issue.stakeholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedback = feedbacks.filter(f => 
    f.stakeholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            Monitor Communications
            <InfoTooltip text="The process of ensuring the information needs of the project and its stakeholders are met." />
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">PMBOK Process 5.7 - Ensure information needs are met.</p>
        </div>
        <button 
          onClick={handleEvaluate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Activity className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
          Generate Performance Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* KPI Chart (Radar) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            Effectiveness Metrics
            <InfoTooltip text="Multi-dimensional assessment of communication quality." />
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Radar analysis of key communication dimensions (0-100 scale).</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" strokeOpacity={0.5} />
                <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#6b7280', fontSize: 11 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Current Performance"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="#4f46e5"
                  fillOpacity={0.2}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.375rem', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis Result */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col justify-center transition-colors">
            {!aiReport ? (
                <div className="text-center text-gray-400 dark:text-gray-500">
                    <p>Run evaluation to see performance score.</p>
                </div>
            ) : (
                <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                        <svg className="w-32 h-32">
                            <circle className="text-gray-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                            <circle className="text-indigo-600 dark:text-indigo-500" strokeWidth="8" strokeDasharray={365} strokeDashoffset={365 - (365 * aiReport.score) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" transform="rotate(-90 64 64)" />
                        </svg>
                        <span className="absolute text-3xl font-bold text-gray-800 dark:text-white">{aiReport.score}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Performance Score</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{aiReport.feedback}</p>
                    
                    <div className="text-left bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
                        <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase mb-2">Improvements</h4>
                        <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1 list-disc pl-4">
                            {aiReport.improvements.map((imp, i) => (
                                <li key={i}>{imp}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Tabs for Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-4 flex justify-between items-center">
             <div className="flex gap-6">
                <button 
                    onClick={() => setActiveTab('issues')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'issues' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Communication Issues
                </button>
                <button 
                    onClick={() => setActiveTab('feedback')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'feedback' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Stakeholder Feedback
                </button>
             </div>
             {activeTab === 'feedback' && (
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-medium bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors"
                 >
                     <Plus className="w-3 h-3" /> Log Feedback
                 </button>
             )}
        </div>

        {/* Tab Content: Issues */}
        {activeTab === 'issues' && (
            <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Stakeholder</th>
                <th className="px-6 py-3">Issue</th>
                <th className="px-6 py-3">Impact</th>
                <th className="px-6 py-3">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{issue.date}</td>
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">{issue.stakeholder}</td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{issue.description}</td>
                    <td className="px-6 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        issue.impact === 'High' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                        issue.impact === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                        'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    }`}>
                        {issue.impact}
                    </span>
                    </td>
                    <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                            {issue.status === 'Open' ? <AlertTriangle className="w-4 h-4 text-orange-500" /> : <Check className="w-4 h-4 text-green-500" />}
                            <span className="text-gray-700 dark:text-gray-300">{issue.status}</span>
                        </div>
                    </td>
                </tr>
                ))}
                 {filteredIssues.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No matching issues found.</td>
                </tr>
                )}
            </tbody>
            </table>
        )}

        {/* Tab Content: Feedback */}
        {activeTab === 'feedback' && (
             <div className="divide-y divide-gray-100 dark:divide-slate-700">
                 {filteredFeedback.map((fb) => (
                     <div key={fb.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 flex flex-col md:flex-row gap-4 items-start transition-colors">
                         <div className="flex-1">
                             <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{fb.stakeholder}</h4>
                                <span className="text-xs text-gray-400 dark:text-gray-500">{fb.date}</span>
                             </div>
                             <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">{fb.item}</p>
                             <p className="text-sm text-gray-600 dark:text-gray-300">"{fb.comment}"</p>
                         </div>
                         <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded border border-yellow-100 dark:border-yellow-900/30">
                             {Array.from({ length: 5 }).map((_, i) => (
                                 <Star key={i} className={`w-3 h-3 ${i < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                             ))}
                         </div>
                     </div>
                 ))}
                 {filteredFeedback.length === 0 && (
                     <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                         <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                         <p>No feedback logged yet.</p>
                     </div>
                 )}
             </div>
        )}
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Log Stakeholder Feedback</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stakeholder Name</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            placeholder="e.g. Dr. Emily Chen"
                            value={newFeedback.stakeholder || ''}
                            onChange={(e) => setNewFeedback({...newFeedback, stakeholder: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Communication Item</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            placeholder="e.g. Weekly Status Report"
                            value={newFeedback.item || ''}
                            onChange={(e) => setNewFeedback({...newFeedback, item: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star}
                                    onClick={() => setNewFeedback({...newFeedback, rating: star})}
                                    className="focus:outline-none"
                                >
                                    <Star className={`w-6 h-6 ${star <= (newFeedback.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comments</label>
                        <textarea 
                            className="w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            rows={3}
                            placeholder="Details of the feedback..."
                            value={newFeedback.comment || ''}
                            onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                        />
                    </div>
                    <button 
                        onClick={handleSaveFeedback}
                        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm transition-colors"
                    >
                        Save Feedback Log
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MonitorPerformance;