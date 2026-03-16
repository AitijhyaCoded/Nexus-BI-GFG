import React from 'react';
import { Table, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

interface DataPreviewProps {
  sampleData: any[];
  summary: string;
  suggestedQuestions: string[];
  onAnalyze: (question: string) => void;
  onClose: () => void;
}

export function DataPreview({ sampleData, summary, suggestedQuestions = [], onAnalyze, onClose }: DataPreviewProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  if (!sampleData || sampleData.length === 0) return null;
  
  const safeQuestions = Array.isArray(suggestedQuestions) ? suggestedQuestions : [];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#0f1117]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Table className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-tight text-left">Data Preview</h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest text-left">First 5 Rows Imported</p>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/40 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20"
          >
            {isExpanded ? 'Minimize' : 'Expand Preview'}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Sample Table */}
            <div className="overflow-x-auto custom-scrollbar border-b border-white/5 max-h-[250px]">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="sticky top-0 bg-[#0f1117]/95 backdrop-blur z-10">
                  <tr>
                    {Object.keys(sampleData[0]).map((key) => (
                      <th key={key} className="px-6 py-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sampleData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      {Object.values(row).map((val: any, jdx) => (
                        <td key={jdx} className="px-6 py-3 text-xs text-white/60">
                          {typeof val === 'number' ? val.toLocaleString() : String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Summary */}
            <div className="p-6 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 text-left">AI Insight Summary</h4>
                  <p className="text-white text-sm font-medium leading-relaxed text-left">
                    {summary}
                  </p>
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-3 h-3 text-white/30" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Suggested Questions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {safeQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAnalyze(q)}
                      className="group flex flex-col justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all text-left group"
                    >
                      <p className="text-xs font-medium text-white/70 group-hover:text-white transition-colors line-clamp-2 mb-2">
                        {q}
                      </p>
                      <div className="flex items-center gap-1.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Analyze</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
