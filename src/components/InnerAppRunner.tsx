/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import IconMapper from './IconMapper';
import { motion } from 'motion/react';
import { 
  Send, MessageSquare, Image, Sparkles, Loader2, ArrowLeft, RefreshCw, Copy, Check, Download, 
  Code2, AlignLeft, BarChart3, HelpCircle, FileText, ChevronRight, Play, Maximize2, ShieldAlert
} from 'lucide-react';

export default function InnerAppRunner() {
  const { apps, activeAppId, closeActiveApp, user, upgradeSubscription } = useApp();
  const currentApp = apps.find(a => a.id === activeAppId);

  const [copiedText, setCopiedText] = useState(false);

  // App specific states
  // 1. IAH Chatbot
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am IAH Chatbot Pro. Ask me any complex task, debug code, or brainstorm futuristic products. I think first, then write!' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // 2. GenVision Image Studio
  const [imagePrompt, setImagePrompt] = useState('An isometric 3D city made of glowing glass and purple light fibers, neon holographic billboard with "IAH.AI" sign, realistic, raytracing render, 8k resolution');
  const [aspect, setAspect] = useState('1:1');
  const [generatedImg, setGeneratedImg] = useState<string | null>(null);
  const [isGenVisionLoading, setIsGenVisionLoading] = useState(false);
  const [genDescription, setGenDescription] = useState('');

  // 3. Code Copilot
  const [codeSnippet, setCodeSnippet] = useState(`// Input or paste your code here\nfunction calculateStats(data) {\n  let total = 0;\n  for(let i=0; i<data.length; i++) {\n    total += data[i].value;\n  }\n  return total / data.length;\n}`);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [codeTask, setCodeTask] = useState('Explain what this does, refactor to modern ESM TypeScript, and optimize performance.');
  const [codeOutput, setCodeOutput] = useState('');
  const [isCodeLoading, setIsCodeLoading] = useState(false);

  // 4. Scribe Copywriter
  const [scribePrompt, setScribePrompt] = useState('A professional, exciting LinkedIn launch post introducing IAH.AI - the revolutionary multi-app hub containing modern coding copilots, design visualizers, and unified data engines.');
  const [scribeTone, setScribeTone] = useState('Professional & Exciting');
  const [scribeType, setScribeType] = useState('LinkedIn Post');
  const [scribeOutput, setScribeOutput] = useState('');
  const [isScribeLoading, setIsScribeLoading] = useState(false);

  // 5. Horizon Analyst
  const [dataPayload, setDataPayload] = useState(`Month,Users,Conversion,Revenue\nJan,12050,4.2,35200\nFeb,14900,4.6,44100\nMar,18200,4.9,59800\nApr,22100,4.7,68000\nMay,27500,5.1,89400\nJun,31200,5.3,104000`);
  const [analyzeCommand, setAnalyzeCommand] = useState('Highlight month-over-month growth patterns, calculate overall conversion average, and project cumulative performance.');
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const { submitFeedback } = useApp();
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const endMsgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endMsgRef.current) {
      endMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatLoading]);

  if (!currentApp) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const isLocked = currentApp.premium && (!user || user.subscription === 'free');

  // Submit Feedback Rating
  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const ok = await submitFeedback(currentApp.id, feedbackRating, feedbackComment);
    if (ok) {
      setFeedbackSuccess(true);
      setFeedbackComment('');
      setTimeout(() => setFeedbackSuccess(false), 4000);
    }
  };

  // Run IAH Chat
  const runChatMsg = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/apps/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: chatHistory })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setChatHistory(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', text: `Error: ${data.error || 'Connection with Gemini service timed out. Ensure your GEMINI_API_KEY is configured in Settings > Secrets.'}` }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', text: 'Error: Failed to connect to server backend.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Run GenVision Image Synthesis
  const runGenVision = async () => {
    if (!imagePrompt.trim() || isGenVisionLoading) return;
    setIsGenVisionLoading(true);
    setGeneratedImg(null);
    setGenDescription('');

    try {
      const res = await fetch('/api/apps/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, aspect })
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedImg(data.imageUrl);
        setGenDescription(data.description || 'Synth finished.');
      } else {
        alert(data.error || 'Synthesis error.');
      }
    } catch (err) {
      alert('Network synthesis failed.');
    } finally {
      setIsGenVisionLoading(false);
    }
  };

  // Run Copilot Refactoring
  const runCodeCopilot = async () => {
    if (!codeTask.trim() || isCodeLoading) return;
    setIsCodeLoading(true);
    setCodeOutput('');

    try {
      const res = await fetch('/api/apps/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeSnippet, task: codeTask, language: selectedLanguage })
      });
      const data = await res.json();
      if (res.ok) {
        setCodeOutput(data.reply);
      } else {
        setCodeOutput(`Error: ${data.error || 'Compilation response failed.'}`);
      }
    } catch (err) {
      setCodeOutput('Network error contact server failed.');
    } finally {
      setIsCodeLoading(false);
    }
  };

  // Run Scribe Writing
  const runScribe = async () => {
    if (!scribePrompt.trim() || isScribeLoading) return;
    setIsScribeLoading(true);
    setScribeOutput('');

    try {
      const res = await fetch('/api/apps/scribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: scribePrompt, tone: scribeTone, type: scribeType })
      });
      const data = await res.json();
      if (res.ok) {
        setScribeOutput(data.reply);
      } else {
        setScribeOutput(`Error: ${data.error || 'Writing companion call failed.'}`);
      }
    } catch (err) {
      setScribeOutput('Network error.');
    } finally {
      setIsScribeLoading(false);
    }
  };

  // Run Horizon Data Analysis
  const runHorizon = async () => {
    if (!dataPayload.trim() || isAnalysisLoading) return;
    setIsAnalysisLoading(true);
    setAnalysisOutput('');

    try {
      const res = await fetch('/api/apps/horizon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataText: dataPayload, analyzePrompt: analyzeCommand })
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisOutput(data.reply);
      } else {
        setAnalysisOutput(`Error: ${data.error || 'Parsing dataset failed.'}`);
      }
    } catch (err) {
      setAnalysisOutput('Network analysis failure.');
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  return (
    <motion.div 
      id="runner-viewport" 
      layoutId={`app-card-${currentApp.id}`}
      transition={{ type: "spring", stiffness: 180, damping: 24 }}
      className="min-h-screen bg-[#050816] text-white pt-20 px-4 md:px-8 pb-12"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <button 
              id="btn-back-marketplace"
              onClick={closeActiveApp}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all text-[#CFCFCF] text-sm font-medium"
            >
              <ArrowLeft size={16} />
              <span>Back to Hub</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-[#00E5FF] bg-clip-text text-transparent">
                  {currentApp.name}
                </h1>
                {currentApp.premium && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-fuchsia-600 border border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-[#CFCFCF] text-xs mt-1 max-w-xl line-clamp-1">
                {currentApp.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#CFCFCF] bg-[#0B1020] px-3.5 py-2 rounded-lg border border-white/5 shadow-inner">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse"></span>
            <span>Connected via Gemini Server (3.5-flash / 2.5-image)</span>
          </div>
        </div>

        {/* LOCKED AREA */}
        {isLocked ? (
          <div id="premium-locked-notice" className="bg-[#0B1020]/80 rounded-2xl border border-white/10 p-8 text-center max-w-2xl mx-auto backdrop-blur-md shadow-2xl relative overflow-hidden my-12">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#7C3AED] via-[#00E5FF] to-[#00FFB2]"></div>
            <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/50 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} className="text-[#00E5FF]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 tracking-wide">Premium Application</h2>
            <p className="text-[#CFCFCF] text-sm mb-6 max-w-md mx-auto leading-relaxed">
              <strong>{currentApp.name}</strong> utilizes state-of-the-art multi-step reasoning which requires continuous cloud provisioning. Unlock all premium applications by upgrading your tier.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="btn-runner-upgrade"
                onClick={() => {
                  closeActiveApp();
                  // Trigger view to pricing
                  const PricingBtn = document.getElementById('nav-item-pricing');
                  if (PricingBtn) PricingBtn.click();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold tracking-wide text-black bg-gradient-to-r from-[#00E5FF] to-[#00FFB2] hover:shadow-lg hover:shadow-[#00E5FF]/20 cursor-pointer transform hover:-translate-y-0.5 transition-all text-sm"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={closeActiveApp}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-all text-[#CFCFCF]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* MAIN APP ENGINE CELL */}
            <div className="lg:col-span-3 bg-[#0B1020]/90 rounded-2xl border border-white/10 p-6 shadow-2xl backdrop-blur-md flex flex-col min-h-[550px]">
              
              {/* APP 1: IAH Chat */}
              {currentApp.id === 'iah-chat' && (
                <div id="app-iah-chat" className="flex flex-col flex-1">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm tracking-wide">Interactive Dialogue Shell</h3>
                        <p className="text-white/50 text-[10px]">Active Model: gemini-3.5-flash</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setChatHistory([{ role: 'model', text: 'History reset. Ask me something new!' }])}
                      className="p-2 hover:bg-white/5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white transition-all flex items-center gap-1.5"
                      title="Clear Chat Settings"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Message History Scroller */}
                  <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto mb-4 p-4 border border-white/5 bg-[#050816]/60 rounded-xl space-y-4">
                    {chatHistory.map((item, idx) => (
                      <div key={idx} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                          item.role === 'user' 
                          ? 'bg-[#7C3AED]/20 border border-[#7C3AED]/35 text-white' 
                          : 'bg-[#0B1020] border border-white/10 text-[#CFCFCF]'
                        }`}>
                          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">
                            {item.role === 'user' ? (user ? user.fullName : 'Guest') : 'IAH Chatbot Pro'}
                          </div>
                          <div className="whitespace-pre-line">{item.text}</div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#0B1020] border border-white/10 rounded-xl px-4 py-3 max-w-[80%]">
                          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1.5">Thinking...</div>
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Loader2 size={13} className="animate-spin text-[#00E5FF]" />
                            <span>Interlinking semantic models</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={endMsgRef} />
                  </div>

                  {/* Quick Suggestions Inputs */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      onClick={() => setChatInput('Draft a compelling marketing summary for our cloud SaaS offering.')}
                      className="text-[10px] text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                    >
                      💡 Create SaaS copy
                    </button>
                    <button 
                      onClick={() => setChatInput('Write a responsive Tailwind CSS horizontal navbar with glassmorphism styling.')}
                      className="text-[10px] text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                    >
                      💡 Tailwind css navbar
                    </button>
                    <button 
                      onClick={() => setChatInput('Why does TypeScript use structural typing systems instead of nominal patterns?')}
                      className="text-[10px] text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                    >
                      💡 nominal vs structural typing
                    </button>
                  </div>

                  {/* Message Input Form */}
                  <div className="flex gap-2.5">
                    <input 
                      id="input-chat-query"
                      type="text"
                      className="flex-1 bg-[#050816] border border-white/10 focus:border-[#00E5FF]/50 rounded-xl px-4 py-3 text-sm placeholder-white/30 focus:outline-none transition-all text-white"
                      placeholder="Ask IAH Anything..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && runChatMsg()}
                    />
                    <button
                      id="btn-send-chat"
                      onClick={runChatMsg}
                      disabled={isChatLoading || !chatInput.trim()}
                      className="px-5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:shadow-lg hover:shadow-[#00E5FF]/20 flex items-center justify-center transform active:scale-95 transition-all text-black font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* APP 2: GenVision Studio */}
              {currentApp.id === 'genvision-canvas' && (
                <div id="app-genvision" className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  {/* Synthesis Dashboard parameters */}
                  <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/30 flex items-center justify-center text-[#7C3AED]">
                          <Image size={18} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm tracking-wide">Image Generation Laboratory</h3>
                          <p className="text-white/50 text-[10px]">Model: gemini-2.5-flash-image</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">Visual Text prompt</label>
                        <textarea 
                          id="input-image-prompt"
                          className="w-full h-24 bg-[#050816] border border-white/10 focus:border-[#7C3AED]/50 rounded-xl p-3 text-xs placeholder-white/30 focus:outline-none transition-all resize-none text-white"
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          placeholder="Describe the aesthetic creation..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider block">AESTHETIC ASPECT RATIO</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['1:1', '4:3', '16:9', '9:16'].map(ratio => (
                            <button
                              key={ratio}
                              onClick={() => setAspect(ratio)}
                              className={`py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg border transition-all ${
                                aspect === ratio 
                                ? 'bg-[#7C3AED]/10 border-[#7C3AED] text-white shadow-lg' 
                                : 'bg-[#050816] border-white/5 text-white/50 hover:text-white'
                              }`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        id="btn-synthesize-image"
                        onClick={runGenVision}
                        disabled={isGenVisionLoading || !imagePrompt.trim()}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-fuchsia-600 hover:shadow-lg hover:shadow-[#7C3AED]/35 flex items-center justify-center gap-2 font-bold tracking-wide transform active:scale-95 transition-all text-sm text-white cursor-pointer disabled:opacity-40"
                      >
                        {isGenVisionLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Synthesizing Canvas...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            <span>Synthesize Artwork</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Generated Visual Outcome Output */}
                  <div className="flex flex-col items-center justify-center bg-[#050816]/60 border border-white/5 rounded-xl p-4 relative min-h-[350px]">
                    {isGenVisionLoading ? (
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-full border-4 border-t-[#7C3AED] border-white/5 animate-spin"></div>
                        <p className="text-xs text-[#CFCFCF] text-center max-w-[200px]">Generating visual matrices. This may take up to 20 seconds...</p>
                      </div>
                    ) : generatedImg ? (
                      <div className="w-full flex flex-col items-center space-y-3">
                        <img 
                          id="img-vision-output"
                          src={generatedImg} 
                          alt="AI synthesized visualization" 
                          className="w-full max-h-[300px] object-contain rounded-lg shadow-2xl border border-white/10"
                        />
                        <div className="w-full flex items-center justify-between text-xs text-white/50 px-1">
                          <span>Aspect: {aspect}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleCopy(imagePrompt)}
                              className="p-1.5 hover:bg-white/5 rounded-lg border border-white/10 hover:text-white"
                              title="Copy prompt"
                            >
                              <Copy size={13} />
                            </button>
                            <a 
                              href={generatedImg} 
                              download="IAH_Generated_Concept.png"
                              className="p-1.5 hover:bg-white/5 rounded-lg border border-white/10 hover:text-white flex items-center"
                              title="Download Asset"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Download size={13} />
                            </a>
                          </div>
                        </div>
                        {genDescription && (
                          <p className="text-[10px] text-[#CFCFCF] italic bg-[#0B1020] px-3 py-2 rounded border border-white/5 w-full text-center">
                            {genDescription}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center space-y-2 p-6">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 mx-auto mb-2">
                          <Image size={24} />
                        </div>
                        <h4 className="font-semibold text-xs tracking-wide">Interactive Render Window</h4>
                        <p className="text-[10px] text-white/40 max-w-[220px] mx-auto leading-normal">Configure aspect and click synthesize to trigger the high-fidelity server image model.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* APP 3: SyntaxAI Code Copilot */}
              {currentApp.id === 'syntaxai-copilot' && (
                <div id="app-syntaxai" className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  {/* Code Editor cell */}
                  <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="text-[#00FFB2]" size={18} />
                          <span className="font-semibold text-sm tracking-wide">Syntax Studio</span>
                        </div>
                        <select 
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="bg-[#050816] text-xs border border-white/10 focus:outline-none rounded px-2.5 py-1 text-white"
                        >
                          {['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'C++', 'Java', 'HTML/CSS'].map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">Input Source Code</label>
                        <textarea
                          id="textarea-copilot-input"
                          className="w-full h-40 bg-[#050816] border border-white/10 focus:border-[#00FFB2]/50 rounded-xl p-3 text-xs font-mono placeholder-white/30 focus:outline-none transition-all resize-none text-[#00FFB2]"
                          value={codeSnippet}
                          onChange={(e) => setCodeSnippet(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">COPILOT INSTRUCTIONS COMMAND</label>
                        <input
                          id="input-copilot-command"
                          type="text"
                          className="w-full bg-[#050816] border border-white/10 focus:border-[#00FFB2]/50 rounded-xl px-3 py-2 text-xs placeholder-white/40 focus:outline-none text-white"
                          value={codeTask}
                          onChange={(e) => setCodeTask(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        id="btn-run-syntax"
                        onClick={runCodeCopilot}
                        disabled={isCodeLoading || !codeTask.trim()}
                        className="w-full py-2.5 rounded-xl bg-[#00FFB2] text-black hover:shadow-lg hover:shadow-[#00FFB2]/20 flex items-center justify-center gap-2 font-bold tracking-wide transform active:scale-95 transition-all text-xs cursor-pointer disabled:opacity-40"
                      >
                        {isCodeLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Compiling execution path...</span>
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            <span>Execute Synthesizer Copilot</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Refactored compiled answer cells */}
                  <div className="flex flex-col bg-[#050816]/60 border border-white/5 rounded-xl p-4 min-h-[350px] justify-between relative">
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                      {codeOutput ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Synthesized Result</span>
                            <button
                              onClick={() => handleCopy(codeOutput)}
                              className="text-[10px] text-[#00FFB2] hover:underline flex items-center gap-1.5"
                            >
                              {copiedText ? <Check size={11} /> : <Copy size={11} />}
                              <span>{copiedText ? 'Copied' : 'Copy Result'}</span>
                            </button>
                          </div>
                          <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-[#CFCFCF] pt-2">
                            {codeOutput}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-12">
                          <Code2 size={24} className="text-white/20 mb-2" />
                          <h4 className="font-semibold text-xs text-white/70">Copilot Output Workspace</h4>
                          <p className="text-[10px] text-white/40 max-w-[200px] leading-relaxed">Your parsed and translated output script will be formatted intelligently here under clean design highlights.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* APP 4: Scribe Pro Copywriter */}
              {currentApp.id === 'scribe-pro' && (
                <div id="app-scribe" className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  {/* Copywriting input parameter blocks */}
                  <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="text-[#00E5FF]" size={18} />
                          <span className="font-semibold text-sm tracking-wide">Scribe Writing Laboratory</span>
                        </div>
                        <select 
                          value={scribeType}
                          onChange={(e) => setScribeType(e.target.value)}
                          className="bg-[#050816] text-xs border border-white/10 focus:outline-none rounded px-2.5 py-1 text-white"
                        >
                          {['LinkedIn Post', 'Cold Email Pitch', 'Executive Summary', 'A/B Ad Copies', 'Product Update Newsletter'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">TARGET TONE ACCENTS</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['Professional & Exciting', 'Informative & Concise', 'Persuasive Copy'].map(t => (
                            <button
                              key={t}
                              onClick={() => setScribeTone(t)}
                              className={`py-1.5 text-[9px] font-bold rounded border transition-all ${
                                scribeTone === t 
                                ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white' 
                                : 'bg-[#050816] border-white/5 text-white/40 hover:text-white'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">Core copywriting instructions</label>
                        <textarea
                          id="textarea-scribe-input"
                          className="w-full h-36 bg-[#050816] border border-white/10 focus:border-[#00E5FF]/50 rounded-xl p-3 text-xs placeholder-white/30 focus:outline-none transition-all resize-none text-white leading-relaxed"
                          value={scribePrompt}
                          onChange={(e) => setScribePrompt(e.target.value)}
                          placeholder="Describe keywords or objective scope..."
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        id="btn-run-scribe"
                        onClick={runScribe}
                        disabled={isScribeLoading || !scribePrompt.trim()}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] hover:shadow-lg hover:shadow-[#00E5FF]/20 flex items-center justify-center gap-2 font-bold tracking-wide transform active:scale-95 transition-all text-xs cursor-pointer text-white disabled:opacity-40"
                      >
                        {isScribeLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Drafting professional template...</span>
                          </>
                        ) : (
                          <>
                            <FileText size={14} />
                            <span>Draft Copy Template</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Copy outcome cellular interface */}
                  <div className="flex flex-col bg-[#050816]/60 border border-white/5 rounded-xl p-4 min-h-[350px] justify-between relative">
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                      {scribeOutput ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Draft Outcomes</span>
                            <button
                              onClick={() => handleCopy(scribeOutput)}
                              className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-1.5"
                            >
                              {copiedText ? <Check size={11} /> : <Copy size={11} />}
                              <span>{copiedText ? 'Copied' : 'Copy Draft'}</span>
                            </button>
                          </div>
                          <div className="text-[11px] whitespace-pre-wrap leading-relaxed text-[#CFCFCF] pt-2">
                            {scribeOutput}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-12">
                          <FileText size={24} className="text-white/20 mb-2" />
                          <h4 className="font-semibold text-xs text-white/70">Draft Box Output</h4>
                          <p className="text-[10px] text-white/40 max-w-[200px] leading-relaxed">Select content template outlines and click draft copy to generate structured templates immediately in this viewport.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* APP 5: Horizon Analyst */}
              {currentApp.id === 'horizon-analyst' && (
                <div id="app-horizon" className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  
                  {/* Data Input Block panel */}
                  <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00FFB2]/10 border border-[#00FFB2]/30 flex items-center justify-center text-[#00FFB2]">
                          <BarChart3 size={18} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm tracking-wide">Horizon Analytics Engine</h3>
                          <p className="text-white/50 text-[10px]">Model: gemini-3.5-flash</p>
                        </div>
                      </div>

                      <div className="space-y-1 block">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">Enter Numeric statistics or CSV list</label>
                        <textarea
                          id="textarea-horizon-input"
                          className="w-full h-36 bg-[#050816] border border-white/10 focus:border-[#00FFB2]/50 rounded-xl p-3 text-xs font-mono placeholder-white/30 focus:outline-none transition-all resize-none text-white whitespace-pre"
                          value={dataPayload}
                          onChange={(e) => setDataPayload(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1 block">
                        <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">Analysis objective command</label>
                        <input
                          id="input-horizon-command"
                          type="text"
                          className="w-full bg-[#050816] border border-white/10 focus:border-[#00FFB2]/50 rounded-xl px-3 py-2 text-xs placeholder-white/40 focus:outline-none text-white"
                          value={analyzeCommand}
                          onChange={(e) => setAnalyzeCommand(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        id="btn-run-horizon"
                        onClick={runHorizon}
                        disabled={isAnalysisLoading || !dataPayload.trim()}
                        className="w-full py-2.5 rounded-xl bg-[#00FFB2] text-black hover:shadow-lg hover:shadow-[#00FFB2]/20 flex items-center justify-center gap-2 font-bold tracking-wide transform active:scale-95 transition-all text-xs cursor-pointer disabled:opacity-40"
                      >
                        {isAnalysisLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Compiling numerical insights...</span>
                          </>
                        ) : (
                          <>
                            <BarChart3 size={14} />
                            <span>Synthesize Analytics</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Analytic output visualization table */}
                  <div className="flex flex-col bg-[#050816]/60 border border-white/5 rounded-xl p-4 min-h-[350px] justify-between relative">
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                      {analysisOutput ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Strategic Synthesis</span>
                            <button
                              onClick={() => handleCopy(analysisOutput)}
                              className="text-[10px] text-[#00FFB2] hover:underline flex items-center gap-1.5"
                            >
                              {copiedText ? <Check size={11} /> : <Copy size={11} />}
                              <span>{copiedText ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <div className="text-[11.5px] whitespace-pre-wrap leading-relaxed text-[#CFCFCF] pt-2 prose prose-invert font-sans">
                            {analysisOutput}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-12">
                          <BarChart3 size={24} className="text-white/20 mb-2" />
                          <h4 className="font-semibold text-xs text-white/70">Calculated Metrics</h4>
                          <p className="text-[10px] text-white/40 max-w-[200px] leading-relaxed">Paste records, click synthesize, and watch automated matrices map averages and strategic summaries.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* APP EXTERNAL FRAME WORKSPACE (EarthVision AI, Futuristic Habitation Tracker, Architech Agent) */}
              {!currentApp.url.startsWith('internal:') && (
                <div className="flex flex-col flex-1 h-full w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                        <IconMapper name={currentApp.logo} size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xs tracking-wider text-white uppercase">{currentApp.name} System Frame</h3>
                        <p className="text-[#00FFB2] text-[10px] font-mono leading-tight">{currentApp.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const iframe = document.getElementById('external-app-frame') as HTMLIFrameElement;
                          if (iframe) iframe.src = currentApp.url;
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer font-medium"
                        title="Reload Container Sandbox"
                      >
                        <RefreshCw size={12} className="text-[#00E5FF]" />
                        <span>Reset Sandbox</span>
                      </button>
                      <a 
                        href={currentApp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-[#00E5FF] text-black hover:bg-[#00FFB2] rounded-xl text-xs font-extrabold tracking-wide hover:shadow-lg hover:shadow-[#00E5FF]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Open direct in new browser tab"
                      >
                        <Maximize2 size={12} />
                        <span>Launch External</span>
                      </a>
                    </div>
                  </div>
                  
                  {/* Embedded Custom Iframe Body - Height scales responsively with screen heights/widths */}
                  <div className="w-full bg-[#050816] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
                    <iframe 
                      id="external-app-frame"
                      src={currentApp.url}
                      className="w-full h-[540px] sm:h-[640px] lg:h-[740px] xl:h-[800px] max-h-[82vh] border-none bg-black/45"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* SIDE FEEDBACK / PERFORMANCE RATINGS RAIL */}
            <div className="space-y-6">
              
              {/* App Overview stats */}
              <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] mb-4">MODULE PROFILE</h4>
                <div className="space-y-3.5 text-xs text-white/70">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Active State</span>
                    <span className="text-[#00FFB2] font-bold">READY</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Historic Submodules</span>
                    <span className="font-bold font-mono text-white">{currentApp.tags.length} Subsets</span>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                    {currentApp.tags.map(tag => (
                      <span key={tag} className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-white/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Feedback Form */}
              <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-5 shadow-xl">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-3">Leave Feedback</h4>
                
                {user ? (
                  feedbackSuccess ? (
                    <div className="text-xs text-[#00FFB2] font-semibold bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-lg p-3 text-center animate-pulse">
                      Thank you! Feedback logged successfully.
                    </div>
                  ) : (
                    <form onSubmit={submitRating} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-white/40 block mb-1 font-bold uppercase tracking-wider">Aesthetic Rating</label>
                        <select
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                          className="w-full bg-[#050816] text-xs border border-white/10 rounded px-2 py-1.5 focus:outline-none text-white font-semibold"
                        >
                          <option value="5">★★★★★ Exceptional (5/5)</option>
                          <option value="4">★★★★ Great (4/5)</option>
                          <option value="3">★★★ Average (3/5)</option>
                          <option value="2">★★ Disappointing (2/5)</option>
                          <option value="1">★ Inoperable (1/5)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-white/40 block mb-1 font-bold uppercase tracking-wider">Comment Suggestion</label>
                        <textarea
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="Your user feedback experience..."
                          className="w-full h-16 bg-[#050816] text-xs border border-white/10 rounded p-2 focus:outline-none resize-none text-white placeholder-white/30 leading-snug"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-1.5 rounded bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-all cursor-pointer text-center"
                      >
                        Submit Performance Grade
                      </button>
                    </form>
                  )
                ) : (
                  <p className="text-[10px] text-white/40 italic leading-snug">Authenticate to leave performance ratings and sync custom cloud persistent metrics.</p>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
}
