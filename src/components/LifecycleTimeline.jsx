import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Terminal, Play, Cpu, Trash2, Radio, CheckSquare } from 'lucide-react';

const NODES = [
  {
    id: 'spawn',
    label: 'spawn()',
    icon: <Power size={20} />,
    title: 'Process Spawning',
    desc: 'The bridge initiates a Python subprocess using child_process.spawn. Internal flags like -u are used for unbuffered stdio.',
    code: 'this.proc = spawn(this.pythonPath, [this.scriptPath], { stdio: ["pipe", "pipe", "pipe"] });',
    file: 'bridge.ts'
  },
  {
    id: 'stderr',
    label: 'stderr',
    icon: <Radio size={20} />,
    title: 'Listen for Errors',
    desc: 'The bridge immediately hooks into the stderr stream to capture any startup exceptions or crashes.',
    code: 'this.proc.stderr.on("data", (chunk) => this.handleStderr(chunk));',
    file: 'bridge.ts'
  },
  {
    id: 'stdout',
    label: 'stdout',
    icon: <Terminal size={20} />,
    title: 'Readline Interface',
    desc: 'A readline interface is created over stdout to parse incoming NDJSON messages line by line.',
    code: 'this.rl = createInterface({ input: this.proc.stdout });\nthis.rl.on("line", (line) => this.handleMessage(line));',
    file: 'bridge.ts'
  },
  {
    id: 'ready',
    label: '__ready__',
    icon: <CheckSquare size={20} />,
    title: 'Handshake',
    desc: 'The bridge waits for a special __ready__ signal from Python before allowing any call() triggers.',
    code: 'if (msg.status === "__ready__") this.resolveReady();',
    file: 'bridge.ts'
  },
  {
    id: 'call',
    label: 'call()',
    icon: <Play size={20} />,
    title: 'Initiate Call',
    desc: 'User triggers call(). A new UUID is generated and the request is written to stdin.',
    code: 'const id = uuidv4();\nthis.proc.stdin.write(JSON.stringify({ id, function, args }) + "\\n");',
    file: 'bridge.ts'
  },
  {
    id: 'resolve',
    label: 'resolve()',
    icon: <Cpu size={20} />,
    title: 'Resolve Promise',
    desc: 'Response arrives with matching ID. The corresponding Promise in the pending map is resolved.',
    code: 'const { resolve } = this.pending.get(msg.id);\nresolve(msg.result);',
    file: 'bridge.ts'
  },
  {
    id: 'destroy',
    label: 'destroy()',
    icon: <Trash2 size={20} />,
    title: 'Clean Shutdown',
    desc: 'The bridge sends a SIGTERM or kill signal, closes streams, and rejects any lingering pending calls.',
    code: 'this.proc.kill();\nthis.pending.forEach(p => p.reject(new PyProcessError("Bridge destroyed")));',
    file: 'bridge.ts'
  }
];

const LifecycleTimeline = () => {
  const [selectedId, setSelectedId] = useState('ready');

  return (
    <section id="lifecycle" className="py-24 bg-base relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold mb-4">Bridge Lifecycle</h2>
          <p className="text-muted">The internal journey from initialization to execution</p>
        </div>

        {/* Timeline Visual */}
        <div className="relative mb-32">
          {/* Animated Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2" />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-cyan via-violet to-amber -translate-y-1/2 shadow-[0_0_15px_rgba(0,229,255,0.5)]"
          />

          {/* Nodes */}
          <div className="relative flex justify-between items-center z-10">
            {NODES.map((node, i) => (
              <div key={node.id} className="relative flex flex-col items-center">
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.5 }}
                  onClick={() => setSelectedId(node.id)}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedId === node.id 
                      ? 'bg-elevated border-cyan text-cyan shadow-[0_0_20px_rgba(0,229,255,0.4)] scale-110' 
                      : 'bg-base border-border text-muted hover:border-cyan hover:text-cyan'
                  }`}
                >
                  {node.icon}
                </motion.button>
                <div className="absolute top-16 whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                  {node.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-10 bg-elevated/40 flex flex-col md:flex-row gap-12"
            >
              <div className="flex-1 space-y-6">
                <div>
                  <div className="text-xs font-bold text-cyan tracking-[0.2em] uppercase mb-2">Stage {NODES.findIndex(n => n.id === selectedId) + 1}</div>
                  <h3 className="text-3xl font-black">{NODES.find(n => n.id === selectedId).title}</h3>
                </div>
                <p className="text-muted leading-relaxed">
                  {NODES.find(n => n.id === selectedId).desc}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-muted bg-surface/50 w-fit px-3 py-1 rounded-md border border-border">
                  <Terminal size={12} /> {NODES.find(n => n.id === selectedId).file}
                </div>
              </div>

              <div className="flex-1">
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Internal Implementation</div>
                <div className="bg-base rounded-xl p-6 font-mono text-[11px] border border-border relative group overflow-x-auto">
                  <pre className="text-primary leading-relaxed">
                    {NODES.find(n => n.id === selectedId).code}
                  </pre>
                  <div className="absolute top-4 right-4 text-cyan/20 group-hover:text-cyan/50 transition-colors">
                    <Power size={40} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LifecycleTimeline;
