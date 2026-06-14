import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, Phone, Send, ShieldCheck, Database, HardDrive, Cpu, 
  ArrowUpRight, Share2, Smartphone, CheckCircle, Clock, ExternalLink,
  MessageSquare, Sparkles, RefreshCw, BarChart, FileText
} from 'lucide-react';

export default function IdentitySavingsReports() {
  const { user, apps } = useApp();
  
  // Real-time simulations for Email and WhatsApp
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [whatsAppSuccess, setWhatsAppSuccess] = useState(false);
  
  // Custom interactive data metrics values that can be optimized
  const [microCache, setMicroCache] = useState(124.5);
  const [gpuSteps, setGpuSteps] = useState(4120);
  const [bandwidthReduction, setBandwidthReduction] = useState(88.4);
  const [dbCompaction, setDbCompaction] = useState(1.85);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Targets formatted with user variables 
  const targetEmail = user?.email || 'adikumarsharma06@gmail.com';
  const targetPhone = user?.phone || '7980259343';
  const targetName = user?.fullName || 'Adi Kumar Sharma';

  // Preview models toggle
  const [activePreview, setActivePreview] = useState<'none' | 'email' | 'whatsapp'>('none');

  const optimizeEngine = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setMicroCache(prev => Number((prev + Math.random() * 12 + 4).toFixed(1)));
      setGpuSteps(prev => prev + Math.floor(Math.random() * 150) + 50);
      setBandwidthReduction(prev => Math.min(Number((prev + Math.random() * 1.5).toFixed(1)), 99.1));
      setDbCompaction(prev => Number((prev + 0.05).toFixed(2)));
      setIsOptimizing(false);
    }, 1500);
  };

  const triggerSimEmail = () => {
    setIsSendingEmail(true);
    setEmailSuccess(false);
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSuccess(true);
      setActivePreview('email');
      setTimeout(() => setEmailSuccess(false), 5000);
    }, 1800);
  };

  const triggerSimWhatsApp = () => {
    setIsSendingWhatsApp(true);
    setWhatsAppSuccess(false);
    setTimeout(() => {
      setIsSendingWhatsApp(false);
      setWhatsAppSuccess(true);
      setActivePreview('whatsapp');
      setTimeout(() => setWhatsAppSuccess(false), 5000);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. INTUITIVE GEOMETRY ACTIONS AND STATISTICS HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Personal Identity Hub Info */}
        <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-5 text-left space-y-4 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#00E5FF] p-[1px]">
              <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center text-[#00E5FF]">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#00E5FF] font-mono leading-none block">Verified Tunnel</span>
              <h2 className="text-sm font-extrabold tracking-tight text-white mt-0.5">Secure Account Identity</h2>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="bg-white/2 border border-white/5 rounded-xl p-3 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-white/40">Full Name:</span>
                <span className="text-white font-semibold">{targetName}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1.5">
                <span className="text-white/40">Email ID:</span>
                <span className="text-white font-semibold overflow-hidden text-ellipsis max-w-[150px]" title={targetEmail}>{targetEmail}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1.5">
                <span className="text-white/40">Phone Coordinates:</span>
                <span className="text-[#00FFB2] font-black">{targetPhone}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] flex items-center gap-1 text-white/40 font-mono">
            <Clock size={11} className="text-[#00FFB2]" />
            <span>Active UTC Session: 2026-06-07 18:37:22Z</span>
          </div>
        </div>

        {/* Dynamic Savings Metrics Grid Card */}
        <div className="lg:col-span-2 bg-[#0B1020]/90 border border-white/10 rounded-2xl p-5 text-left space-y-4 shadow-xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Database size={15} className="text-[#00FFB2]" />
              <h3 className="text-sm font-extrabold tracking-tight text-white">Tunnel optimization & Data Savings</h3>
            </div>
            <button
              onClick={optimizeEngine}
              disabled={isOptimizing}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40"
            >
              <RefreshCw size={11} className={isOptimizing ? 'animate-spin' : ''} />
              <span>{isOptimizing ? 'Optimizing Cache...' : 'Pulse Compactor'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            
            <div className="bg-[#050816]/75 border border-white/5 p-3 rounded-xl space-y-1 relative group hover:border-[#00E5FF]/20 transition-all">
              <span className="block text-[9px] uppercase font-bold tracking-widest text-white/40">Microservice Cache</span>
              <div className="text-lg font-black text-white tracking-tight">{microCache} MB</div>
              <span className="block text-[8px] text-[#00E5FF] font-mono leading-none">Saved cloaked API buffers</span>
            </div>

            <div className="bg-[#050816]/75 border border-white/5 p-3 rounded-xl space-y-1 relative group hover:border-[#00FFB2]/20 transition-all">
              <span className="block text-[9px] uppercase font-bold tracking-widest text-white/40">GPU Matrix Cycles</span>
              <div className="text-lg font-black text-white tracking-tight">{gpuSteps} steps</div>
              <span className="block text-[8px] text-[#00FFB2] font-mono leading-none">Cached query computations</span>
            </div>

            <div className="bg-[#050816]/75 border border-white/5 p-3 rounded-xl space-y-1 relative group hover:border-[#7C3AED]/20 transition-all">
              <span className="block text-[9px] uppercase font-bold tracking-widest text-white/40">Bandwidth Loss</span>
              <div className="text-lg font-black text-white tracking-tight">-{bandwidthReduction}%</div>
              <span className="block text-[8px] text-[#7C3AED] font-mono leading-none">Payload metadata savings</span>
            </div>

            <div className="bg-[#050816]/75 border border-white/5 p-3 rounded-xl space-y-1 relative group hover:border-pink-500/20 transition-all">
              <span className="block text-[9px] uppercase font-bold tracking-widest text-white/40">db.json Compactor</span>
              <div className="text-lg font-black text-white tracking-tight">{dbCompaction}x scale</div>
              <span className="block text-[8px] text-pink-500 font-mono leading-none">Zero-loss system compression</span>
            </div>

          </div>
        </div>

      </div>

      {/* 2. SHARED COMMUNICATIONS DISPATCH DESK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* simulated email widget */}
        <div className="bg-[#0B1020]/95 border border-white/10 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4 shadow-xl relative min-h-[220px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/4 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]">
                  <Mail size={14} />
                </div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">Email Authentication report</h4>
              </div>
              <span className="text-[9px] text-[#00E5FF] font-black bg-[#00E5FF]/5 border border-[#00E5FF]/10 px-2 py-0.5 rounded font-mono">
                API GATE
              </span>
            </div>
            
            <p className="text-white/50 text-[11px] leading-relaxed">
              Compile full account statistics, subscription profile level, metrics logs, and metadata savings to transmit instantly to your registered address.
            </p>

            <div className="bg-[#050816] rounded-xl px-3 py-2 border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-white/30 text-[10px]">Email Destination:</span>
              <span className="text-white font-bold">{targetEmail}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerSimEmail}
              disabled={isSendingEmail}
              className="flex-1 py-2 bg-gradient-to-r from-[#00E5FF]/15 to-[#00E5FF]/5 hover:bg-[#00E5FF] hover:text-black hover:font-bold border border-[#00E5FF]/30 text-[#00E5FF] rounded-xl text-xs tracking-wider font-semibold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              {isSendingEmail ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
                  <span>Transmitting payload...</span>
                </>
              ) : (
                <>
                  <Send size={12} />
                  <span>Send Mail Report</span>
                </>
              )}
            </button>

            {emailSuccess && (
              <button 
                onClick={() => setActivePreview('email')}
                className="px-3 py-2 bg-[#00FFB2]/10 hover:bg-[#00FFB2]/20 border border-[#00FFB2]/30 text-[#00FFB2] font-black text-xs uppercase leading-none rounded-xl"
              >
                Inspect Mail
              </button>
            )}
          </div>
        </div>

        {/* simulated WhatsApp widget */}
        <div className="bg-[#0B1020]/95 border border-white/10 rounded-2xl p-5 text-left flex flex-col justify-between space-y-4 shadow-xl relative min-h-[220px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FFB2]/4 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/20 text-[#00FFB2]">
                  <MessageSquare size={14} />
                </div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-white">WhatsApp Webhook credentials</h4>
              </div>
              <span className="text-[9px] text-[#00FFB2] font-black bg-[#00FFB2]/5 border border-[#00FFB2]/10 px-2 py-0.5 rounded font-mono">
                TELEMETRY LINK
              </span>
            </div>
            
            <p className="text-white/50 text-[11px] leading-relaxed">
              Format secure metadata reports into stylized Markdown block configurations and trigger dispatch pipeline directly to phone link via simulated endpoint webhooks.
            </p>

            <div className="bg-[#050816] rounded-xl px-3 py-2 border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-white/30 text-[10px]">Recipient Phone:</span>
              <span className="text-[#00FFB2] font-bold">+{targetPhone}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerSimWhatsApp}
              disabled={isSendingWhatsApp}
              className="flex-1 py-2 bg-gradient-to-r from-[#00FFB2]/15 to-[#00FFB2]/5 hover:bg-[#00FFB2] hover:text-black hover:font-bold border border-[#00FFB2]/30 text-[#00FFB2] rounded-xl text-xs tracking-wider font-semibold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              {isSendingWhatsApp ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00FFB2] border-t-transparent animate-spin" />
                  <span>Firing Webhooks...</span>
                </>
              ) : (
                <>
                  <Share2 size={12} />
                  <span>Send WhatsApp Report</span>
                </>
              )}
            </button>

            {whatsAppSuccess && (
              <button 
                onClick={() => setActivePreview('whatsapp')}
                className="px-3 py-2 bg-[#00FFB2]/10 hover:bg-[#00FFB2]/20 border border-[#00FFB2]/30 text-[#00FFB2] font-black text-xs uppercase leading-none rounded-xl"
              >
                Inspect Text
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. SIMULATED DISPATCH PAYLOAD INSPECTION PANEL */}
      {activePreview !== 'none' && (
        <div className="bg-[#05081c] border border-white/10 rounded-2xl p-5 text-left space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="font-extrabold text-xs uppercase tracking-widest text-[#00FFB2]">
                {activePreview === 'email' ? '📧 Live Email Packet Preview' : '💬 Live WhatsApp Webhook Preview'}
              </h4>
            </div>
            <button
              onClick={() => setActivePreview('none')}
              className="text-white/40 hover:text-white text-xs font-mono"
            >
              [close snapshot]
            </button>
          </div>

          {activePreview === 'email' ? (
            <div className="bg-white text-gray-900 rounded-xl p-6 space-y-4 font-sans text-xs shadow-inner select-text">
              <div className="border-b border-gray-100 pb-3 text-[11px] text-gray-500 space-y-1">
                <div><strong>From:</strong> IAH.AI Security Ecosystem &lt;noreply@iah.ai&gt;</div>
                <div><strong>To:</strong> {targetEmail}</div>
                <div><strong>Subject:</strong> 🔒 SECURE SYSTEM PORT REPORT: ACCOUNT_INSIGHTS_KEY_{targetPhone}</div>
                <div><strong>Timestamp:</strong> 2026-06-07 18:37:22Z via Cloud Run container</div>
              </div>

              <div className="space-y-3">
                <div className="h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600" />
                <h3 className="text-sm font-bold text-gray-900">Hello {targetName},</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your secure developer tunnel with index identification token references has finalized the following telemetry data optimizations.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 font-mono text-[11px] space-y-2 text-gray-800">
                  <div className="text-gray-400 font-bold uppercase tracking-wider text-[9px] border-b border-gray-100 pb-1">ACCOUNT METRICS SPECIFICATION</div>
                  <div className="flex justify-between"><strong>Tunnel Profile ID:</strong><span>usr-{targetPhone.substring(6)}</span></div>
                  <div className="flex justify-between"><strong>Subscription Level:</strong><span className="uppercase text-purple-600 font-bold">Pro Developer Plan</span></div>
                  <div className="flex justify-between"><strong>Microservices Cache Saved:</strong><span>{microCache} Megabytes</span></div>
                  <div className="flex justify-between"><strong>GPU Matrix Computing Steps:</strong><span>{gpuSteps} steps</span></div>
                  <div className="flex justify-between"><strong>Bandwidth reduction scale:</strong><span>-{bandwidthReduction}% payload loss</span></div>
                  <div className="flex justify-between"><strong>Linked Verification Phone:</strong><span>+{targetPhone}</span></div>
                </div>

                <p className="text-gray-500 text-[10px] leading-relaxed pt-3 border-t border-gray-100">
                  This report has been compiled and saved inside <code>db.json</code> file structure back-end. Securely signed with TLS_1.3. For troubleshooting, write to dev panel.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#075E54]/90 p-5 rounded-xl space-y-4 shadow-inner relative max-w-md mx-auto">
              
              {/* WhatsApp UI Framing header */}
              <div className="flex items-center gap-3 bg-[#128C7E] px-4 py-3 -mx-5 -mt-5 rounded-t-xl text-white text-xs">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  IAH
                </div>
                <div className="text-left">
                  <span className="font-extrabold block">IAH Telemetry Webhook</span>
                  <span className="text-[9px] opacity-75">Active Gateway Tunnel</span>
                </div>
              </div>

              {/* Chat bubble */}
              <div className="bg-[#DCF8C6] text-gray-800 p-3.5 rounded-lg text-left text-xs font-mono space-y-2 relative shadow-md select-text max-w-[90%]">
                <div className="text-green-800 font-bold text-[9px] tracking-wider uppercase">📲 IAH SECURE PIPELINE REPORT</div>
                
                <div className="space-y-1.5 leading-relaxed text-[11px]">
                  <p>🔹 *Developer ID:* Adi Kumar Sharma</p>
                  <p>🔹 *Coordinate Link:* +{targetPhone}</p>
                  <p>🔹 *Subscription Plan:* Pro Tier Active</p>
                  <p>🔹 *Buffer Optimizations:* {microCache} MB</p>
                  <p>🔹 *GPU Matrix Savings:* {gpuSteps} Steps Saved</p>
                  <p>🔹 *Compactor Ratio:* {dbCompaction}x Compression Ratio</p>
                  <p>🔹 *Live Target URL:* https://iah.ai/console</p>
                </div>

                <div className="flex justify-end items-center gap-1 text-[8px] text-gray-400 mt-1 pb-0">
                  <span>18:37Z</span>
                  <span className="text-blue-500 text-[10px] font-extrabold leading-none">✓✓</span>
                </div>
                
                {/* bubble quote tip pointer */}
                <div className="absolute top-2 -left-1.5 w-3 h-3 bg-[#DCF8C6] transform rotate-45 pointer-events-none" />
              </div>

              <div className="text-center text-[10px] text-white/50 bg-black/20 py-1 rounded">
                🔒 Handshake dispatched to +{targetPhone} via WhatsApp Web API
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
