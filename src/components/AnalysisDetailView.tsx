import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Database, Calendar, Terminal, Download, Share2, TrendingUp, CheckCircle2, XCircle, Activity, Sparkles, FileDown, LayoutGrid, Table } from 'lucide-react';
import { ChartComponent } from './ChartComponent';
import { cn } from '../utils';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

interface AnalysisDetailViewProps {
  analysisId: number;
  onBack: () => void;
}

export function AnalysisDetailView({ analysisId, onBack }: AnalysisDetailViewProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const reportRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    setIsExporting(true);
    console.log("Starting Clean PDF Export...");

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // 1. Title
      pdf.setFontSize(22);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Nexus-BI Analysis Report", margin, currentY);
      currentY += 15;

      // 2. User Query
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("User Query:", margin, currentY);
      currentY += 7;
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      const queryLines = pdf.splitTextToSize(analysis.question, contentWidth);
      pdf.text(queryLines, margin, currentY);
      currentY += (queryLines.length * 5) + 10;

      // 3. SQL Query
      if (analysis.generated_sql) {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("SQL Query:", margin, currentY);
        currentY += 7;

        pdf.setFont("courier", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        const sqlLines = pdf.splitTextToSize(analysis.generated_sql, contentWidth);
        pdf.text(sqlLines, margin, currentY);
        currentY += (sqlLines.length * 4) + 15;
      }

      // 4. Chart Capture
      if (chartRef.current) {
        const chartDataUrl = await toPng(chartRef.current, {
          backgroundColor: '#0a0c10',
          style: {
            borderRadius: '12px',
          },
          pixelRatio: 2, // Scale 2 for high resolution
        });

        const imgProps = pdf.getImageProperties(chartDataUrl);
        const imgWidth = contentWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        // Check if chart fits on page, else add new page
        if (currentY + imgHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(chartDataUrl, 'PNG', margin, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 15;
      }

      // 5. AI Insights
      const insightsText = analysis.insights?.pros_cons || "No insights available.";
      const predictionsText = analysis.insights?.predictions || "";

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("AI Insights:", margin, currentY);
      currentY += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const insightLines = pdf.splitTextToSize(insightsText, contentWidth);
      
      if (currentY + (insightLines.length * 5) > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      
      pdf.text(insightLines, margin, currentY);
      currentY += (insightLines.length * 5) + 10;

      if (predictionsText) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Predictions & Trends:", margin, currentY);
        currentY += 6;
        pdf.setFont("helvetica", "normal");
        const predLines = pdf.splitTextToSize(predictionsText, contentWidth);
        
        if (currentY + (predLines.length * 5) > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
        
        pdf.text(predLines, margin, currentY);
      }

      pdf.save(`Nexus-BI-${analysis.table_name}-${analysisId}.pdf`);
      console.log("PDF report generated successfully");
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to generate full report. Please try again or check the console.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/analyses/${analysisId}`);
        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error('Failed to fetch analysis detail:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [analysisId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/40">Analysis not found.</p>
        <button onClick={onBack} className="mt-4 text-indigo-400 hover:underline">Go Back</button>
      </div>
    );
  }

  // Helper to ensure we have an object if stored as string
  const parseData = (val: any) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return val; }
    }
    return val;
  };

  const { question, table_name, created_at, generated_sql, chart_type, summary } = analysis;
  const data = parseData(analysis.data);
  const insights = parseData(analysis.insights);
  const messages = parseData(analysis.messages);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0c10] overflow-hidden">
      <header className="sticky top-0 z-30 bg-[#0a0c10]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">Analysis Detail</h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1">
                <Database size={10} /> {table_name}
              </span>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> {new Date(created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 uppercase tracking-wider mr-2">
              <TrendingUp className="w-3.5 h-3.5" /> Historical
            </span>
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className={cn(
                "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95",
                isExporting && "animate-pulse cursor-not-allowed"
              )}
            >
              <FileDown size={16} className={cn(isExporting && "animate-bounce")} />
              {isExporting ? 'Generating Report...' : 'Download PDF Report'}
            </button>
        </div>
      </header>

      <div 
        ref={reportRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 max-w-5xl mx-auto w-full"
      >
        {/* Question Header */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 mb-2">
            <h1 className="text-xl font-bold text-white leading-relaxed">"{question}"</h1>
            {summary && <p className="text-white/60 text-sm mt-3 leading-relaxed">{summary}</p>}
        </div>

        {/* Generated SQL */}
        {generated_sql && (
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Saved SQL Query</span>
            </div>
            <code className="text-[11px] text-indigo-300/80 font-mono break-all">{generated_sql}</code>
          </div>
        )}

        {/* Main Visualization */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[450px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight capitalize">{viewMode === 'chart' ? (chart_type === 'table' ? 'bar' : chart_type) : 'table'} Visualization</h3>
              <p className="text-sm text-white/40 mt-1">Snapshot from analysis history</p>
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('chart')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  viewMode === 'chart' ? "bg-indigo-600 text-white shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                <LayoutGrid size={12} /> Chart
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  viewMode === 'table' ? "bg-indigo-600 text-white shadow-lg" : "text-white/40 hover:text-white"
                )}
              >
                <Table size={12} /> Table
              </button>
            </div>
          </div>
          
          <div 
            ref={chartRef}
            className="w-full h-[450px] min-h-[450px] relative"
          >
            {data && Array.isArray(data) && data.length > 0 ? (
              viewMode === 'table' ? (
                <div className="h-full overflow-x-auto border border-white/5 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#0f1117] sticky top-0 z-10 shadow-sm border-b border-white/5">
                      <tr>
                        {Object.keys(data[0]).map(key => (
                          <th key={key} className="px-4 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          {Object.values(row).map((val: any, jdx) => (
                            <td key={jdx} className="px-4 py-3 text-xs text-white/70">
                              {typeof val === 'number' ? val.toLocaleString() : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ChartComponent type={chart_type === 'table' ? 'bar' : chart_type} data={data} />
              )
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-white/20 text-sm italic border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <Sparkles className="w-8 h-8 opacity-20 mb-4" />
                {data 
                  ? (Array.isArray(data) ? "No records found in this analysis." : "Historical data format is invalid.") 
                  : "Retrieving visualization data..."}
              </div>
            )}
          </div>
        </div>

        {/* Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-white/90">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Insights
            </h4>
            <div className="space-y-4 flex-1">
              {insights?.pros_cons ? (
                <div className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {insights.pros_cons}
                </div>
              ) : (
                <p className="text-sm text-white/30 italic">No detailed analysis saved.</p>
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 shadow-xl">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Predictions & Trends
            </h4>
            <div className="flex gap-2.5 items-start">
              {insights?.predictions && <Activity className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />}
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {insights?.predictions || "No predictions saved for this session."}
              </p>
            </div>
          </div>
        </div>

        {/* Chat History Snippet */}
        {messages && messages.length > 0 && (
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 mt-4">
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Sparkles size={12} /> Chat Context
                </h4>
                <div className="space-y-4">
                    {messages.map((msg: any, idx: number) => (
                        <div key={idx} className={cn(
                            "flex flex-col max-w-[90%]",
                            msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                        )}>
                            <div className={cn(
                                "px-4 py-2 rounded-xl text-xs leading-relaxed",
                                msg.role === 'user' 
                                    ? "bg-indigo-600/20 border border-indigo-500/20 text-indigo-100" 
                                    : "bg-white/5 border border-white/5 text-white/60"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
