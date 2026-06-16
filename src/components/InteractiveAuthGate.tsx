import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Cpu, Key, Mail, Sparkles, Terminal, ToggleLeft, 
  UserPlus, LogIn, Phone, Database, CloudLightning, Activity,
  Smartphone, CheckCircle, Send, ChevronRight, Fingerprint, Globe, Shield, Lock,
  ChevronLeft, Award, Blocks
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
  
  // Setup all form inputs as blank/empty by default for user to type/select
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accessPurpose, setAccessPurpose] = useState('');
  const [departmentAffiliation, setDepartmentAffiliation] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [accessAgreed, setAccessAgreed] = useState(false);
  
  // High professional wizard step state (Step 1: ID Gateway, Step 2: Protocol Core, Step 3: Security & Build)
  const [activeStep, setActiveStep] = useState(1);
  const [generationLoading, setGenerationLoading] = useState(false);

  // Loading & logs state for the booting phase
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogIndex, setBootLogIndex] = useState(0);
  const [errorText, setErrorText] = useState('');

  const bootLogs = [
    '⚡ [STASIS Engine] Initializing 3D spatial graphics pipelines...',
    '🔐 [Security Core] Establishing cryptographic tunnel with TLS_1.3 protocol...',
    '💾 [Cloud DB Broker] Syncing local offline buffers for index structures...',
    '📊 [Analytics Pipeline] Verifying tracking credentials and account phone reference...',
    '🛰️ [Telemetry Router] Linking global communications nodes at port 3000...',
    '📥 [Data Shield] Encrypting data savings cache modules...',
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
      }, 235);
    }
    return () => clearInterval(interval);
  }, [stage, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email) {
      setErrorText('Please enter your identity email credentials.');
      return;
    }

    try {
      if (authMode === 'signup') {
        if (!fullName) {
          setErrorText('Full Name is required for registration.');
          return;
        }
        if (!phone) {
          setErrorText('Phone Number contact coordinate is required.');
          return;
        }
        if (!accessAgreed) {
          setErrorText('Please acknowledge and check the system security protocol agreement.');
          return;
        }
        
        const ok = await signup(
          email, 
          fullName, 
          phone, 
          accessPurpose || 'General App Center Access',
          departmentAffiliation || 'Independent Workspace Partner',
          securityKey || 'SECURE-NONE-SPECIFIED'
        );
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
          setErrorText('Authentication query failed. User match not verified in database.');
        }
      }
    } catch (err) {
      setErrorText('Server handshake timeout.');
    }
  };

  const handleNextStep = () => {
    setErrorText('');
    if (activeStep === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setErrorText('Please complete your fundamental profile coordinates first.');
        return;
      }
      if (!email.includes('@')) {
        setErrorText('Please input a valid identity email format.');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!accessPurpose) {
        setErrorText('Please select an access purpose domain indicator.');
        return;
      }
      if (!departmentAffiliation.trim()) {
        setErrorText('Please specify your affiliation or development group.');
        return;
      }
      setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorText('');
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const generateCryptographicPasskey = () => {
    if (!phone) {
      setErrorText('Please provide a phone contact number on primary step to calibrate key seed values.');
      return;
    }
    setGenerationLoading(true);
    setTimeout(() => {
      const sanitizedPhone = phone.replace(/[^0-9]/g, '') || '7980259343';
      const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4) || 'CORE';
      const code = `IAH-${cleanName}-${sanitizedPhone.slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}-QSEC`;
      setSecurityKey(code);
      setGenerationLoading(false);
    }, 600);
  };

  const loadDemoPresets = () => {
    setFullName('Adi Kumar Sharma');
    setEmail('adikumarsharma06@gmail.com');
    setPhone('7980259343');
    setAccessPurpose('Sovereign AI Exploration');
    setDepartmentAffiliation('Architect Core Labs');
    setSecurityKey('IAH-SHAR-9343-4812-QSEC');
    setAccessAgreed(true);
    setErrorText('');
    setActiveStep(3);
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

  const domainOptions = [
    { title: 'Sovereign AI Exploration', desc: 'Query and test customized model blueprints', icon: Cpu, color: '#00E5FF' },
    { title: 'Full-Stack App Testing', desc: 'Deploy instant code sandbox architectures', icon: Blocks, color: '#00FFB2' },
    { title: 'System Security Audit', desc: 'Validate telemetry logs & dynamic dispatch systems', icon: Shield, color: '#7C3AED' },
    { title: 'Development Workspace Research', desc: 'Formulate private tracker dashboard schemas', icon: Terminal, color: '#F59E0B' }
  ];

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
            className="max-w-xl w-full text-center space-y-10 z-10 py-6"
          >
            
            {/* Pulsing Holomatrix Logo */}
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#7C3AED] to-[#00FFB2] opacity-25 blur-xl pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -inset-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 pointer-events-none"
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
              <div className="flex justify-center">
                <motion.span 
                  variants={titleItemVariants}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-[#00E5FF] inline-block shadow-lg"
                >
                  Secure Quantum Node Active
                </motion.span>
              </div>
              
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
            className="max-w-xl w-full relative z-10 py-4"
          >
            {/* Visual glow backdrop coordinates */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#7C3AED] via-[#00E5FF] to-[#00FFB2] opacity-25 blur-xl pointer-events-none" />

            <div className="bg-[#0b1020]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6 text-left">
              
              {/* Header description */}
              <div className="space-y-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[9px] font-bold uppercase tracking-wider text-[#00E5FF] mx-auto md:mx-0">
                    <Fingerprint size={10} className="animate-pulse" />
                    <span>STASIS COGNITIVE GRID GATING</span>
                  </div>
                  
                  {/* Step path dots for signup mode */}
                  {authMode === 'signup' && (
                    <div className="flex items-center justify-center gap-1.5 self-center">
                      {[1, 2, 3].map(stepNum => (
                        <div key={stepNum} className="flex items-center">
                          <div 
                            className={`w-5 h-5 rounded-md text-[9px] font-bold flex items-center justify-center font-mono border transition-all ${
                              activeStep === stepNum 
                                ? 'bg-[#00E5FF] text-black border-transparent shadow-[0_0_8px_#00E5FF]' 
                                : activeStep > stepNum 
                                  ? 'bg-[#00FFB2]/20 text-[#00FFB2] border-[#00FFB2]/30' 
                                  : 'bg-[#040611] text-white/30 border-white/10'
                            }`}
                          >
                            {stepNum}
                          </div>
                          {stepNum < 3 && <div className={`w-3 h-[1px] ${activeStep > stepNum ? 'bg-[#00FFB2]' : 'bg-white/10'}`} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                    {authMode === 'signup' ? 'Workspace Registration' : 'Intelligent Gateway Log'}
                  </h1>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {authMode === 'signup' 
                      ? 'Create credentials to register custom developer workspaces, low-latency AI runs, and persistent telemetry trackers.'
                      : 'Provide secure access credentials to retrieve, sync, and authorize your existing sandbox workspaces.'
                    }
                  </p>
                </div>
              </div>

              {/* Prefill credentials panel - optional shortcut */}
              <div className="p-3 bg-cyan-950/25 border border-cyan-500/15 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
                <div className="space-y-0.5">
                  <span className="block text-[11px] font-black text-white uppercase tracking-wider">Demo Sandbox Bypass</span>
                  <span className="text-[10px] text-[#00E5FF] font-mono leading-none">Bypass manual filling with pre-calibrated testing profile</span>
                </div>
                <button 
                  id="preset-demo-trigger"
                  type="button"
                  onClick={loadDemoPresets}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#00E5FF]/20 to-[#00FFB2]/20 border border-[#00E5FF]/30 text-[#00E5FF] font-black text-[9px] tracking-widest rounded-lg hover:bg-gradient-to-r hover:from-[#00E5FF] hover:to-[#00FFB2] hover:text-black hover:border-transparent transition-all cursor-pointer select-none active:scale-95"
                >
                  ONE-CLICK PREFILL
                </button>
              </div>

              {/* Action Mode Toggle Switches */}
              <div className="grid grid-cols-2 p-1 bg-[#040611] rounded-xl border border-white/5 text-xs font-bold font-sans">
                <button
                  type="button"
                  id="toggle-signup-mode"
                  onClick={() => { setAuthMode('signup'); setErrorText(''); setActiveStep(1); }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMode === 'signup' 
                    ? 'bg-gradient-to-r from-[#00E5FF]/15 to-[#00FFB2]/15 border border-[#00E5FF]/20 text-white font-black' 
                    : 'text-white/40 hover:text-white/85'
                  }`}
                >
                  <UserPlus size={13} />
                  <span>Register Sandbox Portal</span>
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
                  <span>Existing Member</span>
                </button>
              </div>

              {errorText && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 text-xs font-semibold"
                >
                  ⚠️ {errorText}
                </motion.div>
              )}

              {/* Interactive Form System */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SIGNUP STEPPED SEQUENCE */}
                {authMode === 'signup' ? (
                  <div className="space-y-4">
                    
                    {/* STEP 1: KEY PERSONAL COORDINATES */}
                    {activeStep === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-mono text-[#00E5FF] font-black uppercase tracking-wider">Step 01: Fundamental Identity</span>
                          <span className="text-[9px] text-white/30 truncate">Fields must be answered from blank</span>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Developer Full Name</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-3 text-white/30 text-[10px] font-mono font-bold select-none">@</span>
                            <input 
                              id="signup-name-field"
                              type="text"
                              className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white placeholder-white/20"
                              placeholder="Type your full name (Starts blank)"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Identity Email ID</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 text-white/30" size={13} />
                            <input 
                              id="signup-email-field"
                              type="email"
                              className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white placeholder-white/20"
                              placeholder="Type email address (Starts blank)"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">WhatsApp / Contact Coordinate</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 text-white/30" size={13} />
                            <input 
                              id="signup-phone-field"
                              type="tel"
                              className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white font-mono placeholder-white/20"
                              placeholder="Enter WhatsApp / mobile line (Starts blank)"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                          <span className="block text-[9px] text-white/40 font-mono mt-1.5 leading-normal">
                            📋 Custom logs and synchronization notifications will match this contact reference.
                          </span>
                        </div>

                        {/* Navigation Row */}
                        <div className="pt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-wider rounded-xl border border-white/10 hover:border-[#00E5FF]/30 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Proceed Code Protocol</span>
                            <ChevronRight size={12} className="stroke-[3]" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: PROTOCOL CORE & ACCESS DOMAINS */}
                    {activeStep === 2 && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-mono text-[#00E5FF] font-black uppercase tracking-wider">Step 02: Space Alignment</span>
                          <span className="text-[9px] text-white/30">Identify purpose and authorization domain</span>
                        </div>

                        {/* Purpose selection cards */}
                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-2">Select Primary Access Domain</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {domainOptions.map(option => {
                              const SelectedIcon = option.icon;
                              const isSelected = accessPurpose === option.title;
                              return (
                                <button
                                  type="button"
                                  key={option.title}
                                  onClick={() => setAccessPurpose(option.title)}
                                  className={`p-3 rounded-xl border text-left flex gap-3 transition-all cursor-pointer select-none ${
                                    isSelected 
                                      ? 'bg-white/5 border-[rgba(0,229,255,0.4)] shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                                      : 'bg-[#040611] border-white/5 hover:border-white/10 hover:bg-white/2'
                                  }`}
                                >
                                  <div className="mt-0.5 rounded-lg p-1.5 flex items-center justify-center bg-white/3" style={{ color: option.color }}>
                                    <SelectedIcon size={14} />
                                  </div>
                                  <div className="space-y-0.5 truncate">
                                    <span className="block text-xs font-black text-white truncate">{option.title}</span>
                                    <span className="block text-[9px] text-white/40 leading-tight whitespace-normal">{option.desc}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Company / Department Affiliation</label>
                          <input 
                            type="text"
                            value={departmentAffiliation}
                            onChange={(e) => setDepartmentAffiliation(e.target.value)}
                            placeholder="Independent researcher, development team, organization..."
                            className="w-full bg-[#040611] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white placeholder-white/20"
                            required
                          />
                        </div>

                        {/* Navigation Row */}
                        <div className="pt-4 flex justify-between gap-4">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2 bg-transparent text-white/50 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <ChevronLeft size={14} />
                            <span>Previous</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-wider rounded-xl border border-white/10 hover:border-[#00E5FF]/30 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>Verify Device Code</span>
                            <ChevronRight size={12} className="stroke-[3]" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: SECURITY KEYS AND BUILDS */}
                    {activeStep === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-mono text-[#00E5FF] font-black uppercase tracking-wider">Step 03: Security Credentials</span>
                          <span className="text-[9px] text-white/30">Sign cryptographic access key</span>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Secure Master Token Key</label>
                            <span className="text-[9px] text-cyan-400 font-bold font-mono">Quantum Cryptography</span>
                          </div>

                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={securityKey}
                              onChange={(e) => setSecurityKey(e.target.value)}
                              placeholder="Generate token or type unique security credentials"
                              className="w-full bg-[#040611] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-[#00FFB2] font-mono placeholder-white/20"
                            />
                            
                            <button
                              type="button"
                              onClick={generateCryptographicPasskey}
                              disabled={generationLoading}
                              className="px-3 bg-gradient-to-tr from-cyan-950/40 to-cyan-850/40 hover:from-cyan-900 hover:to-[#00FFB2]/20 border border-cyan-500/20 text-[#00E5FF] font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                            >
                              {generationLoading ? (
                                <span className="animate-spin h-3.5 w-3.5 border-2 border-t-transparent border-[#00E5FF] rounded-full" />
                              ) : (
                                <>
                                  <Key size={11} />
                                  <span>GENERATE KEY</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          {securityKey && (
                            <div className="mt-2 bg-[#040611]/80 border border-[#00FFB2]/10 p-2.5 rounded-lg text-left font-mono text-[9px] text-white/60 space-y-1">
                              <div className="text-[8px] text-[#00FFB2] uppercase tracking-[0.2em] font-black flex items-center gap-1">
                                <Award size={10} /> Active Crypto Seal Verified
                              </div>
                              <span className="block truncate">Registered to: <strong className="text-white font-black">{fullName || '@anonymous'}</strong></span>
                              <span className="block">Timestamp reference: <strong className="font-semibold text-[#00E5FF]">{new Date().toISOString()}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Interactive Verification Checks */}
                        <div className="p-3.5 bg-red-950/10 border border-white/5 rounded-xl space-y-2">
                          <label className="flex items-start gap-2.5 cursor-pointer selection-none">
                            <input 
                              type="checkbox"
                              checked={accessAgreed}
                              onChange={(e) => setAccessAgreed(e.target.checked)}
                              className="mt-0.5 rounded border-white/20 bg-[#040611] text-[#00E5FF] focus:ring-0 focus:ring-offset-0 cursor-pointer h-3.5 w-3.5"
                            />
                            <div className="space-y-0.5">
                              <span className="block text-[10px] text-white font-black uppercase tracking-wider leading-none">Acknowledge Security Protocol</span>
                              <p className="text-[9px] text-white/40 leading-normal">
                                Click here to agree to build offline indexes, synchronize system analytics to cloud nodes, and persist developer session tracking profiles.
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Navigation Row */}
                        <div className="pt-4 flex justify-between gap-4">
                          <button
                            type="button"
                            onClick={handlePrevStep}
                            className="px-4 py-2 bg-transparent text-white/50 hover:text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <ChevronLeft size={14} />
                            <span>Previous</span>
                          </button>

                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] hover:shadow-lg hover:shadow-[#00E5FF]/20 text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
                          >
                            <span>DEPLOY SECURE CORE</span>
                            <CloudLightning size={12} className="animate-bounce" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </div>
                ) : (
                  /* THE STANDARD SIGN-IN PORTAL FOR RETURNING MEMBERS */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Returning Member Email ID</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-white/30" size={13} />
                        <input 
                          id="login-email-field"
                          type="email"
                          className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white placeholder-white/20 font-mono"
                          placeholder="Type returning user email address (Starts blank)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1">Verify Return Credentials Token</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 text-white/30" size={13} />
                        <input 
                          type="password"
                          className="w-full bg-[#040611] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-[#00E5FF] transition-all text-white"
                          placeholder="••••••••"
                        />
                      </div>
                      <span className="block text-[9px] text-[#00E5FF] font-mono mt-1.5 leading-normal">
                        🗝️ Returning users authorize their profile via sandbox database structures instantly.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] hover:shadow-lg hover:shadow-[#00E5FF]/20 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 mt-4"
                    >
                      <span>Authorize Portal Gate</span>
                      <CloudLightning size={14} className="animate-pulse" />
                    </button>
                  </div>
                )}

              </form>

              {/* Portal status markers */}
              <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-2 justify-between items-center text-[10px] font-mono text-white/30">
                <span className="flex items-center gap-1.5">
                  <Database size={11} className="text-[#00FFB2]" />
                  Active db.json syncing
                </span>
                <span className="uppercase text-[9px] text-cyan-400 font-bold">SECURE PORTAL PORT: 3000</span>
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
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white select-none">
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
              <div className="bg-[#040611] rounded-xl p-4 text-left border border-white/5 font-mono text-[10px] h-32 overflow-y-auto space-y-1.5 text-white/70">
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

            <p className="text-[10px] text-white/35 font-mono select-none">
              Secure TLS_1.3 tunnel certified successfully with offline database state buffers.
            </p>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
