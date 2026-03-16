/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { DatabasesView } from './components/DatabasesView';
import { AnalysesView } from './components/AnalysesView';
import { AnalysisDetailView } from './components/AnalysisDetailView';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);

  // Persistence: initialize from localStorage
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'databases' | 'analyses'>(() => {
    const saved = localStorage.getItem('nexus_active_view');
    return (saved as any) || 'landing';
  });
  const [currentQuery, setCurrentQuery] = useState(() => {
    return localStorage.getItem('nexus_current_query') || '';
  });
  const [activeTable, setActiveTable] = useState<string>(() => {
    return localStorage.getItem('nexus_active_table') || 'default_table';
  });

  // Save to localStorage when state changes
  React.useEffect(() => {
    localStorage.setItem('nexus_active_view', activeView);
  }, [activeView]);

  React.useEffect(() => {
    localStorage.setItem('nexus_current_query', currentQuery);
  }, [currentQuery]);

  React.useEffect(() => {
    localStorage.setItem('nexus_active_table', activeTable);
  }, [activeTable]);

  const handleAnalyze = (query: string, tableName?: string) => {
    // Clear persistence for a fresh analysis
    localStorage.removeItem('nexus_dashboard_data');
    localStorage.removeItem('nexus_dashboard_messages');
    localStorage.removeItem('nexus_dashboard_insights');
    localStorage.removeItem('nexus_dashboard_sql');

    setCurrentQuery(query);
    if (tableName) {
      setActiveTable(tableName);
    }
    setActiveView('dashboard');
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0c10] text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-indigo-950/20 to-[#0a0c10]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-pink-600/5 blur-[100px] rounded-full"></div>
      </div>

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="flex-1 relative z-10 h-full overflow-auto">
        {activeView === 'landing' ? (
          <LandingView onAnalyze={handleAnalyze} activeTable={activeTable} setActiveTable={setActiveTable} />
        ) : activeView === 'databases' ? (
          <DatabasesView setActiveTable={setActiveTable} setActiveView={setActiveView} />
        ) : activeView === 'analyses' ? (
          selectedAnalysisId ? (
            <AnalysisDetailView analysisId={selectedAnalysisId} onBack={() => setSelectedAnalysisId(null)} />
          ) : (
            <AnalysesView onSelectAnalysis={(id) => setSelectedAnalysisId(id)} />
          )
        ) : (
          <DashboardView query={currentQuery} tableName={activeTable} />
        )}
      </main>
    </div>
  );
}
