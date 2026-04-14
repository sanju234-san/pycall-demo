import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Activity } from 'lucide-react';

const ArchitectureDiagram = () => {
    return (
        <section id="architecture" className="py-32 bg-[#05050a] relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Bridge Architecture</h2>
                    <p className="text-muted max-w-2xl mx-auto">
                        A high-speed, NDJSON-based communication layer that bypasses the limitations of traditional HTTP requests.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Flow Visual */}
                    <div className="space-y-12 relative z-10 flex flex-col items-center">
                        {/* Layer 1: Node.js */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 w-full max-w-md border-cyan/20 group hover:border-cyan/50 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-cyan/10 text-cyan">
                                    <Terminal size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl">Node.js Process</h3>
                                    <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Main Application Thread</p>
                                </div>
                            </div>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-[11px] text-cyan/80">
                                const result = await bridge.call('analyze', data);
                            </div>
                        </motion.div>

                        {/* Connection Bridge 1 */}
                        <div className="flex justify-center -my-6 h-32 relative">
                            <div className="w-[2px] h-full bg-gradient-to-b from-cyan via-violet to-amber" />
                            <motion.div 
                                animate={{ y: [0, 80] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute top-0 w-3 h-3 rounded-full bg-cyan glow-cyan"
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-24 px-4 py-2 glass-card bg-black border-white/10 rounded-xl flex items-center gap-3">
                                <Activity size={14} className="text-violet animate-pulse" />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">NDJSON Stream</p>
                                    <p className="text-[8px] text-muted font-mono">stdin / stdout pipe</p>
                                </div>
                            </div>
                        </div>

                        {/* Layer 2: Bridge Controller */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 w-full max-w-md border-violet/20"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-violet/10 text-violet">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl">Bridge Controller</h3>
                                    <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Lifecycle & Error Management</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted leading-relaxed">
                                Manages subprocess spawning, health checks, and automatic recovery protocols.
                            </p>
                        </motion.div>

                        {/* Connection Bridge 2 */}
                        <div className="flex justify-center -my-6 h-24 relative">
                            <div className="w-[2px] h-full bg-gradient-to-b from-violet to-amber" />
                            <motion.div 
                                animate={{ y: [0, 60] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 1 }}
                                className="absolute top-0 w-3 h-3 rounded-full bg-amber glow-amber"
                            />
                        </div>

                        {/* Layer 3: Python Environment */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 w-full max-w-md border-amber/20"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-xl bg-amber/10 text-amber">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl">Python Runtime</h3>
                                    <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Sandboxed Subprocess</p>
                                </div>
                            </div>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-[11px] text-amber/80">
                                @expose<br />
                                def analyze(data):<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;return run_inference(data)
                            </div>
                        </motion.div>
                    </div>

                    {/* Background Visuals */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/5 blur-[150px] -z-0" />
                </div>
            </div>
        </section>
    );
};

export default ArchitectureDiagram;
