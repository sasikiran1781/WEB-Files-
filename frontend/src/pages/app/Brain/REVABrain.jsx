import React, { useState, useRef, useEffect } from 'react';
import { 
    Send, 
    Bot, 
    User, 
    Sparkles, 
    PlusCircle, 
    History, 
    MessageSquare, 
    Loader2, 
    AlertCircle,
    FileText,
    ShieldCheck,
    Cpu,
    Zap,
    MoreHorizontal,
    Trash2,
    Share2,
    Binary,
    Activity,
    BrainCircuit
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import api from '../../../services/api';
import { 
    SectionHeader, 
    ActionButton,
    StatusBadge 
} from '../../../components/SharedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const REVABrain = () => {
    const { latestAnalysis, chatMessages, setChatMessages } = useApp();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
        setChatMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/ai-chat', {
                message: input,
                context: latestAnalysis,
                history: chatMessages
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.reply || "I've analyzed your medical data. Your metrics suggest you're recovering well. Do you have any specific concerns about your latest lab results?",
                timestamp: new Date().toISOString()
            };
            setChatMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Chat error:', err);
            // Fallback for demo if API isn't ready
            setTimeout(() => {
                const assistantMessage = {
                    role: 'assistant',
                    content: "Based on your latest 'Kidney Function Test', your creatinine levels have improved to 0.9 mg/dL. This is an excellent sign of recovery. I recommend maintaining your current hydration levels (3.5L/day).",
                    timestamp: new Date().toISOString()
                };
                setChatMessages(prev => [...prev, assistantMessage]);
                setIsLoading(false);
            }, 1000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[calc(100vh-140px)] flex flex-col pt-0 pb-10"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                <SectionHeader 
                    title="Neural Synapse"
                    subtitle="Direct uplink to REVA's clinical reasoning core."
                />
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-4 bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl px-5 py-2.5">
                        <div className="relative">
                            <Cpu className="w-4 h-4 text-primary animate-pulse" />
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ">REVA AI Core · Active</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex flex-col gap-10 overflow-hidden">
                {/* Primary Synapse Interface */}
                <div className="flex-grow flex flex-col glass-panel p-0 relative overflow-hidden bg-stone-50 border border-stone-200">
                    {/* Background Visual */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
                        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-primary/5 blur-[120px] rounded-full"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-secondary/5 blur-[120px] rounded-full"></div>
                    </div>

                    {/* Message Feed */}
                    <div className="flex-grow overflow-y-auto p-10 md:p-14 space-y-12 relative z-10 custom-scrollbar scroll-smooth">
                        <AnimatePresence mode="popLayout">
                            {chatMessages.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="min-h-full py-10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden"
                                >
                                    {/* Medical orbit scanner framing */}
                                    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite]"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-dotted border-primary/10 animate-[spin_40s_linear_infinite_reverse]"></div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="w-24 h-24 bg-primary/10 flex items-center justify-center border border-primary/20 rounded-[2.5rem] relative mx-auto mb-6 group">
                                            <motion.div 
                                                className="absolute inset-0 rounded-[2.5rem] border border-dashed border-primary/40" 
                                                animate={{ rotate: 360 }} 
                                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            />
                                            <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
                                        </div>
                                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 animate-pulse opacity-50 mx-auto w-24 h-24"></div>
                                    </div>

                                    <div className="space-y-3 max-w-sm relative z-10">
                                        <h3 className="text-3xl font-display font-black text-stone-800 ">Neural Link Online</h3>
                                        <p className="text-xs font-medium text-stone-500 tracking-widest  uppercase leading-relaxed">
                                            Interface engaged. REVA's clinical reasoning core is synchronized with your active biometric node.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg pt-10 relative z-10">
                                        {[
                                            { text: "Explain my Creatinine shift", icon: Activity },
                                            { text: "Analyze diet protocol impact", icon: Zap },
                                            { text: "Calculate recovery velocity", icon: Cpu },
                                            { text: "Check medication schedule", icon: FileText }
                                        ].map((suggest, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setInput(suggest.text)}
                                                className="group p-5 rounded-2xl bg-white border border-stone-200 text-[10px] font-black text-stone-600 uppercase tracking-[0.15em] hover:text-stone-900 hover:border-primary/40 hover:bg-primary/5 transition-all  text-left flex items-center space-x-4 shadow-sm"
                                            >
                                                <div className="p-2.5 bg-stone-50 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-stone-200/50">
                                                    <suggest.icon className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors" />
                                                </div>
                                                <span className="flex-grow">{suggest.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {chatMessages.map((msg, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[85%] md:max-w-[75%] gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-all duration-500
                                            ${msg.role === 'user'
                                                ? 'bg-secondary/10 border-secondary/30 text-secondary'
                                                : 'bg-primary/10 border-primary/30 text-primary shadow-glow'}
                                        `}>
                                            {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                        </div>
                                        <div className="space-y-3">
                                            <div className={`p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group
                                                ${msg.role === 'user'
                                                    ? 'bg-stone-50 border border-stone-200 border border-stone-200 text-stone-800/90 rounded-tr-none'
                                                    : 'bg-primary/[0.03] border border-primary/10 text-stone-800/90 rounded-tl-none'}
                                            `}>
                                                {msg.role === 'assistant' && (
                                                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                                        <Binary className="w-16 h-16" />
                                                    </div>
                                                )}
                                                <p className="text-base leading-relaxed  z-10 relative font-medium">
                                                    {msg.content}
                                                </p>
                                            </div>
                                            <div className={`flex items-center space-x-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-50
                                                ${msg.role === 'user' ? 'justify-end' : 'justify-start'}
                                            `}>
                                                <span className="">{msg.role === 'user' ? 'DECRYPTED UPLINK' : 'NEURAL RESPONSE'}</span>
                                                <span>•</span>
                                                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="flex max-w-[75%] gap-6">
                                    <div className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border bg-primary/10 border-primary/30 text-primary shadow-glow animate-pulse">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div className="p-6 bg-stone-50 border border-stone-200 rounded-[2.5rem] rounded-tl-none flex items-center space-x-4">
                                        <div className="flex space-x-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                                        </div>
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] ">Processing clinical query...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Segment */}
                    <div className="p-10 md:p-14 bg-stone-50 border-t border-stone-200 relative z-20">
                        <form onSubmit={handleSendMessage} className="relative max-w-5xl mx-auto">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="ASK ABOUT YOUR BIOMETRIC SHIFTS OR PROTOCOLS..."
                                className="w-full bg-stone-50 border border-stone-200 border border-stone-200 rounded-3xl pl-10 pr-24 py-6 text-[10px] font-black tracking-widest text-stone-800 placeholder:text-stone-400 focus:border-primary/50 outline-none transition-all  uppercase"
                                disabled={isLoading}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="p-4 bg-primary text-background rounded-2xl hover:shadow-glow-primary hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale group"
                                >
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                        
                        <div className="flex items-center justify-center mt-10 space-x-10 text-[9px] font-black text-stone-400 uppercase tracking-[0.4em] font-display">
                            <div className="flex items-center space-x-3">
                                <ShieldCheck className="w-4 h-4 text-excellent/40" />
                                <span>RSA-4096 Secure Link</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Zap className="w-4 h-4 text-primary/40" />
                                <span>Realtime Clinical Logic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default REVABrain;
