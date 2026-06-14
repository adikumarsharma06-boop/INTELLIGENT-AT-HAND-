/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import InnerAppRunner from './components/InnerAppRunner';
import AdminPanel from './components/AdminPanel';
import SystemLogsView from './components/SystemLogsView';
import IconMapper from './components/IconMapper';
import { 
  Search, Grid, Bell, Star, ArrowUpRight, LogIn, LogOut, User as UserIcon, 
  Menu, X, Sparkles, HelpCircle, FileText, Check, ShieldAlert, Heart, Info, Mail,
  Terminal, Activity, RefreshCw, Instagram, ExternalLink, MessageSquare
} from 'lucide-react';
import { INITIAL_CATEGORIES } from './initialData';
import InteractiveAuthGate from './components/InteractiveAuthGate';
import IdentitySavingsReports from './components/IdentitySavingsReports';
import InteractivePointerShine from './components/InteractivePointerShine';
import ThreeDCard from './components/ThreeDCard';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu } from 'lucide-react';

function AppContent() {
  const { 
    apps, user, notifications, logs, activeAppId, searchTerm, selectedCategory, sortBy, 
    viewMode, notificationsOpen, login, signup, logout, upgradeSubscription,
    setSearchTerm, setSelectedCategory, setSortBy, setViewMode, setNotificationsOpen,
    toggleFavorite, launchApp, submitSuggestion, closeActiveApp, loadLogs
  } = useApp();

  const [portalUnlocked, setPortalUnlocked] = useState(false);
  const [readyLoading, setReadyLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  // Simulated System Health real-time connection quality indicators
  const [latency, setLatency] = useState(24);
  const [jitter, setJitter] = useState(0.8);
  const [healthHovered, setHealthHovered] = useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setLatency(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // fluctuate gently
        const next = prev + change;
        return next < 12 ? 12 : next > 38 ? 38 : next;
      });
      setJitter(prev => {
        const change = (Math.random() * 0.3) - 0.15;
        const next = parseFloat((prev + change).toFixed(1));
        return next < 0.3 ? 0.3 : next > 1.8 ? 1.8 : next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-unlock if user is present on mount
  React.useEffect(() => {
    if (user) {
      setPortalUnlocked(true);
    }
  }, [user]);

  React.useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 8;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setReadyLoading(false);
        }, 400);
      }
      setLoadPct(p);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('adikumarsharma06@gmail.com');
  const [authName, setAuthName] = useState('Adi Kumar Sharma');
  
  // Suggestion form under Contact page
  const [contactComment, setContactComment] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Footer Feedback form states
  const [footerFeedbackComment, setFooterFeedbackComment] = useState('');
  const [footerFeedbackEmail, setFooterFeedbackEmail] = useState('');
  const [footerFeedbackRating, setFooterFeedbackRating] = useState(5);
  const [footerFeedbackSuccess, setFooterFeedbackSuccess] = useState(false);
  const [footerFeedbackSubmitting, setFooterFeedbackSubmitting] = useState(false);

  // FAQ item toggle
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);

  // Billing interactive state
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState<'pro' | 'business' | null>(null);
  const [isUpgradingSimulated, setIsUpgradingSimulated] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);

  const [isGridLoading, setIsGridLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    setIsGridLoading(true);
    const timer = setTimeout(() => {
      setIsGridLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  // Search/Filter logic for Marketplace apps
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return b.id.localeCompare(a.id); // Default / New
  });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    if (authMode === 'login') {
      const ok = await login(authEmail);
      if (ok) setAuthModalOpen(false);
    } else {
      const ok = await signup(authEmail, authName);
      if (ok) setAuthModalOpen(false);
    }
  };

  const submitContactSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactComment.trim() || !user) return;
    const ok = await submitSuggestion(contactComment);
    if (ok) {
      setContactSuccess(true);
      setContactComment('');
      setTimeout(() => setContactSuccess(false), 3000);
    }
  };

  const submitFooterFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerFeedbackComment.trim()) return;
    
    setFooterFeedbackSubmitting(true);
    const finalEmail = user?.email || footerFeedbackEmail.trim() || 'anonymous@iah.ai';
    const ratingLabel = '⭐'.repeat(footerFeedbackRating);
    const compiledComment = `[Footer Rating: ${ratingLabel} (${footerFeedbackRating}/5)] ${footerFeedbackComment.trim()}`;
    
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: finalEmail, 
          comment: compiledComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setFooterFeedbackSuccess(true);
        setFooterFeedbackComment('');
        setFooterFeedbackEmail('');
        setFooterFeedbackRating(5);
        setTimeout(() => setFooterFeedbackSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error submitting footer feedback:', err);
    } finally {
      setFooterFeedbackSubmitting(false);
    }
  };

  const handleSimulatedUpgrade = async () => {
    if (!selectedPlanUpgrade) return;
    setIsUpgradingSimulated(true);
    setTimeout(async () => {
      const ok = await upgradeSubscription(selectedPlanUpgrade);
      setIsUpgradingSimulated(false);
      if (ok) {
        setUpgradeComplete(true);
        setTimeout(() => {
          setUpgradeComplete(false);
          setSelectedPlanUpgrade(null);
          setViewMode('marketplace');
        }, 2500);
      }
    }, 2000);
  };

  // Trending search trigger terms
  const trendingSearches = ['EarthVision', 'Habitation', 'Architech', 'Blueprint', 'Satellite'];

  if (readyLoading) {
    const loadingStatusText = 
      loadPct < 30 ? 'Initializing cryptographic microservices...' :
      loadPct < 65 ? 'Establishing secure sandbox tunnels...' :
      loadPct < 90 ? 'Optimizing regional database layers...' :
      'Handshaking completed with sovereign core!';

    return (
      <div className="fixed inset-0 z-50 bg-[#050816] flex flex-col items-center justify-center p-6 text-white overflow-hidden select-none">
        {/* Ambient background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        
        <div className="max-w-md w-full text-center space-y-10 z-10 animate-in fade-in duration-500">
          
          <div className="space-y-4">
            {/* Beautiful Custom IAH Vector Logo */}
            <div className="relative inline-block">
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] opacity-30 blur-xl animate-pulse" />
              <svg className="w-24 h-24 mx-auto relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#00FFB2" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" 
                  stroke="url(#logoGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M50 25 L71 37 L71 63 L50 75 L29 63 L29 37 Z" 
                  stroke="url(#logoGrad)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                  opacity="0.8"
                />
                <circle cx="50" cy="50" r="10" fill="url(#logoGrad)" />
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
              </svg>
            </div>
            
            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-[0.25em] text-white">IAH.AI</h1>
              <p className="text-[10px] font-black tracking-[0.3em] text-[#00FFB2] uppercase">
                INTELLIGENT HUB SYSTEM
              </p>
            </div>
          </div>
          
          {/* Progressive loader state card */}
          <div className="space-y-4 p-6 bg-[#0B1020]/90 rounded-2xl border border-white/5 shadow-2xl relative">
            <div className="flex justify-between items-center text-[10px] font-mono text-white/50 tracking-wider">
              <span className="flex items-center gap-1.5 uppercase font-bold text-white/40">
                <span className="w-1.5 h-1.5 bg-[#00FFB2] rounded-full animate-ping" />
                SYSTEM PREFLIGHT
              </span>
              <span className="text-[#00E5FF] font-black">{loadPct}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
              <div 
                className="h-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] rounded-full transition-all duration-150" 
                style={{ width: `${loadPct}%` }}
              />
            </div>
            
            <div className="text-[10px] font-mono text-[#00FFB2] tracking-tight truncate uppercase">
              {loadingStatusText}
            </div>
          </div>

          <div className="text-center font-bold tracking-[0.35em] text-white/40 uppercase text-[9px] animate-pulse">
            BUILT INDIA TO GROW INDIA ..
          </div>
        </div>
      </div>
    );
  }

  // Render loading sequence gate first if no user or portal is still locked
  if (!user || !portalUnlocked) {
    return (
      <InteractiveAuthGate onSuccess={() => setPortalUnlocked(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-[#FFFFFF] font-sans antialiased selection:bg-[#00E5FF]/35 selection:text-white">
      
      {/* Interactive global pointer spotlight follow effect is active */}
      <InteractivePointerShine />
      
      {/* 1. STICKY GLASSMORPHIC HEAD BAR */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[#050816]/75 backdrop-blur-md border border-white/10 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Platform Identity */}
          <div 
            onClick={() => { setViewMode('marketplace'); setSearchTerm(''); setSelectedCategory('All'); }}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-[#7C3AED] via-[#00E5FF] to-[#00FFB2] p-[1px]">
              <div className="w-full h-full bg-[#050816] rounded-[7px] flex items-center justify-center font-black text-xs tracking-wider text-white">
                IAH
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-widest text-white group-hover:text-[#00E5FF] transition-all">IAH.AI</span>
              <span className="block text-[8px] tracking-wider text-[#00FFB2] font-mono leading-none">INTELLIGENT HUB</span>
            </div>
          </div>

          {/* Desktop Glassmorphic Tab Navigation Bar */}
          <nav className="hidden lg:flex items-center bg-white/2 border border-white/5 p-0.5 rounded-xl ml-2">
            {[
              { id: 'marketplace', label: 'App Center' },
              { id: 'dashboard', label: 'My Console' },
              { id: 'logs', label: 'System Logs' },
              { id: 'faq', label: 'FAQ Hub' },
              { id: 'about', label: 'About Desk' },
              { id: 'contact', label: 'Report Suggestion' }
            ].map(tab => {
              const isActive = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setViewMode(tab.id as any);
                    if (mobileMenuOpen) setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider cursor-pointer select-none ${
                    isActive 
                      ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 font-black shadow-[0_0_8px_rgba(0,229,255,0.1)]' 
                      : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
            {user?.email === 'adikumarsharma06@gmail.com' && (
              <button
                onClick={() => {
                  setViewMode('admin');
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider cursor-pointer select-none border ${
                  viewMode === 'admin'
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'text-red-400/60 hover:text-red-400 hover:bg-red-950/10 border-transparent'
                }`}
              >
                Admin Desk
              </button>
            )}
          </nav>

          {/* System Health Status Indicator */}
          <div 
            id="system-health-status-indicator"
            className="relative flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/2 border border-white/5 hover:border-[#00FFB2]/20 transition-all cursor-pointer group/health select-none"
            onMouseEnter={() => setHealthHovered(true)}
            onMouseLeave={() => setHealthHovered(false)}
            onClick={() => setHealthHovered(prev => !prev)}
            title="System Connection Diagnostics"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00FFB2]"></span>
            </span>
            <div className="flex items-center gap-1 font-mono text-[9px] tracking-wide">
              <span className="text-white/40 font-semibold uppercase hidden xs:inline">System:</span>
              <span className="text-[#00FFB2] font-black uppercase">Nominal</span>
            </div>

            {/* Hover Connection Telemetry Details Popover */}
            <AnimatePresence>
              {healthHovered && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scaleY: 0.95, transformOrigin: "top" }}
                  animate={{ opacity: 1, height: "auto", scaleY: 1, transformOrigin: "top" }}
                  exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                  className="absolute left-0 top-full mt-2 w-48 bg-[#0B1020] border border-white/10 rounded-xl p-3 shadow-2xl z-50 text-left space-y-1.5 pointer-events-auto"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#00E5FF]">Health Diagnostics</span>
                    <span className="text-[8px] bg-[#00FFB2]/10 text-[#00FFB2] px-1.5 py-0.5 rounded font-black font-mono">NOMINAL</span>
                  </div>
                  <div className="space-y-1 font-mono text-[9px] text-white/60">
                    <div className="flex justify-between">
                      <span>Telemetry Status:</span>
                      <span className="text-[#00FFB2] font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Simulated Latency:</span>
                      <span className="text-white font-semibold">{latency} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Signal Jitter:</span>
                      <span className="text-white font-semibold">{jitter} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packet Dropped:</span>
                      <span className="text-[#00FFB2] font-semibold">0.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Secure link:</span>
                      <span className="text-white font-semibold">QUIC / TLS_1.3</span>
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-1.5 mt-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewMode('logs');
                        setHealthHovered(false);
                      }}
                      className="w-full py-1.5 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] font-black text-[8px] tracking-widest uppercase rounded border border-[#00E5FF]/20 cursor-pointer text-center block transition-all"
                    >
                      Audit System Logs
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* User Account state indicators / controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* System Terminal Logs Icon */}
          <button 
            id="header-terminal-logs"
            onClick={() => setViewMode(viewMode === 'logs' ? 'marketplace' : 'logs')}
            className={`p-2.5 rounded-lg border text-[#CFCFCF] transition-all relative cursor-pointer flex items-center justify-center ${
              viewMode === 'logs' 
                ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                : 'bg-white/3 border-white/5 hover:border-white/10 hover:text-white'
            }`}
            title="System Registry Logs"
          >
            <Terminal size={15} />
          </button>

          {/* Notifications Announcement list */}
          <div className="relative">
            <button 
              id="header-notif-bell"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-lg bg-white/3 border border-white/5 hover:border-white/10 text-[#CFCFCF] hover:text-white transition-all relative cursor-pointer"
            >
              <Bell size={15} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#0B1020] border border-white/10 rounded-2xl p-4 shadow-2xl relative z-50 text-left animate-in fade-in-50 duration-200">
                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#00E5FF]">System Broadcast News</h4>
                  <span className="text-[9px] bg-[#00E5FF]/10 text-[#00E5FF] px-1.5 py-0.5 rounded font-black font-mono">LIVE FEED</span>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-2.5 rounded hover:bg-white/5 border border-white/5 transition-all">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-white tracking-wide">{notif.title}</span>
                        <span className="text-[8px] font-mono text-white/30">{notif.date}</span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed capitalize-first">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User state details */}
          {user ? (
            <div className="flex items-center gap-3 bg-white/2 border border-white/5 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] flex items-center justify-center font-bold text-xs text-white border border-white/20 select-none">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold leading-none">{user.fullName}</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#00FFB2]">{user.subscription} TIER</span>
              </div>
              <button 
                id="btn-logout"
                onClick={logout}
                className="p-1 text-white/30 hover:text-red-400 transition-all cursor-pointer"
                title="Disconnect Account Session"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              id="btn-trigger-login"
              onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00E5FF] hover:bg-[#00FFB2] text-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn size={13} />
              <span className="hidden xs:inline">Connect Account</span>
            </button>
          )}

          {/* Mobile Menu Multi-Toggle Drawer Trigger */}
          <button 
            id="mobile-drawer-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-white/3 border border-white/5 hover:border-white/10 text-white transition-all cursor-pointer flex lg:hidden items-center justify-center active:scale-95"
            aria-label="Toggle navigation directory"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Slide-down Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed top-[58px] left-0 w-full z-30 bg-[#050816]/95 border-b border-white/10 backdrop-blur-xl lg:hidden overflow-hidden shadow-2xl block"
          >
            <div className="p-5 space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-[#00FFB2] tracking-widest uppercase block">Ecosystem Directory</span>
                <span className="text-white/40 text-[10px]">Tap index nodes below to route system views instantly.</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'marketplace', label: 'App Center', desc: 'Browse available launch items' },
                  { id: 'dashboard', label: 'My Console', desc: 'User telemetry reports' },
                  { id: 'logs', label: 'System Logs', desc: 'Realtime registry outputs' },
                  { id: 'faq', label: 'FAQ Hub', desc: 'Ecosystem support guides' },
                  { id: 'about', label: 'About Desk', desc: 'Learn design mechanics' },
                  { id: 'contact', label: 'Report Issue', desc: 'Submit system logs' }
                ].map(tab => {
                  const isActive = viewMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setViewMode(tab.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-20 active:scale-[0.98] ${
                        isActive
                          ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-white font-bold'
                          : 'bg-[#0B1020]/80 border-white/5 text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs font-black uppercase tracking-wider">{tab.label}</span>
                      <span className="text-[9px] text-white/40 tracking-normal capitalize-first mt-1 truncate">{tab.desc}</span>
                    </button>
                  );
                })}
                {user?.email === 'adikumarsharma06@gmail.com' && (
                  <button
                    onClick={() => {
                      setViewMode('admin');
                      setMobileMenuOpen(false);
                    }}
                    className={`col-span-2 p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-20 active:scale-[0.98] ${
                      viewMode === 'admin'
                        ? 'bg-red-500/10 border-red-500/40 text-red-400 font-extrabold'
                        : 'bg-[#0B1020]/80 border-white/5 text-red-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider">Admin Panel</span>
                    <span className="text-[9px] text-white/40 tracking-normal mt-1">Primary cloud control metrics</span>
                  </button>
                )}
              </div>
              
              {/* Connected account shortcut for comfort */}
              <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-[#7C3AED] flex items-center justify-center font-bold text-xs text-white">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white leading-tight">{user.fullName}</span>
                      <span className="block text-[8px] text-[#00FFB2] font-mono leading-none tracking-widest">{user.subscription} STATUS</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl text-center active:scale-95"
                  >
                    Connect Wallet Account
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN ACTIVE APP INTEGRATIONS VIEW (Renders Full-Screen runner if active) */}
      <AnimatePresence mode="wait">
        {activeAppId ? (
          <motion.div
            key="runner-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <InnerAppRunner />
          </motion.div>
        ) : (
          <motion.main
            key="marketplace-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
          
          {/* Sub-view router conditional renderer */}
          {viewMode === 'marketplace' && (
            <div id="marketplace-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-7xl mx-auto space-y-12">
              
              {/* Optional Landing teaser at top */}
              <LandingPage />

              {/* Dynamic App Center Catalog Search & Grid */}
              <motion.div 
                id="explore-index" 
                className="space-y-8 pt-12 border-t border-white/5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                
                {/* Search controller form */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#0B1020]/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                  
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] bg-clip-text text-transparent">IAH Sovereign App Center</h3>
                    <p className="text-xs text-white/50">Search app name, capability tags, or select your preferred system category below.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3.5 flex-1 max-w-2xl">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3.5 text-white/30" size={15} />
                      <input 
                        id="search-input-box"
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search model capabilities, tag shortcuts (e.g. Chatbot, Blueprints, Satellite)..."
                        className="w-full bg-[#050816] border border-white/10 focus:border-[#00E5FF]/50 rounded-xl pl-10 pr-4 py-3 placeholder-white/30 text-xs focus:outline-none transition-all"
                      />
                    </div>
                    
                    {/* Sort Options */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#050816] text-xs border border-white/10 rounded-xl px-4 py-3 focus:outline-none transition-all cursor-pointer text-white"
                    >
                      <option value="featured">★ Ranked by Featured Status</option>
                      <option value="popular">🚀 Sorted by Recent Use</option>
                    </select>
                  </div>

                </div>

                {/* Trending searches tags list */}
                <div className="flex items-center gap-2.5 text-xs text-white/40 pt-1">
                  <span className="font-bold">Shortcuts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map(term => (
                      <button 
                        key={term}
                        onClick={() => setSearchTerm(term)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-[10px] text-white/60 hover:text-white font-mono"
                      >
                        #{term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Apps Results display in 3D perspective boxes */}
                <motion.div 
                  key={`${selectedCategory}-${searchTerm}`}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
                >
                  {isGridLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <div 
                        key={`skeleton-${idx}`}
                        className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-5 shadow-lg relative min-h-[220px] overflow-hidden flex flex-col justify-between animate-pulse"
                      >
                        <div className="space-y-4">
                          {/* Skeleton Header: icon + text */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10" />
                              <div className="space-y-2">
                                <div className="w-28 h-4 bg-white/5 rounded-full" />
                                <div className="w-16 h-2.5 bg-white/5 rounded-full" />
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10" />
                          </div>

                          {/* Skeleton Description */}
                          <div className="space-y-2 mt-4">
                            <div className="w-full h-3 bg-white/5 rounded-full" />
                            <div className="w-5/6 h-3 bg-white/5 rounded-full" />
                            <div className="w-2/3 h-3 bg-white/5 rounded-full" />
                          </div>
                        </div>

                        {/* Skeleton Footer */}
                        <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-4 rounded-full bg-[#00FFB2]/5 border border-[#00FFB2]/10" />
                            <div className="w-10 h-4 rounded-full bg-[#00E5FF]/5 border border-[#00E5FF]/10" />
                          </div>
                          <div className="w-24 h-7 rounded-xl bg-white/5 border border-white/10 ml-auto" />
                        </div>
                      </div>
                    ))
                  ) : filteredApps.length > 0 ? (
                    filteredApps.map((app, appIdx) => (
                      <ThreeDCard 
                        key={app.id}
                        id={`app-card-${app.id}`}
                        index={appIdx}
                        layoutId={`app-card-${app.id}`}
                        className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-[#00E5FF]/40 text-left"
                      >
                        <div className="space-y-4 h-full flex flex-col justify-between">
                          
                          <div className="space-y-4">
                            {/* Header section of card */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:text-[#00FFB2] transition-colors shadow">
                                  <IconMapper name={app.logo} size={18} />
                                </div>
                                <div className="text-left">
                                  <h4 className="font-bold text-sm tracking-wide text-white group-hover:text-[#00E5FF] transition-all">
                                    {app.name}
                                  </h4>
                                  <span className="block text-[9px] uppercase font-bold tracking-widest text-[#00FFB2] mt-0.5">
                                    {app.category}
                                  </span>
                                </div>
                              </div>

                              {/* Saved Favorites Heart block */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(app.id);
                                }}
                                className={`p-1.5 rounded-lg border border-white/10 bg-white/2 hover:bg-white/10 transition-all cursor-pointer ${
                                  user?.favorites.includes(app.id) ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-white/30'
                                }`}
                                title={user?.favorites.includes(app.id) ? 'Remove Favorite' : 'Save as Favorite'}
                              >
                                <Heart size={14} fill={user?.favorites.includes(app.id) ? 'currentColor' : 'none'} />
                              </button>
                            </div>

                            {/* App Body Description */}
                            <p className="text-white/50 text-[11px] leading-relaxed line-clamp-3">
                              {app.description}
                            </p>
                          </div>

                          {/* Bottom action bar */}
                          <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 animate-pulse-subtle">
                              {app.uptime && (
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/15 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-[#00FFB2] animate-ping" />
                                  {app.uptime} SLD
                                </span>
                              )}
                              {app.estimatedLaunchTime && (
                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/15">
                                  ⏱ {app.estimatedLaunchTime}
                                </span>
                              )}
                            </div>

                            <button
                              id={`btn-launch-app-${app.id}`}
                              onClick={() => launchApp(app.id)}
                              className="px-4 py-1.5 text-xs font-bold bg-white/5 border border-white/15 hover:border-[#00E5FF]/40 rounded-xl group-hover:bg-[#00E5FF] group-hover:text-black transition-all flex items-center gap-1 cursor-pointer ml-auto"
                            >
                              <span>Launch Pipeline</span>
                              <ArrowUpRight size={13} />
                            </button>
                          </div>

                        </div>
                      </ThreeDCard>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-24 bg-[#0B1020]/50 border border-dashed border-white/10 rounded-2xl">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 mx-auto mb-3">
                        <Grid size={24} />
                      </div>
                      <h4 className="font-semibold text-sm">No applications found</h4>
                      <p className="text-xs text-white/40 max-w-[280px] mx-auto mt-1 leading-normal">Adjust filters or type different keywords to look up other components.</p>
                    </div>
                  )}
                </motion.div>

              </motion.div>

            </div>
          )}

          {/* 3. MENUS VIEWMODE ROUTINGS VIEWPORTS */}
          {viewMode === 'dashboard' && (
            <div id="dashboard-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
              
              <div className="border-b border-white/10 pb-5">
                <h1 className="text-3xl font-bold tracking-tight">My Personal Console</h1>
                <p className="text-xs text-white/50">Manage subscription levels, launch active shortcuts, and track workspace operations.</p>
              </div>

              {user ? (
                <div className="space-y-8">
                  
                  {/* Account Data Savings, Credentials Report and Communication dispatch options */}
                  <div className="bg-[#0B1020]/40 rounded-2xl border border-white/5 p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                      <Cpu size={16} className="text-[#00E5FF] animate-pulse" />
                      <h3 className="text-xs uppercase font-black tracking-widest text-white">Identity Credentials & Data Optimization Desk</h3>
                    </div>
                    <IdentitySavingsReports />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Account detail overview */}
                  <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="text-center space-y-3 pb-6 border-b border-white/10">
                      <img 
                        src={user.avatarUrl} 
                        alt="Your user identity icon" 
                        className="w-20 h-20 rounded-2xl mx-auto bg-[#050816] border border-white/15 p-2 shadow-inner"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{user.fullName}</h3>
                        <p className="text-white/40 text-xs">{user.email}</p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#7C3AED] to-fuchsia-600 border border-fuchsia-400 text-white font-black text-[10px] tracking-widest uppercase rounded-full shadow-lg shadow-fuchsia-500/15">
                        {user.subscription} tier ACTIVE
                      </span>
                    </div>

                    <div className="space-y-4 text-xs">
                      <h4 className="font-bold uppercase tracking-wider text-white/50 text-[10px]">Security Information</h4>
                      <div className="bg-white/3 border border-white/5 rounded-xl p-3.5 space-y-2.5 font-mono text-[11px] text-white/80">
                        <div className="flex justify-between">
                          <span>Identity ID:</span>
                          <span className="text-white/40">{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified:</span>
                          <span className="text-[#00FFB2]">TRUE</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tunnel secure:</span>
                          <span className="text-[#00E5FF]">TLS_1.3</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Favorites and Recents tracker columns */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Saved Launcher list */}
                    <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#00E5FF] mb-4 flex items-center gap-2">
                        <Heart size={15} className="text-red-400" />
                        <span>Saved Favorite Launchers</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.favorites.length > 0 ? (
                          user.favorites.map(favId => {
                            const appObj = apps.find(a => a.id === favId);
                            if (!appObj) return null;
                            return (
                              <div key={favId} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-3 hover:border-[#00E5FF]/20 transition-all">
                                <div>
                                  <h4 className="font-bold text-xs tracking-wide">{appObj.name}</h4>
                                  <span className="block text-[9px] uppercase tracking-wider text-[#00FFB2]">{appObj.category}</span>
                                </div>
                                <button
                                  onClick={() => launchApp(favId)}
                                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#00E5FF] border border-white/10 flex items-center"
                                >
                                  <ArrowUpRight size={13} />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="col-span-full py-6 text-center text-xs text-white/30 italic">No favorite applications saved. Click heart icons on card pages to bookmark them.</p>
                        )}
                      </div>
                    </div>

                    {/* Recently Used */}
                    <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#7C3AED]">Recently Fired Pipelines</h3>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto">
                        {user.recentApps.length > 0 ? (
                          user.recentApps.map(recId => {
                            const appObj = apps.find(a => a.id === recId);
                            if (!appObj) return null;
                            return (
                              <div key={recId} className="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-all text-xs">
                                <span>{appObj.name} <strong className="text-[10px] text-white/30 ml-2">({appObj.category})</strong></span>
                                <button
                                  onClick={() => launchApp(recId)}
                                  className="text-[11px] text-[#00E5FF] hover:underline"
                                >
                                  Re-launch
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="py-4 text-center text-xs text-white/30 italic">Launch platform applications to populate session activity logs.</p>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
              ) : (
                <div className="text-center py-24 bg-[#0B1020] rounded-2xl border border-white/10 max-w-xl mx-auto">
                  <h3 className="text-lg font-bold mb-2">Connect Session Identity</h3>
                  <p className="text-xs text-white/50 mb-6 max-w-sm mx-auto">Authenticate your developer account or use one-click custom sandbox signup to save favorites and log histories.</p>
                  <button
                    onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider text-black bg-[#00E5FF] hover:bg-[#00FFB2] cursor-pointer"
                  >
                    Authenticate Identity
                  </button>
                </div>
              )}

            </div>
          )}

          {/* Pricing Grid */}
          {viewMode === 'pricing' && (
            <div id="pricing-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
              
              <div className="text-center space-y-3 pb-8">
                <span className="text-[10px] text-[#00FFB2] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#00FFB2]/5 border border-[#00FFB2]/15">
                  COSMIC SUITE FLEXIBLE PLANS
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight">Upgrade to Premium Capabilities</h1>
                <p className="text-[#CFCFCF] text-xs max-w-md mx-auto leading-relaxed">
                  Support continuous GPU cloud compute nodes. Pay via sandbox simulated Stripe / Razorpay models seamlessly.
                </p>
              </div>

              {/* simulated payment popup overlay */}
              {selectedPlanUpgrade && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
                  <div className="bg-[#0B1020] p-8 rounded-3xl border border-white/15 max-w-md w-full text-center relative shadow-2xl">
                    <button 
                      onClick={() => setSelectedPlanUpgrade(null)}
                      className="absolute top-4 right-4 text-white/30 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                    
                    <span className="text-[10px] text-[#00E5FF] font-black tracking-widest block uppercase mb-2">Simulated Secure Gateway</span>
                    
                    {upgradeComplete ? (
                      <div className="space-y-4 py-8 animate-bounce">
                        <div className="w-16 h-16 rounded-full bg-[#00FFB2]/10 border border-[#00FFB2] flex items-center justify-center mx-auto text-[#00FFB2]">
                          <Check size={32} />
                        </div>
                        <h3 className="text-xl font-bold">Transaction Certified!</h3>
                        <p className="text-[#CFCFCF] text-xs">Upgraded to premium plan successfully. Refreshing layout.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <h3 className="text-xl font-bold">Stasis Upgrade: {selectedPlanUpgrade.toUpperCase()}</h3>
                        <p className="text-xs text-white/50 leading-relaxed">
                          This coordinates standard full-stack authentication parameters and immediately transitions subscription status records in index files. No cash requested.
                        </p>
                        
                        <div className="bg-[#050816] rounded-xl p-4 text-left border border-white/5 space-y-2.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Item:</span>
                            <span className="font-bold text-white">{selectedPlanUpgrade === 'pro' ? 'Pro Lifetime' : 'Enterprise Suite'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Fees:</span>
                            <span className="font-bold text-[#00FFB2] font-mono">{selectedPlanUpgrade === 'pro' ? '$29.00 USD' : '$99.00 USD'}</span>
                          </div>
                          <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                            <span className="text-white/40">Network Status:</span>
                            <span className="text-[#00E5FF] uppercase font-bold text-[10px]">SANDBOX PREFLIGHT ACTIVE</span>
                          </div>
                        </div>

                        <button
                          onClick={handleSimulatedUpgrade}
                          disabled={isUpgradingSimulated}
                          className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] text-black font-extrabold tracking-wider uppercase text-xs rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                        >
                          {isUpgradingSimulated ? (
                            <>
                              <div className="w-4.5 h-4.5 rounded-full border-2 border-black border-t-white animate-spin"></div>
                              <span>Authorizing tokens on cloud...</span>
                            </>
                          ) : (
                            <span>Simulate Stripe Payment</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-6">
                
                {/* Plan 1 */}
                <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
                  <div className="space-y-4">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest block">Standard Play</span>
                    <h3 className="text-2xl font-black">FREE TIER</h3>
                    <p className="text-white/50 text-xs">Access basic models and simple text copywriting companion copilots.</p>
                    <div className="py-4 border-y border-white/5 text-3xl font-extrabold font-mono">$0 <span className="text-xs text-white/30 font-normal">/ Always free</span></div>
                    <ul className="space-y-2 text-xs text-white/70">
                      <li>✓ Unified chat subroutines</li>
                      <li>✓ Access basic layouts</li>
                      <li>✓ Auto session history tracker</li>
                    </ul>
                  </div>
                  <button 
                    disabled 
                    className="w-full py-2.5 rounded bg-white/5 border border-white/10 text-white/40 text-xs font-semibold uppercase mt-8"
                  >
                    Current Plan
                  </button>
                </div>

                {/* Plan 2 */}
                <div className="bg-[#0B1020]/90 border border-[#7C3AED] rounded-2xl p-6 shadow-xl flex flex-col justify-between text-left relative overflow-hidden shadow-2xl shadow-[#7C3AED]/5">
                  <div className="absolute top-0 right-0 p-2 bg-[#7C3AED] text-[8px] uppercase font-black text-white px-3 tracking-widest">POPULAR CHOICE</div>
                  <div className="space-y-4">
                    <span className="text-[10px] text-[#00E5FF] uppercase font-black tracking-widest block">Pro Suite</span>
                    <h3 className="text-2xl font-black">PRO UNLIMITED</h3>
                    <p className="text-white/50 text-xs">Unlock continuous synthesis filters, image aspect controls, and custom data analysts.</p>
                    <div className="py-4 border-y border-white/5 text-3xl font-extrabold font-mono">$29 <span className="text-xs text-white/30 font-normal">/ month billing</span></div>
                    <ul className="space-y-2 text-xs text-white/70">
                      <li>✓ All basic subroutines</li>
                      <li>✓ High-fidelity text-to-image studio</li>
                      <li>✓ Standard copilot execution limits</li>
                      <li>✓ Customer support panel priorities</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setSelectedPlanUpgrade('pro')}
                    className="w-full py-2.5 rounded bg-[#7C3AED] hover:bg-opacity-80 text-white font-bold text-xs uppercase mt-8 cursor-pointer shadow-lg shadow-[#7C3AED]/20 hover:-translate-y-0.5 transition-all"
                  >
                    Choose Pro Upgrade
                  </button>
                </div>

                {/* Plan 3 */}
                <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
                  <div className="space-y-4">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest block">Enterprise Scale</span>
                    <h3 className="text-2xl font-black">BUSINESS SUITE</h3>
                    <p className="text-white/50 text-xs">Unlimited GPU computing pathways, priority servers, and API marketplace plugins.</p>
                    <div className="py-4 border-y border-white/5 text-3xl font-extrabold font-mono">$99 <span className="text-xs text-white/30 font-normal">/ month billing</span></div>
                    <ul className="space-y-2 text-xs text-white/70">
                      <li>✓ All premium pro modules</li>
                      <li>✓ Relational storage capabilities support</li>
                      <li>✓ Maximum model limits allocation</li>
                      <li>✓ Priority direct Slack access</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => setSelectedPlanUpgrade('business')}
                    className="w-full py-2.5 rounded bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase mt-8 cursor-pointer"
                  >
                    Select Business Plan
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* About Architecture */}
          {viewMode === 'about' && (
            <div id="about-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200 text-left">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest">ENGINE DETAILS</span>
                <h1 className="text-3xl font-bold tracking-tight mt-1.5">IAH.AI System Architecture</h1>
                <p className="text-xs text-white/50">Details regarding pipeline orchestration, security sandboxes, and custom integrations.</p>
              </div>

              <div className="space-y-6 text-xs text-white/70 leading-relaxed">
                <p>
                  <strong>IAH.AI (Intelligent AI Hub)</strong> represents the next frontier in browser-based application management tools. Built over high-concurrency Node and express servers, the platform guarantees rapid microservices handling the parsing of multimodal datasets.
                </p>
                
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#00E5FF]">Key Structural Advantages</h3>
                <ul className="space-y-3 list-disc pl-5">
                  <li><strong>Robust API Cloaking Layouts:</strong> No sensitive Gemini or third party Stripe client key identifiers are ever loaded or bundled on browser threads. Raw queries utilize protected REST parameters securely managed back-end.</li>
                  <li><strong>Adaptive Lucide Icon Mapping Indexes:</strong> Custom database apps items serialize dynamically into design headings using flexible mappings.</li>
                  <li><strong>Standard local database persistence:</strong> An automated <code>db.json</code> engine preserves historic session activity tables allowing developers simple updates without complex SQL migrations.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Contact (Suggestion Form) */}
          {viewMode === 'contact' && (
            <div id="contact-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-2xl mx-auto space-y-8 animate-in fade-in duration-200 text-left">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] text-[#00FFB2] font-bold uppercase tracking-widest">FEEDBACK DESK</span>
                <h1 className="text-3xl font-bold tracking-tight mt-1.5">Ecosystem Recommendation Center</h1>
                <p className="text-xs text-white/50">Submit suggestions, request customized module integration, or report service disruptions.</p>
              </div>

              {user ? (
                <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                  {contactSuccess ? (
                    <div className="text-xs text-[#00FFB2] bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-lg p-4 text-center font-bold animate-pulse">
                      Suggestion submitted to administrators successfully!
                    </div>
                  ) : (
                    <form onSubmit={submitContactSuggestion} className="space-y-4">
                      <div>
                        <label className="text-[10px] text-white/50 font-bold block uppercase tracking-wider mb-1.5">Your comments suggestions details</label>
                        <textarea
                          placeholder="What would you love to see in IAH.AI? (e.g., custom maps modules, Lyria voice, etc.)"
                          value={contactComment}
                          onChange={(e) => setContactComment(e.target.value)}
                          className="w-full h-32 bg-[#050816] text-xs border border-white/10 focus:border-[#00FFB2]/50 p-3 rounded-lg focus:outline-none resize-none leading-relaxed text-white"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#00FFB2] text-black font-extrabold uppercase text-xs tracking-wider rounded hover:shadow-lg transition-all cursor-pointer"
                      >
                        Submit Suggestion to Admin Desk
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#0B1020] rounded-xl border border-white/10">
                  <p className="text-xs text-white/40 mb-4">Please connect your email account session first to share structural recommendations with the admin list.</p>
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                    className="px-5 py-2 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                  >
                    Connect Session
                  </button>
                </div>
              )}
            </div>
          )}

          {/* System Logs */}
          {viewMode === 'logs' && (
            <SystemLogsView />
          )}

          {/* Platform FAQ */}
          {viewMode === 'faq' && (
            <div id="faq-viewport" className="pt-24 px-4 md:px-8 pb-16 text-white max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200 text-left">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest">HELP DESK</span>
                <h1 className="text-3xl font-bold tracking-tight mt-1.5">Ecosystem Frequently Asked Questions</h1>
              </div>

              <div className="space-y-4">
                {[
                  { q: 'Is my personal API key secure?', a: 'Absolutely. Every query coordinates server-side using secure Node environments. No credentials are ever exposed on public browser bundles ensuring client state peace of mind.' },
                  { q: 'How can I execute premium launchers?', a: 'Upgrade to our Pro package. The system is connected to simulated sandbox payment interfaces allowing developers to easily unlock files indefinitely.' },
                  { q: 'Can I request customized feature additions?', a: 'Yes! Navigate directly to our Contact Feedback desk and type comments suggestions. Administrators audit suggestions records continuously.' },
                  { q: 'What AI models power the submodules?', a: 'Every built-in application leverages modern Google Gemini Flash-latest formats server-side providing extreme speeds and precise summaries.' }
                ].map((faq, i) => (
                  <div key={i} className="bg-[#0B1020]/90 border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setActiveFaqId(activeFaqId === i ? null : i)}
                      className="w-full p-4 text-left flex justify-between items-center text-xs font-bold tracking-wide hover:bg-white/2"
                    >
                      <span>{faq.q}</span>
                      <span className="text-[#00E5FF]">{activeFaqId === i ? '−' : '+'}</span>
                    </button>
                    {activeFaqId === i && (
                      <div className="p-4 bg-black/20 border-t border-white/5 text-xs text-white/60 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render Admin Panel coordinates */}
          {viewMode === 'admin' && (
            <AdminPanel />
          )}

          </motion.main>
        )}
      </AnimatePresence>

      {/* 4. RE-AUTHENTICATION FULL OVERLAY DIALOG */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1020] border border-white/15 rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-5 text-left">
            
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold">Connect your Identity</h3>
              <p className="text-white/40 text-[11px]">Enter session details to securely access private tracking console templates.</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              
              {authMode === 'signup' && (
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-[#050816] text-xs border border-white/15 rounded-lg p-2.5 focus:outline-none focus:border-[#00E5FF] text-white font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Your Email</label>
                <input 
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#050816] text-xs border border-white/15 rounded-lg p-2.5 focus:outline-none focus:border-[#00E5FF] text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Custom Master Password</label>
                <input 
                  type="password"
                  placeholder="Password matches seamlessly"
                  className="w-full bg-[#050816] text-xs border border-white/15 rounded-lg p-2.5 focus:outline-none focus:border-[#00E5FF] text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00E5FF] hover:bg-[#00FFB2] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {authMode === 'login' ? 'Confirm Credentials' : 'Create Account'}
              </button>

            </form>

            <div className="text-center border-t border-white/5 pt-3.5 text-xs">
              {authMode === 'login' ? (
                <p className="text-white/40">Don't have an active account? <button onClick={() => setAuthMode('signup')} className="text-[#00E5FF] hover:underline font-bold">Sign up instantly</button></p>
              ) : (
                <p className="text-white/40">Already logged in historically? <button onClick={() => setAuthMode('login')} className="text-[#00E5FF] hover:underline font-bold">Login securely</button></p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Welcome, Instagram Explore & Interactive Feedback Gate */}
      <section className="relative overflow-hidden bg-[#090D1A] border-t border-white/10 py-16 text-left">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,229,255,0.05),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:30px_30px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Welcome Banner & Social Handles */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-mono text-xs font-black uppercase text-[#00FFB2] tracking-[0.3em] flex items-center gap-1.5 animate-pulse">
                    <span className="inline-block animate-bounce">❤️</span> Thank You For Visiting
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/25 text-[10px] font-black uppercase tracking-wider text-[#A78BFA]">
                    <Sparkles size={11} className="text-[#00E5FF] animate-bounce" />
                    <span>Explore the Sovereign Horizon</span>
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase leading-none">
                  We appreciate your journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-white to-[#00FFB2]">IAH.AI</span>
                </h2>
                
                <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-2xl">
                  We are delighted to welcome you to our intelligent application ecosystem! 
                  Dive deep into custom compiled micro-sandboxes, interact with server-side language pipelines, and optimize systems seamlessly. Let's stay connected in redefining computational boundaries.
                </p>
              </div>

              {/* Instagram Links Cards Row */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-white/40 tracking-wider">Connect on Official Social Nodes</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Founder Card */}
                  <a 
                    href="https://www.instagram.com/startwithaadii?igsh=MWg0NmU3czkyOG1jYg==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-[#040611]/80 border border-white/5 hover:border-[#00E5FF]/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#00E5FF]/5 flex flex-col justify-between h-32 relative overflow-hidden"
                  >
                    <div className="absolute right-3 top-3 text-white/10 group-hover:text-[#00E5FF]/30 transition-all">
                      <Instagram size={40} className="stroke-[1.2]" />
                    </div>
                    <div className="space-y-1 z-10">
                      <span className="text-[9px] font-bold text-[#00E5FF] uppercase bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/15">Founder & Owner</span>
                      <h4 className="text-sm font-black text-white mt-1 group-hover:text-[#00E5FF] transition-colors font-sans">Adi Kumar Sharma</h4>
                      <p className="text-[10px] text-white/50">Personal Developer Account</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#00E5FF] font-bold mt-2 z-10">
                      <span>@startwithaadii</span>
                      <ExternalLink size={10} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>

                  {/* App Account Card */}
                  <a 
                    href="https://www.instagram.com/1.iah.ai?igsh=ZGRhdTk1Y3N4MGFu" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group bg-[#040611]/80 border border-white/5 hover:border-[#00FFB2]/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#00FFB2]/5 flex flex-col justify-between h-32 relative overflow-hidden"
                  >
                    <div className="absolute right-3 top-3 text-white/10 group-hover:text-[#00FFB2]/30 transition-all">
                      <Instagram size={40} className="stroke-[1.2]" />
                    </div>
                    <div className="space-y-1 z-10">
                      <span className="text-[9px] font-bold text-[#00FFB2] uppercase bg-[#00FFB2]/10 px-2 py-0.5 rounded border border-[#00FFB2]/15">Official App Portal</span>
                      <h4 className="text-sm font-black text-white mt-1 group-hover:text-[#00FFB2] transition-colors font-sans">IAH.AI Official</h4>
                      <p className="text-[10px] text-white/50">Community Hub & Updates</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#00FFB2] font-bold mt-2 z-10">
                      <span>@1.iah.ai</span>
                      <ExternalLink size={10} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>

                </div>
              </div>

              {/* Core Credits subline */}
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest pt-2">
                Built India to Grow India .. Certified sovereign AI hosting node
              </div>
            </div>

            {/* Right Column: Dynamic Interactive Feedback Form */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#050816]/90 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-[#7C3AED]/5 opacity-30 pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-2">
                    <div className="p-2 bg-[#00FFB2]/10 border border-[#00FFB2]/20 rounded-xl">
                      <MessageSquare size={16} className="text-[#00FFB2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Ecosystem Feedback</h3>
                      <p className="text-[10px] text-white/50">Share suggestions, ratings, or feature requests</p>
                    </div>
                  </div>

                  {footerFeedbackSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <Check size={20} className="stroke-[3] animate-pulse" />
                      </div>
                      <h4 className="text-xs font-black text-[#00FFB2] uppercase tracking-wider">Sovereign Feedback Broadcasted!</h4>
                      <p className="text-[11px] text-white/60 leading-relaxed max-w-xs mx-auto">
                        Your recommendation records have been parsed and securely merged into our system guidelines database!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={submitFooterFeedback} className="space-y-4">
                      
                      {/* Interactive Rating Component (Stars) */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Rate your overall experience</label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => setFooterFeedbackRating(starValue)}
                              className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                            >
                              <Star 
                                size={22} 
                                className={`transition-all duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
                                  starValue <= footerFeedbackRating 
                                  ? 'fill-[#00FFB2] text-[#00FFB2]' 
                                  : 'text-white/20 hover:text-white/40'
                                }`} 
                              />
                            </button>
                          ))}
                          <span className="text-xs text-white/50 font-bold font-mono ml-2 mt-0.5 bg-white/5 px-2 py-0.5 rounded-md">
                            {footerFeedbackRating === 5 ? 'Excellent 🌟' : footerFeedbackRating >= 4 ? 'Great 👍' : footerFeedbackRating >= 3 ? 'Good 👍' : 'Needs Improve'}
                          </span>
                        </div>
                      </div>

                      {/* Optional Email input if not logged in */}
                      {!user && (
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Your Email address (optional)</label>
                          <input 
                            type="email"
                            placeholder="e.g. guest-developer@domain.com"
                            value={footerFeedbackEmail}
                            onChange={(e) => setFooterFeedbackEmail(e.target.value)}
                            className="w-full bg-[#040611] text-xs border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-[#00E5FF] transition-all font-mono"
                          />
                        </div>
                      )}

                      {/* Comment text area */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Comment or feature suggestion details</label>
                        <textarea
                          placeholder="What did you like about this experience? What cool sub-app should we compile next?"
                          value={footerFeedbackComment}
                          onChange={(e) => setFooterFeedbackComment(e.target.value)}
                          className="w-full h-24 bg-[#040611] text-xs border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] transition-all resize-none leading-relaxed"
                          required
                        />
                      </div>

                      {/* Submitting context notification lines */}
                      {user && (
                        <div className="text-[9px] font-mono text-white/40">
                          Mapping report back to logged email: <strong className="text-[#00E5FF]">{user.email}</strong>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={footerFeedbackSubmitting}
                        className="w-full py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] text-black font-extrabold uppercase text-xs tracking-wider rounded-xl hover:shadow-lg hover:shadow-[#00E5FF]/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <span>{footerFeedbackSubmitting ? 'Transmitting Data...' : 'Broadcast Feedback'}</span>
                        <Check size={13} className="stroke-[3]" />
                      </button>

                    </form>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Standard Footer */}
      <footer className="border-t border-white/10 py-10 bg-[#050816] text-center text-xs text-white/30 space-y-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#00E5FF] tracking-widest font-mono text-sm">IAH.AI</span>
            <span>© 2026 Intelligent AI Hub. Unlimited Sovereign Compute.</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setViewMode('about')} className="hover:text-white transition-all">About Platform</button>
            <button onClick={() => setViewMode('logs')} className="hover:text-white transition-all">System Logs</button>
            <button onClick={() => setViewMode('contact')} className="hover:text-white transition-all">Report Center</button>
            <button onClick={() => setViewMode('faq')} className="hover:text-white transition-all">Faq</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
