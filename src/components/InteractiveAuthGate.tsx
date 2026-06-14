import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Cpu, Key, Mail, Sparkles, Terminal, ToggleLeft, 
  UserPlus, LogIn, Phone, Database, CloudLightning, Activity,
  Smartphone, CheckCircle, Send, ChevronRight, Fingerprint, Globe, Shield, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveAuthGateProps {
  onSuccess: () => void;
}

export default function InteractiveAuthGate({ onSuccess }: InteractiveAuthGateProps) {
  const { signup, login } = useApp();
  
  // High fidelity state stages: 'welcome' | 'auth' | 'booting'
  const [stage, setStage] = useState<'welcome' | 'auth' | 'booting'>('welcome');
  
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('Adi Kumar Sharma');
  const [email, setEmail] = useState('adikumarsharma06@gmail.com');
  const [phone, setPhone] = useState('7980259343');
  
  // Loading & logs state for the booting phase
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogIndex, setBootLogIndex] = useState(0);
  const [errorText, setErrorText] = useState('');

  const bootLogs = [
    '⚡ [STASIS Engine] Initializing 3D spatial graphics pipelines...',
    '🔐 [Security Core] Establishing cryptographic tunnel with TLS_1.3 protocol...',
    '💾 [Cloud DB Broker] Syncing local offline buffers for index structures...',
    '📊 [Analytics Pipeline] Verifying tracking credentials for account phone reference...',
    '🛰️ [Telemetry Router] Linking global communications nodes at port 3000...',
    '📥 [Data Shield] Encrypting data savings cache modules for user +91 7980259343...',
    '🚀 [Core Engine] Initialization certified. Handshaking complete. Launching IAH.AI...'
  ];

  // Booting effect timer coordination
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'booting') {
      interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onSuccess();
            }, 800);
            return 100;
          }
          
          // Fast and interactive loading progress simulation
          const step = Math.floor(Math.random() * 15) + 6;
          const nextProgress = Math.min(prev + step, 100);
          
          // Map progressive terminal logging ticks
          const dynamicIndex = Math.min(
            Math.floor((nextProgress / 100) * bootLogs.length),
            bootLogs.length - 1
          );
          setBootLogIndex(dynamicIndex);
          
          return nextProgress;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [stage, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email) {
      setErrorText('Please enter your email credentials.');
      return;
    }

    try {
      if (authMode === 'signup') {
        if (!fullName) {
          setErrorText('Full Name is required.');
          return;
        }
        if (!phone) {
          setErrorText('Phone Number coordinates are required.');
          return;
        }
        const ok = await signup(email, fullName, phone);
        if (ok) {
          setStage('booting');
        } else {
          setErrorText('Registration encountered a state dispute. Check email uniqueness.');
        }
      } else {
        const ok = await login(email);
        if (ok) {
          setStage('booting');
        } else {
          setErrorText('Authentication query failed. User match not verified.');
        }
      }
    } catch (err) {
      setErrorText('Server handshake timeout.');
    }
  };

  const loadDemoPresets = () => {
    setFullName('Adi Kumar Sharma');
    setEmail('adikumarsharma06@gmail.com');
    setPhone('7980259343');
    setErrorText('');
  };

  // Text variant for staggered welcome lettering
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const titleItemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#040611] flex items-center justify-center p-4 overflow-y-auto select-none">
      
      {/* Immersive space digital grids and background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.1),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-15 pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* STAGE 1: MAGNIFICENT WELCOME INTRO ENTRYWAY */}
        {stage === 'welcome' && (
          <motion.div
            key="welcome-sequence"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="max-w-xl w-full text-center space-y-10 z-10"
          >
            
            {/* Pulsing Holomatrix Logo */}
            <div className="relative inline-block">
              {/* Outer multi-color glow circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] opacity-25 blur-xl"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -inset-2 rounded-full bg-cyan-500/10 border border-cyan-500/20"
              />
              
              {/* High-Contrast Vector Hexagon Icon */}
              <svg className="w-28 h-28 mx-auto relative z-10 filter drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="50%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#00FFB2" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50 12 L82 30 L82 70 L50 88 L18 70 L18 30 Z" 
                  stroke="url(#glowGrad)" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M50 24 L72 37 L72 63 L50 76 L28 63 L28 37 Z" 
                  stroke="url(#glowGrad)" 
                  strokeWidth="1.5" 
                  strokeDasharray="5 3"
                  opacity="0.8"
                />
                <circle cx="50" cy="50" r="11" fill="url(#glowGrad)" />
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="0.5" strokeOpacity="0.15" />
              </svg>

              {/* Floating diagnostic beacon */}
              <div className="absolute top-2 right-2 bg-[#00FFB2] w-2.5 h-2.5 rounded-full border border-[#040611] animate-ping" />
            </div>

            {/* Cinematic Staggered Text Revelations */}
            <motion.div 
              variants={titleContainerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              <motion.span 
                variants={titleItemVariants}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-[#00E5FF] inline-block shadow-lg"
              >
                Secure Quantum Node Active
              </motion.span>
              
              <motion.h1 
                variants={titleItemVariants}
                className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none font-sans"
              >
                WELCOME TO <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] via-white to-[#00FFB2] filter drop-shadow-[0_2px_15px_rgba(0,229,255,0.2)]">IAH.AI</span>
              </motion.h1>

              <motion.p 
                variants={titleItemVariants}
                className="text-white/60 text-xs md:text-sm max-w-sm mx-auto leading-relaxed"
              >
                Connecting your identity portal to sovereign sandboxed applications, low-latency API relays, and custom full-stack compilers.
              </motion.p>
            </motion.div>

            {/* Glowing Call-to-Action Core Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-6 max-w-xs mx-auto"
            >
              <button
                onClick={() => setStage('auth')}
                className="w-full relative group py-3.5 bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] rounded-2xl text-black font-extrabold tracking-widest uppercase text-[11px] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-[#00E5FF]/20 overflow-hidden cursor-pointer flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span>Initialize System Portal</span>
                <ChevronRight size={14} className="stroke-[3]" />
              </button>

              {/* Real-time preflight diagnostic ticker */}
              <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-white/35">
                <span className="flex items-center gap-1">
                  <Activity size={10} className="text-[#00FFB2] animate-pulse" />
                  Latency: 24ms jitter
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1">
                  <Globe size={10} className="text-[#00E5FF]" />
                  TLS_1.3 Secure Link
                </span>
              </div>
            </motion.div>

            {/* Bottom Credits Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="pt-8 text-center font-bold tracking-[0.4em] text-white/20 uppercase text-[9px]"
            >
              BUILT INDIA TO GROW INDIA ..
            </motion.div>

          </motion.div>
        )}

        {/* STAGE 2: PREMIUM AUTHENTICATION CREDENTIALS PANEL */}
        {stage === 'auth' && (
          <motion.div
            key="auth-gate-panel"
            initial={{ opacity: 0, y: 25, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="max-w-md w-full relative z-10"
          >
            {/* Visual glow backdrop coordinates */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#7C3AED] via-[#00E5FF] to-[#00FFB2] opacity-30 blur-xl pointer-events-none" />

            <div className="bg-[#0b1020]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 text-left">
              
              {/* Header description */}
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[9px] font-bold uppercase tracking-wider text-[#00E5FF] mx-auto md:mx-0">
                  <Fingerprint size={10} className="animate-pulse" />
                  <span>STASIS COGNITIVE GRID GATING</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                  Intelligent Portal
                </h1>
                <p className="text-white/50 text-xs leading-relaxed">
                  Provide authorization credentials to run low-latency AI models, custom developer workspace nodes, and private system trackers.
                </p>
              </div>

              {/* Prefill credentials panel */}
              <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/15 rounded-xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="block text-[11px] font-black text-white uppercase tracking-wider">Demo Credentials</span>
                  <span className="text-[10px] text-[#00E5FF] font-mono leading-none font-bold">Instantly map secure preset details</span>
                </div>
                <button 
                  id="preset-demo-trigger"
                  type="button"
                  onClick={loadDemoPresets}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#00E5FF]/20 to-[#00FFB2]/20 border border-[#00E5FF]/30 text-[#00E5FF] font-black text-[9px] tracking-wide rounded-md hover:bg-[#00E5FF] hover:text-black hover:border-transparent transition-all cursor-pointer"
                >
                  PREFILL NOW
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Auth Mode Toggle Switches */}
                <div className="grid grid-cols-2 p-1 bg-[#040611] rounded-xl border border-white/5 text-xs font-bold font-sans">
                  <button
                    type="button"
                    id="toggle-signup-mode"
                    onClick={() => { setAuthMode('signup'); setErrorText(''); }}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authMode === 'signup' 
                      ? 'bg-gradient-to-r from-[#00E5FF]/15 to-[#00FFB2]/15 border border-[#00E5FF]/20 text-white font-black' 
                      : 'text-white/40 hover:text-white/85'
                    }`}
                  >
                    <UserPlus size={13} />
                    <span>Create Account</span>
                  </button>
                  <button
                    type="button"
                    id="toggle-login-mode"
                    onClick={() => { setAuthMode('login'); setErrorText(''); }}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      authMode === 'login' 
                      ? 'bg-gradient-to-r from-[#00E5FF]/15 to-[#00FFB2]/15 border border-[#00E5FF]/20 text-white font-black' 
                      : 'text-white/40 hover:text-white/85'
                    }`}
                  >
                    <LogIn size={13} />
                    <span>Existing User</span>
                  </button>
                </div>

                {errorText && (
                  <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-semibold">
                    ⚠️ {errorText}
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-3">
                  
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Developer Full Name</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3 text-white/30 text-[10px] font-mono font-bold select-none">@</span>
                        <input 
                          id="signup-name-field"
                          type="text"
                          className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white placeholder-white/25"
                          placeholder="Adi Kumar Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Identity Email ID</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 text-white/30" size={13} />
                      <input 
                        id="signup-email-field"
                        type="email"
                        className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white placeholder-white/25"
                        placeholder="adikumarsharma06@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">WhatsApp / Mobile Contact link</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 text-white/30" size={13} />
                        <input 
                          id="signup-phone-field"
                          type="tel"
                          className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white font-mono placeholder-white/25"
                          placeholder="e.g. 7980259343"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <span className="block text-[9px] text-white/30 font-mono mt-1">
                        Security report outputs will match email references. No code required.
                      </span>
                    </div>
                  )}

                </div>

                {/* Submissions button */}
                <button
                  id="auth-submit-trigger"
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] hover:shadow-lg hover:shadow-[#00E5FF]/20 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{authMode === 'signup' ? 'Deploy & Build Account' : 'Authenticate Gateway'}</span>
                  <CloudLightning size={14} className="animate-pulse" />
                </button>

              </form>

              {/* Portal status markers */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[10px] font-mono text-white/30">
                <span className="flex items-center gap-1.5">
                  <Database size={11} className="text-[#00FFB2]" />
                  Active db.json syncing
                </span>
                <span className="uppercase text-[9px] text-cyan-400 font-bold">SECURE NODE PORT: 3000</span>
              </div>

            </div>
          </motion.div>
        )}

        {/* STAGE 3: CRYPTOGRAPHIC TUNNEL BOOTING TERMINAL STATUS */}
        {stage === 'booting' && (
          <motion.div
            key="booting-sequence"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="max-w-xl w-full text-center space-y-8 z-10"
          >
            {/* Pulsing visual core anchor */}
            <div className="relative inline-block">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] opacity-30 blur-2xl animate-pulse" />
              <svg className="w-24 h-24 mx-auto relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" 
                  stroke="url(#glowGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle cx="50" cy="50" r="10" fill="url(#glowGrad)" />
                <path d="M50 5 L50 95 M5 50 L95 50" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
                BOOTING IAH ECOSYSTEM
              </h2>
              <p className="text-[#00FFB2] font-mono text-[9px] uppercase tracking-widest font-bold animate-pulse">
                INTELLIGENT HANDSHAKE TUNNEL ACTIVE
              </p>
            </div>

            {/* Glowing progress cards container */}
            <div className="bg-[#0b1020]/90 p-6 rounded-2xl border border-white/10 space-y-4 shadow-2xl relative text-left">
              
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white/40">Linking secure platform gates...</span>
                <span className="text-[#00FFB2] font-black">{bootProgress}%</span>
              </div>

              {/* Fluid loading slider bar */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FFB2] rounded-full transition-all duration-300 shadow-[0_0_12px_#00E5FF]"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              {/* Dynamic live telemetry diagnostic box */}
              <div className="bg-[#040611] rounded-xl p-4 text-left border border-white/5 font-mono text-[10px] h-28 overflow-y-auto space-y-1.5 text-white/70">
                <div className="text-white/20 select-none pb-1.5 border-b border-white/5 flex items-center gap-2">
                  <Terminal size={11} className="text-[#00E5FF]" />
                  <span>IAH CORE TELEMETRY RECONCILIATION</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  {bootLogs.slice(0, bootLogIndex + 1).map((log, index) => (
                    <div 
                      key={index} 
                      className={`${index === bootLogIndex ? 'text-[#00E5FF] font-extrabold' : 'text-white/40'} transition-all`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <p className="text-[10px] text-white/35 font-mono">
              Secure TLS_1.3 tunnel certified successfully with offline database state buffers.
            </p>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
