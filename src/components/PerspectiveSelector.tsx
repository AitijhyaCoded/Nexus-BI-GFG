import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Check, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Table as TableIcon, 
  Layers, 
  Zap 
} from 'lucide-react';
import { cn } from '../utils';

export interface ChartOption {
  sql: string;
  chart_type: string;
  confidence: 'High' | 'Medium' | 'Low';
  rationale: string;
  summary: string;
  data: any[];
}

interface PerspectiveSelectorProps {
  options: ChartOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
}

const getChartIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bar': return <BarChart3 size={14} />;
    case 'line': return <LineChart size={14} />;
    case 'pie': return <PieChart size={14} />;
    case 'table': return <TableIcon size={14} />;
    default: return <Layers size={14} />;
  }
};

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'High': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
    case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
    case 'Low': return 'text-rose-400 bg-rose-400/10 border-rose-500/20';
    default: return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
  }
};

const getConfidenceDot = (confidence: string) => {
  switch (confidence) {
    case 'High': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    case 'Medium': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    case 'Low': return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
    default: return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';
  }
};

export function PerspectiveSelector({ options, selectedIndex, onSelect, label = "Perspective" }: PerspectiveSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!options || options.length === 0) return null;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 group",
          isOpen && "border-indigo-500/40 bg-white/10 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/10"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">{label}</span>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <div className="flex items-center gap-2">
            <div className={cn("text-indigo-400 group-hover:scale-110 transition-transform duration-300")}>
              {getChartIcon(selectedOption.chart_type)}
            </div>
            <span className="text-xs font-bold text-white tracking-tight capitalize">
              {selectedOption.chart_type}
            </span>
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider",
              getConfidenceColor(selectedOption.confidence)
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getConfidenceDot(selectedOption.confidence))}></div>
              {selectedOption.confidence}
            </div>
          </div>
        </div>
        <ChevronDown 
          size={14} 
          className={cn(
            "text-white/40 transition-transform duration-300",
            isOpen ? "rotate-180 text-indigo-400" : "group-hover:text-white/60"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <div className="flex items-center gap-2 text-white/30">
              <Zap size={12} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Available Insights</span>
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelect(idx);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-3 text-left transition-all duration-200 group relative",
                  selectedIndex === idx ? "bg-indigo-500/10" : "hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                  selectedIndex === idx ? "text-indigo-400" : "text-white/40 group-hover:text-white/80"
                )}>
                  {getChartIcon(option.chart_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={cn(
                      "text-[13px] font-bold transition-colors duration-200",
                      selectedIndex === idx ? "text-white" : "text-white/60 group-hover:text-white"
                    )}>
                      {option.chart_type.charAt(0).toUpperCase() + option.chart_type.slice(1)} Perspective
                    </span>
                    <div className={cn(
                      "px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border shrink-0",
                      getConfidenceColor(option.confidence)
                    )}>
                      {option.confidence}
                    </div>
                  </div>
                  <p className="text-[10px] text-white/30 line-clamp-1 group-hover:text-white/50 transition-colors italic">
                    {option.summary || option.rationale || "Suggested data visualization"}
                  </p>
                </div>

                {selectedIndex === idx && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                )}
                
                {selectedIndex === idx && (
                  <Check size={14} className="text-indigo-400 absolute right-3 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
