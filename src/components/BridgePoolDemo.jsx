import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, Settings2, Users, Terminal } from 'lucide-react';

const BridgePoolDemo = () => {
  const [workers, setWorkers] = useState([
    { id: 0, status: 'idle', count: 0, progress: 0 },
    { id: 1, status: 'idle', count: 0, progress: 0 },
    { id: 2, status: 'idle', count: 0, progress: 0 },
    { id: 3, status: 'idle', count: 0, progress: 0 },
  ]);
  const [queue, setQueue] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [nextWorkerIdx, setNextWorkerIdx] = useState(0);
  const queueRef = useRef([]);

  // Process queue
  useEffect(() => {
    const timer = setInterval(() => {
      if (queue.length > 0) {
        const freeWorkerIdx = workers.findIndex(w => w.status === 'idle');
        // Simple Round-Robin for display, but here we just pick the intended one
        const targetWorkerIdx = nextWorkerIdx % 4;
        
        if (workers[targetWorkerIdx].status === 'idle') {
          dispatchCall(targetWorkerIdx);
          setQueue(prev => prev.slice(1));
          setNextWorkerIdx(prev => prev + 1);
        }
      }
    }, 200 / speed);

    return () => clearInterval(timer);
  }, [queue, workers, speed, nextWorkerIdx]);

  const dispatchCall = (workerId) => {
    setWorkers(prev => prev.map(w =>
      w.id === workerId ? { ...w, status: 'busy', progress: 0 } : w
    ));

    let prog = 0;
    const duration = 2000 / speed;
    const interval = 50;
    const steps = duration / interval;
    const inc = 100 / steps;

    const progTimer = setInterval(() => {
      prog += inc;
      if (prog >= 100) {
        clearInterval(progTimer);
        setWorkers(prev => prev.map(w =>
          w.id === workerId ? { ...w, status: 'idle', progress: 0, count: w.count + 1 } : w
        ));
      } else {
        setWorkers(prev => prev.map(w =>
          w.id === workerId ? { ...w, progress: prog } : w
        ));
      }
    }, interval);
  };

  const addCall = () => {
    setQueue(prev => [...prev, { id: Math.random() }]);
  };

  const addBurst = () => {
    const burst = Array.from({ length: 8 }, () => ({ id: Math.random() }));
    setQueue(prev => [...prev, ...burst]);
  };

  return (
    <section id="pool" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Worker Pool — Parallel Execution</h2>
          <div className="w-24 h-1 bg-violet mx-auto rounded-full" />
        </div>

        {/* Visualizer Area */}
        <div className="max-w-5xl mx-auto glass-card p-12 bg-base/50 relative overflow-hidden">
          {/* Dispatcher Row */}
          <div className="flex flex-col items-center mb-16 relative">
            <div className="bg-elevated border-2 border-violet p-4 rounded-xl flex items-center gap-3 z-10 shadow-2xl">
              <Users className="text-violet" />
              <div className="flex flex-col">
                <span className="font-mono text-sm font-bold uppercase">BridgePool Dispatcher</span>
                <span className="text-[10px] text-muted">Round-Robin Scheduler</span>
              </div>
            </div>

            {/* Queue Visualization */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-muted tracking-widest">Incoming Queue</span>
              <div className="flex gap-2 h-8 items-center bg-surface/50 px-4 rounded-full border border-border">
                <AnimatePresence>
                  {queue.length === 0 && <span className="text-[10px] text-muted italic">Waiting for calls...</span>}
                  {queue.map((q, i) => (
                    <motion.div
                      key={q.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      className="w-3 h-3 rounded-full bg-cyan shadow-[0_0_8px_#00e5ff]"
                    />
                  )).slice(0, 10)}
                  {queue.length > 10 && <span className="text-[10px] text-primary">+{queue.length - 10}</span>}
                </AnimatePresence>
              </div>
            </div>

            {/* Connection Lines (SVG) */}
            <svg className="absolute top-[80px] w-full h-[60px] pointer-events-none opacity-20">
              <line x1="50%" y1="0" x2="12%" y2="60" stroke="#7c5cfc" strokeWidth="1" />
              <line x1="50%" y1="0" x2="38%" y2="60" stroke="#7c5cfc" strokeWidth="1" />
              <line x1="50%" y1="0" x2="62%" y2="60" stroke="#7c5cfc" strokeWidth="1" />
              <line x1="50%" y1="0" x2="88%" y2="60" stroke="#7c5cfc" strokeWidth="1" />
            </svg>
          </div>

          {/* Workers Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {workers.map((worker) => (
              <div key={worker.id} className={`glass-card p-6 flex flex-col items-center transition-all ${
                worker.status === 'busy' ? 'border-cyan shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'border-border'
              }`}>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Worker {worker.id}</div>
                
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 transition-all ${
                  worker.status === 'busy' ? 'bg-cyan/10 border-cyan animate-pulse' : 'bg-surface border-border'
                }`}>
                  <Terminal size={24} className={worker.status === 'busy' ? 'text-cyan' : 'text-muted'} />
                </div>

                <div className="w-full space-y-3">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className={worker.status === 'busy' ? 'text-cyan' : 'text-muted'}>
                      {worker.status.toUpperCase()}
                    </span>
                    <span className="text-primary">{worker.count} calls</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                    <motion.div
                      className="h-full bg-cyan"
                      animate={{ width: `${worker.progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-8 bg-elevated/50 p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={addCall}
              className="flex items-center gap-2 px-6 py-2 bg-cyan text-base font-bold rounded-lg hover:scale-105 transition-all glow-cyan"
            >
              <Plus size={18} /> Add Call
            </button>
            <button
              onClick={addBurst}
              className="flex items-center gap-2 px-6 py-2 bg-violet text-white font-bold rounded-lg hover:scale-105 transition-all shadow-[0_0_15px_rgba(124,92,252,0.3)]"
            >
              <Zap size={18} /> Burst: 8
            </button>
          </div>

          <div className="h-8 w-[1px] bg-border hidden md:block" />

          <div className="flex items-center gap-6">
            <Settings2 size={20} className="text-muted" />
            <div className="flex flex-col gap-1 w-32">
              <div className="flex justify-between text-[10px] font-bold uppercase text-muted">
                <span>Speed</span>
                <span className="text-cyan">{speed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BridgePoolDemo;
