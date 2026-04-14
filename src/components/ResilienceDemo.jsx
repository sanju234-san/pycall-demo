import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, RefreshCw, XCircle, CheckCircle2, Info } from 'lucide-react';

const ResilienceDemo = () => {
  const [status, setStatus] = useState('alive'); // alive, crashing, restarting, dead
  const [restartCount, setRestartCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState(null);
  
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const maxRestarts = 3;

  const triggerCrash = () => {
    if (status !== 'alive') return;

    setStatus('crashing');
    setToast({ message: 'Process crashed (code=1)', type: 'error' });
    
    setTimeout(() => {
      if (restartCount < maxRestarts) {
        startRestart();
      } else {
        setStatus('dead');
        setToast({ message: 'Max restarts reached. crash emitted.', type: 'critical' });
      }
    }, 1000);
  };

  const startRestart = () => {
    setStatus('restarting');
    const delay = Math.pow(2, restartCount) * 1000;
    setCountdown(delay / 1000);
    
    setToast({ message: `Restarting in ${delay}ms...`, type: 'info' });

    countdownRef.current = setInterval(() => {
      setCountdown(c => Math.max(0, c - 0.1));
    }, 100);

    timerRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);
      setRestartCount(r => r + 1);
      setStatus('alive');
      setToast({ message: 'Process restarted successfully ✓', type: 'success' });
    }, delay);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    setStatus('alive');
    setRestartCount(0);
    setCountdown(0);
    setToast(null);
  };

  const backoffData = [
    { n: 0, ms: 1000, active: restartCount === 0 },
    { n: 1, ms: 2000, active: restartCount === 1 },
    { n: 2, ms: 4000, active: restartCount === 2 },
    { n: 3, ms: 8000, active: restartCount === 3 },
  ];

  return (
    <section id="resilience" className="py-24 bg-base relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Auto-Restart & Resilience</h2>
          <div className="w-24 h-1 bg-amber mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual: The Process Circle */}
          <div className="flex flex-col items-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {status === 'alive' && (
                  <motion.div
                    key="alive"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                    className="w-64 h-64 rounded-full bg-green-500/10 border-4 border-green-500 flex flex-col items-center justify-center gap-4 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                  >
                    <Zap size={48} className="text-green-500 fill-green-500" />
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-lg font-bold">Python Process</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-green-500 animate-pulse">ALIVE</span>
                    </div>
                  </motion.div>
                )}

                {status === 'crashing' && (
                  <motion.div
                    key="crash"
                    className="w-64 h-64 rounded-full bg-crimson/20 border-4 border-crimson flex items-center justify-center"
                  >
                    <XCircle size={64} className="text-crimson" />
                  </motion.div>
                )}

                {status === 'restarting' && (
                  <motion.div
                    key="restarting"
                    className="w-64 h-64 rounded-full bg-amber/10 border-4 border-dashed border-amber flex flex-col items-center justify-center gap-4"
                  >
                    <RefreshCw size={48} className="text-amber animate-spin" />
                    <div className="flex flex-col items-center text-amber">
                      <span className="font-mono font-bold tracking-widest">RESTARTING</span>
                      <span className="text-2xl font-black">{countdown.toFixed(1)}s</span>
                    </div>
                  </motion.div>
                )}

                {status === 'dead' && (
                  <motion.div
                    key="dead"
                    className="w-64 h-64 rounded-full bg-zinc-900 border-4 border-zinc-700 flex flex-col items-center justify-center gap-4 opacity-50 shadow-none border-dashed"
                  >
                    <span className="text-5xl">💀</span>
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-lg font-bold text-muted">TERMINATED</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Toast Message Overlay */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className={`absolute bottom-[-60px] px-6 py-2 rounded-lg border flex items-center gap-3 backdrop-blur-md z-20 ${
                      toast.type === 'error' ? 'bg-crimson/10 border-crimson text-crimson' :
                      toast.type === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' :
                      toast.type === 'info' ? 'bg-amber/10 border-amber text-amber' :
                      'bg-zinc-900 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {toast.type === 'error' ? <AlertTriangle size={16} /> :
                     toast.type === 'success' ? <CheckCircle2 size={16} /> :
                     toast.type === 'info' ? <RefreshCw size={16} className="animate-spin" /> :
                     <Info size={16} />}
                    <span className="text-xs font-bold font-mono">{toast.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-20 flex gap-4">
              <button
                onClick={triggerCrash}
                disabled={status !== 'alive'}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                  status === 'alive' ? 'bg-crimson text-white hover:scale-105 shadow-[0_0_20px_rgba(255,51,102,0.3)]' : 'bg-muted/20 text-muted cursor-not-allowed'
                }`}
              >
                💥 Crash Process
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-surface border border-border text-muted hover:text-primary transition-all"
              >
                Reset
              </button>
            </div>
            
            <div className="mt-8 text-xs font-mono text-muted flex items-center gap-2">
               Attempt <span className={restartCount > 0 ? 'text-amber' : ''}>{restartCount}</span> / {maxRestarts}
            </div>
          </div>

          {/* Logic Panel */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-amber/20 bg-amber/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info size={20} className="text-amber" /> Restart Strategy
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Bridge uses an exponential backoff strategy to prevent system thrashing during persistent failures.
              </p>

              <div className="bg-base/50 p-4 rounded-lg font-mono text-sm mb-6 border border-border">
                <div className="text-cyan mb-2">Formula:</div>
                <div className="text-primary text-xl font-bold">
                  delay = min(2<sup>n</sup> × 1000ms, 10000ms)
                </div>
              </div>

              {/* Bar Chart */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-muted tracking-widest">Backoff Progression</span>
                <div className="space-y-3">
                  {backoffData.map(item => (
                    <div key={item.n} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className={item.active ? 'text-amber font-bold' : 'text-muted'}>Attempt {item.n} (n={item.n})</span>
                        <span className={item.active ? 'text-amber font-bold' : 'text-muted'}>{item.ms}ms</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden border border-border">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.ms / 8000) * 100}%` }}
                          className={`h-full ${item.active ? 'bg-amber shadow-[0_0_10px_#ffaa00]' : 'bg-muted/20'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Snippet */}
            <div className="glass-card p-6 border-border/50">
              <h4 className="text-[10px] font-bold uppercase text-muted tracking-widest mb-4">Handling Terminal Failures</h4>
              <div className="bg-base rounded-xl p-4 font-mono text-xs border border-border">
                <pre className="text-violet leading-relaxed">
                  {`bridge.on('crash', (err) => { 
  // Permanently given up after 3 restarts
  console.error('Bridge failed:', err.message);
  Sentry.captureException(err);
});`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResilienceDemo;
