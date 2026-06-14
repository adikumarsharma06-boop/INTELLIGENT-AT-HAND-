import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, ShieldAlert, CheckCircle, AlertTriangle, RefreshCw, Search, ArrowLeft, Trash2, Cpu, Database, Info } from 'lucide-react';
import { SystemLog } from '../types';

export default function SystemLogsView() {
  const { logs, loadLogs, setViewMode } = useApp();
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Trigger manual sync
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadLogs();
    setTimeout(() => setIsRefreshing(false), 600); // smooth spinning
  };

  // Filter computations
  const filtered = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (log.source && log.source.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  // Calculate statistics for dynamic stats bento grid
  const infoCount = logs.filter(l => l.level === 'INFO').length;
  const warnCount = logs.filter(l => l.level === 'WARN').length;
  const errorCount = logs.filter(l => l.level === 'ERROR').length;

  // Format date helper
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
    } catch {
      return '00:00:00.000';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div id="system-logs-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 text-left">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#00E5FF]">
            <Terminal size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest font-mono">Real-time Connection Telemetry</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mt-1">Ecosystem System Logs</h1>
          <p className="text-xs text-white/50">Audit log records capture user connection, authentication pipelines, container restarts, and secure encryption handshake logs.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setViewMode('marketplace')}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs flex items-center gap-1.5 transition-all text-white/80 hover:text-white"
          >
            <ArrowLeft size={13} />
            <span>Marketplace</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/20 rounded-xl text-xs flex items-center gap-1.5 transition-all font-semibold"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync Logs</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-[#0B1020]/90 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu size={18} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Total Captured</span>
            <span className="text-lg font-mono font-black text-white">{logs.length}</span>
          </div>
        </div>

        <div className="bg-[#0B1020]/90 border border-[#00FFB2]/15 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center text-[#00FFB2]">
            <CheckCircle size={18} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Nominal (INFO)</span>
            <span className="text-lg font-mono font-black text-[#00FFB2]">{infoCount}</span>
          </div>
        </div>

        <div className="bg-[#0B1020]/90 border border-amber-500/15 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Warnings</span>
            <span className="text-lg font-mono font-black text-amber-400">{warnCount}</span>
          </div>
        </div>

        <div className="bg-[#0B1020]/90 border border-red-500/15 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Exceptions (ERR)</span>
            <span className="text-lg font-mono font-black text-red-400">{errorCount}</span>
          </div>
        </div>

      </div>

      {/* Logs Table Controls & Viewer container */}
      <div className="bg-[#0B1020] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[480px]">
        
        {/* Controls bar */}
        <div className="p-4 bg-black/30 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Level Filter Switches */}
          <div className="flex bg-[#050816] rounded-xl p-1 border border-white/5 text-xs font-mono">
            {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                  filterLevel === lvl 
                    ? 'bg-white/15 text-white' 
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search container */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 text-white/30" size={14} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search statements or sources..."
              className="w-full bg-[#050816] text-xs border border-white/10 focus:border-[#00E5FF]/40 rounded-xl pl-9 pr-4 py-2 placeholder-white/30 text-white focus:outline-none transition-all"
            />
          </div>

        </div>

        {/* Logs terminal box */}
        <div className="flex-1 overflow-x-auto font-mono text-[11px] leading-relaxed select-text p-4 min-h-[350px] max-h-[500px] overflow-y-auto bg-[#040713]">
          <div className="space-y-1.5 min-w-[700px]">
            {filtered.length > 0 ? (
              [...filtered].reverse().map((log) => {
                const isInfo = log.level === 'INFO';
                const isWarn = log.level === 'WARN';
                const isError = log.level === 'ERROR';

                let levelBadgeCls = '';
                if (isInfo) levelBadgeCls = 'text-[#00FFB2] bg-[#00FFB2]/5 border-[#00FFB2]/20';
                if (isWarn) levelBadgeCls = 'text-amber-400 bg-amber-400/5 border-amber-400/20';
                if (isError) levelBadgeCls = 'text-red-400 bg-red-400/5 border-red-400/20';

                return (
                  <div key={log.id} className="flex items-start gap-4 p-1.5 rounded hover:bg-white/2 transition-colors border border-transparent hover:border-white/5">
                    
                    {/* Timestamp column */}
                    <span className="text-white/30 select-none font-medium text-[10px]">
                      [{formatTime(log.timestamp)}]
                    </span>

                    {/* Level Column */}
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border tracking-wider select-none shrink-0 ${levelBadgeCls}`}>
                      {log.level}
                    </span>

                    {/* Source module Column */}
                    <span className="text-cyan-400 font-bold shrink-0 text-[10px]">
                      {log.source || 'SYSTEM'}
                    </span>

                    {/* Content statement */}
                    <span className="text-white/80 break-all select-text font-medium">
                      {log.message}
                    </span>

                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-24 space-y-3">
                <Database size={32} className="text-white/10" />
                <div>
                  <h4 className="text-xs text-white/50 font-bold uppercase tracking-wider">No matching telemetry</h4>
                  <p className="text-[10px] text-white/30 max-w-xs mx-auto mt-0.5">Modify filters or try launching different apps to populate audit logs.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-black/20 p-3.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/30 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFB2] animate-pulse" />
            <span>Connected: live websocket proxy (simulated TLS_1.3 tunnel)</span>
          </div>
          <span>Showing {filtered.length} of {logs.length} events</span>
        </div>

      </div>

      {/* Small informative prompt */}
      <div className="p-4 bg-cyan-950/20 border border-cyan-500/10 rounded-xl flex items-start gap-3.5 text-left">
        <Info size={16} className="text-[#00E5FF] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed text-cyan-300/80">
          <span className="font-bold text-white">How are these records populated?</span>
          <p className="text-[11px]">System Logs are backed by standard file-based persistent memory (<code>db.json</code>) managed secure server-side on Node. Node triggers records dynamically during identity registration, credentials validation, custom suggestions feeds, payment tier jumps, or when launching sandboxed apps.</p>
        </div>
      </div>

    </div>
  );
}
