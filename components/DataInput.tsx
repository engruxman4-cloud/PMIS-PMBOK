import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import mammoth from 'mammoth';
import { extractStakeholdersFromText } from '../services/geminiService';
import { Stakeholder, EngagementLevel } from '../types';
import { Database, UploadCloud, ArrowRight, Loader2, Save, AlertCircle, FileText, File as FileIcon, X } from 'lucide-react';

interface Props {
  onSaveStakeholders: (data: Stakeholder[]) => void;
}

const DataInput: React.FC<Props> = ({ onSaveStakeholders }) => {
  const [inputText, setInputText] = useState('');
  const [extractedData, setExtractedData] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setSaved(false);
    try {
      const data = await extractStakeholdersFromText(inputText);
      setExtractedData(data);
    } catch (e) {
      console.error(e);
      alert("Failed to extract data. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSaveStakeholders(extractedData);
    setSaved(true);
  };

  const processFile = async (file: File) => {
    if (!file) return;

    try {
      setLoading(true);
      let text = '';
      const isDocx = file.name.toLowerCase().endsWith('.docx');

      if (isDocx) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
        if (result.messages && result.messages.length > 0) {
          console.warn('Mammoth messages:', result.messages);
        }
      } else {
        // Try reading as text
        text = await file.text();
      }

      if (text) {
        setInputText(prev => {
          const separator = prev ? '\n\n--- IMPORTED FILE: ' + file.name + ' ---\n\n' : '';
          return prev + separator + text;
        });
      }
    } catch (err) {
      console.error("File processing error:", err);
      alert("Failed to read file. Please ensure it is a valid text or .docx file.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Project Data Input</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Upload project documents or paste text to automatically extract stakeholder data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col h-full transition-colors">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Raw Data Source
          </h3>
          
          {/* Drag & Drop Zone */}
          <div 
            className={`
              mb-4 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer
              ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[0.99]' : 'border-gray-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'}
              ${loading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".txt,.md,.csv,.json,.docx"
            />
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full mb-3 text-indigo-600 dark:text-indigo-400">
               <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Click or Drag & Drop files here</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports .docx, .txt, .md, .csv</p>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white dark:bg-slate-800 text-xs text-gray-400 dark:text-gray-500 font-medium">OR PASTE TEXT</span>
            </div>
          </div>

          <textarea
            className="flex-1 w-full p-4 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono leading-relaxed resize-none placeholder-gray-400 dark:placeholder-gray-600"
            placeholder="Paste Project Charter, Meeting Minutes, or Emails here...&#10;&#10;Example:&#10;The project is sponsored by Sarah Connor (VP of Ops). We are facing resistance from the IT Director, Miles Dyson, who is concerned about security. The user group led by John is very supportive but has low power."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ minHeight: '200px' }}
          />
          <div className="mt-4 flex justify-between items-center">
             <button 
               onClick={() => setInputText('')}
               className={`text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 ${!inputText ? 'invisible' : ''}`}
             >
                <X className="w-3 h-3" /> Clear Text
             </button>
            <button
              onClick={handleExtract}
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <FileText className="w-5 h-5" />}
              Extract Stakeholders
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col h-full transition-colors">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center justify-between">
            <span>Extracted Data Preview</span>
            {extractedData.length > 0 && (
                <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">
                    {extractedData.length} Found
                </span>
            )}
          </h3>

          <div className="flex-1 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden relative">
            {extractedData.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
                {loading ? (
                    <div className="space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
                        <p className="text-sm">Analyzing text with Gemini...</p>
                    </div>
                ) : (
                    <>
                        <ArrowRight className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-sm">Extracted data will appear here.</p>
                    </>
                )}
              </div>
            ) : (
              <div className="overflow-auto h-full max-h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-2">Name / Role</th>
                      <th className="px-4 py-2">Engagement</th>
                      <th className="px-4 py-2">P / I</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-gray-900 dark:text-gray-200">
                    {extractedData.map((s) => (
                      <tr key={s.id} className="bg-white dark:bg-slate-900">
                        <td className="px-4 py-2">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{s.role}</div>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            s.currentEngagement === EngagementLevel.Resistant ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                            s.currentEngagement === EngagementLevel.Supportive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {s.currentEngagement}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                          <div>P: {s.power}</div>
                          <div>I: {s.interest}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {saved && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" /> Data saved to system.
                    </span>
                )}
            </div>
            <button
              onClick={handleSave}
              disabled={extractedData.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium"
            >
              <Save className="w-5 h-5" />
              Save to System
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-4 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Privacy Note</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200">
                Data uploaded here is processed locally and then sent to Gemini AI for extraction. Ensure no sensitive PII is included if prohibited by your organization's policy.
            </p>
        </div>
      </div>
    </div>
  );
};

// Simple icon component for success message
const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
)

export default DataInput;