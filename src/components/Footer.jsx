import React, { useState } from 'react';
import { Github, Check, Copy, ExternalLink, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText('npm install pycall-node');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <footer className="bg-base border-t border-border pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="max-w-xs space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl text-cyan drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">⬡</span>
                            <span className="font-mono font-bold text-xl tracking-tight">
                                pycall-node
                            </span>
                        </div>
                        <p className="text-muted text-sm leading-relaxed">
                            The high-performance, asynchronous bridge between Node.js and Python. 
                            Built for heavy-duty AI and data processing workloads.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Ecosystem</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://www.npmjs.com/package/pycall-node" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors flex items-center gap-1">npm Registry <ExternalLink size={12}/></a></li>
                                <li><a href="https://github.com/sanju234-san/pycallnode" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-cyan transition-colors flex items-center gap-1">GitHub Source <ExternalLink size={12}/></a></li>
                                <li><a href="#" className="text-muted hover:text-cyan transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-muted hover:text-cyan transition-colors">MIT License</a></li>
                                <li><a href="#" className="text-muted hover:text-cyan transition-colors">Security</a></li>
                                <li><a href="#" className="text-muted hover:text-cyan transition-colors">Changelog</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Command Pill */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted md:text-right">Get Started</h4>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-3 bg-elevated border border-border px-6 py-3 rounded-xl text-sm font-mono hover:border-cyan transition-all group relative overflow-hidden"
                        >
                            <span className={copied ? 'text-green-400' : 'text-primary'}>
                                {copied ? 'Copied to Clipboard!' : 'npm install pycall-node'}
                            </span>
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <Check size={16} className="text-green-400" />
                                    </motion.div>
                                ) : (
                                    <Copy size={16} className="text-muted group-hover:text-cyan transition-colors" />
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-muted">
                        Built with <Heart size={12} className="text-crimson fill-crimson" /> by <span className="text-primary font-bold">Sanjeevni Dhir</span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-xs text-muted">
                        <span>© 2024 pycall-node. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
