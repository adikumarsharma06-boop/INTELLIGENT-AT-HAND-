/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, ShieldCheck, Zap, HardDrive, BarChart3, LineChart, Cpu, MessageSquare, 
  ChevronRight, Compass, ShieldAlert, BadgeCheck 
} from 'lucide-react';
import ThreeDCard from './ThreeDCard';

export default function LandingPage() {
  const { setViewMode, apps, launchApp } = useApp();

  const featuredApps = apps.filter(a => a.featured).slice(0, 4);

  return (
    <div id="landing-universe" className="pt-24 pb-16 relative overflow-hidden text-white font-sans">
      
      {/* Decorative cosmic floating glowing background matrices */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/15 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#00E5FF]/15 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24 relative z-10">
        
        {/* HERO SECTION */}
        <div id="hero-segment" className="text-center space-y-6 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-[#00E5FF] shadow-inner">
            <Sparkles size={11} className="animate-spin" />
            <span>VERSION 4.2 STASIS NETWORK HAS DEPLOYED</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
            <span className="inline-block bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,153,51,0.5)]">
              BUILT INDIA
            </span>
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-3 bg-gradient-to-r from-[#00E5FF] via-[#00FFB2] to-[#00E5FF] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,229,255,0.6)] font-extrabold tracking-wide">
              TO GROW INDIA ..
            </span>
          </h1>

          <div className="relative inline-block px-6 py-4 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_25px_rgba(0,229,255,0.15)] hover:border-[#00E5FF]/40 transition-all duration-300 max-w-2xl mx-auto my-3 overflow-hidden group">
            {/* Inline CSS style for the custom shiny animation */}
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes textShine {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .shimmer-text {
                background: linear-gradient(
                  to right,
                  #00E5FF 0%,
                  #D1FAE5 25%,
                  #00FFB2 50%,
                  #FFFFFF 75%,
                  #00E5FF 100%
                );
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: textShine 3s linear infinite;
              }
            `}} />
            
            <p className="text-sm md:text-xl font-black tracking-widest uppercase flex items-center justify-center gap-2.5">
              <Sparkles size={18} className="text-[#00E5FF] animate-pulse" />
              <span className="shimmer-text drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                Acces all IAH.AI Tools and Used It
              </span>
              <Sparkles size={18} className="text-[#00FFB2] animate-pulse" />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-btn-launch"
              onClick={() => setViewMode('marketplace')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold tracking-wider text-black bg-gradient-to-r from-[#00E5FF] via-white to-[#00FFB2] hover:shadow-lg hover:shadow-[#00E5FF]/20 transform hover:-translate-y-0.5 active:scale-95 transition-all text-sm uppercase cursor-pointer"
            >
              Launch Platform Suite
            </button>
          </div>

        </div>

        {/* INTERACTIVE BENTO MOCKUP ACCENTS */}
        <div id="interactive-bento" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-[#0B1020]/90 rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
            <div className="space-y-4 max-w-md">
              <span className="text-[10px] text-[#7C3AED] font-extrabold uppercase tracking-widest block">Unified Shell Architecture</span>
              <h3 className="text-2xl font-bold tracking-tight">The ultimate dashboard where all your cloud bots breathe together.</h3>
              <p className="text-white/60 text-xs leading-relaxed">
                No more bookmarks, legacy API delays, or disjointed chats. IAH.AI packages professional copywriting copilots, design laboratories, and technical refactoring engines in one responsive grid.
              </p>
              <button 
                onClick={() => setViewMode('marketplace')}
                className="text-xs text-[#00E5FF] hover:underline font-bold flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Browse Category Modules</span>
                <ChevronRight size={14} />
              </button>
            </div>
            
            {/* Visual illustrative code widget */}
            <div className="md:absolute right-4 bottom-4 w-72 bg-[#050816] rounded-2xl border border-white/15 p-4 shadow-2xl font-mono text-[9px] text-[#00FFB2] mt-6 md:mt-0">
              <div className="flex gap-1.5 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FFB2]"></div>
              </div>
              <p className="text-white/30">// Processing stasis pipeline...</p>
              <p>const system = launchApp('iah-chat');</p>
              <p>system.inject({`{ role: "model", thinking: true }`});</p>
              <p className="text-[#CFCFCF] mt-1.5">// Result Compiled (gemini-3.5-flash):</p>
              <p className="text-purple-450 text-[#00E5FF]">"Ready to coordinate unified operations. Launching."</p>
            </div>
          </div>

          <div className="bg-[#0B1020]/90 rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
            <div className="space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <span className="text-[10px] text-[#00E5FF] font-extrabold uppercase tracking-widest block">Cosmic Guard Secured</span>
                <h3 className="text-2xl font-bold tracking-tight">Guaranteed API Cloaking.</h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Every pipeline request executes securely server-side proxying your personal credentials away from browser dev inspectors. Safe. Secure. Uncompromising.
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className="text-[#00FFB2]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white">Stripe & Supabase Ready</span>
                </div>
                <BadgeCheck size={18} className="text-[#00FFB2]" />
              </div>
            </div>
          </div>

        </div>

        {/* ACTIVE MODULE HIGHLIGHTS */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase tracking-wider">Featured AI Applications</h2>
            <p className="text-white/50 text-xs">Explore direct production-ready tools built securely inside the IAH hub.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app, index) => (
              <ThreeDCard 
                key={app.id} 
                index={index}
                layoutId={`app-card-${app.id}`}
                className="bg-[#0B1020]/80 rounded-2xl border border-white/10 p-5 shadow-lg relative overflow-hidden group hover:border-[#00E5FF]/40 text-left flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-3.5 h-full flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#00FFB2]">
                        {app.category}
                      </span>
                      {app.premium && (
                        <span className="text-[8px] uppercase tracking-wider font-black text-[#7C3AED]">
                          ★ Premium
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm tracking-wide text-white group-hover:text-[#00E5FF] transition-all">
                      {app.name}
                    </h4>
                    <p className="text-white/50 text-[11px] line-clamp-3 leading-snug">
                      {app.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {app.uptime && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/15 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#00FFB2] animate-pulse" />
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
                      onClick={() => launchApp(app.id)}
                      className="text-xs text-[#00E5FF] group-hover:text-[#00FFB2] hover:underline font-bold flex items-center gap-1 cursor-pointer transition-colors ml-auto"
                    >
                      <span>Launch Module</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </ThreeDCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
