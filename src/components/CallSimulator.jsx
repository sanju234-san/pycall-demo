import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Circle, CheckCircle2, AlertCircle } from 'lucide-react';

const FUNCTIONS = {
  predict: {
    args: { input: [1, 2, 3] },
    python: '@expose\ndef predict(data):\n    # Simulating inference...\n    return {"label": "cat", "confidence": 0.97}',
    response: { label: "cat", confidence: 0.97 }
  },
  detect: {
    args: { image_size: [1024, 768] },
    python: '@expose\ndef detect(image_size):\n    # Running object detection...\n    return {"objects": ["car", "person"], "count": 2}',
    response: { objects: ["car", "person"], count: 2 }
  },
  transform: {
    args: { text: "hello world", op: "uppercase" },
    python: '@expose\ndef transform(text, op):\n    if op == "uppercase":\n        return text.upper()\n    return text',
    response: "HELLO WORLD"
  }
};

const CallSimulator = () => {
  const [selectedFn, setSelectedFn] = useState('predict');
  const [argsText, setArgsText] = useState(JSON.stringify(FUNCTIONS.predict.args, null, 2));
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [step, setStep] = useState(0);
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState(null);

  const steps = [
    "Generate UUID",
    "Write to stdin",
    "Python executes",
    "Response arrives",
    "Promise resolves"
  ];

  const runCall = async () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setStep(1);
    setId('');
    setResult(null);
    setErrorText(null);

    // Step 1: Generate UUID
    const uuid = 'a3f7c2d1-' + Math.random().toString(16).substring(2, 6);
    for (let i = 0; i <= uuid.length; i++) {
      setId(uuid.substring(0, i));
      await new Promise(r => setTimeout(r, 20));
    }

    // Step 2: Write to stdin
    await new Promise(r => setTimeout(r, 400));
    setStep(2);

    // Step 3: Python executes
    await new Promise(r => setTimeout(r, 600));
    setStep(3);

    // Python panel logic
    await new Promise(r => setTimeout(r, 1200));

    if (simulateError) {
      setStep(4);
      setErrorText("PyRuntimeError: division by zero\n  File \"your_script.py\", line 4, in predict\n    return 1/0");
      setIsSimulating(false);
      return;
    }

    // Step 4: Response arrives
    setStep(4);
    await new Promise(r => setTimeout(r, 600));

    // Step 5: Promise resolves
    setStep(5);
    setResult(FUNCTIONS[selectedFn].response);
    setIsSimulating(false);
  };

  return (
    <section id="simulator" className="py-24 bg-surface/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Interactive Call Simulator</h2>
          <p className="text-muted">Watch a real <code className="text-cyan">bridge.call()</code> flow step by step</p>
        </div>

        {/* Step Indicator */}
        <div className="flex flex-wrap justify-between gap-4 mb-12 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 transition-all duration-300 ${
              step > i + 1 ? 'text-green-400' : step === i + 1 ? 'text-cyan scale-105' : 'text-muted'
            }`}>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                step > i + 1 ? 'bg-green-400/10 border-green-400' : step === i + 1 ? 'bg-cyan/10 border-cyan animate-pulse animate-glow' : 'border-border'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className="text-xs font-medium">{s}</span>
              {i < steps.length - 1 && <div className="hidden lg:block w-8 h-[1px] bg-border ml-2" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Node.js */}
          <div className={`glass-card overflow-hidden transition-colors duration-500 ${simulateError ? 'border-crimson/50' : 'border-cyan/50'}`}>
            <div className={`px-4 py-2 border-b flex items-center justify-between ${simulateError ? 'bg-crimson/10 border-crimson/20' : 'bg-cyan/10 border-cyan/20'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${simulateError ? 'bg-crimson' : 'bg-cyan'} animate-pulse`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Node.js Controller</span>
              </div>
              <Terminal size={14} className="text-muted" />
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Select Function</label>
                  <select
                    value={selectedFn}
                    onChange={(e) => {
                      setSelectedFn(e.target.value);
                      setArgsText(JSON.stringify(FUNCTIONS[e.target.value].args, null, 2));
                    }}
                    disabled={isSimulating}
                    className="bg-elevated border border-border rounded-lg px-3 py-1.5 text-sm font-mono w-40 focus:outline-none focus:border-cyan"
                  >
                    {Object.keys(FUNCTIONS).map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Simulation Mode</label>
                  <button
                    onClick={() => setSimulateError(!simulateError)}
                    disabled={isSimulating}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      simulateError ? 'bg-crimson/10 border-crimson text-crimson' : 'bg-elevated border-border text-muted hover:border-cyan'
                    }`}
                  >
                    {simulateError ? <AlertCircle size={14} /> : <Circle size={14} />}
                    {simulateError ? 'Simulate Error' : 'Normal Flow'}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Arguments (JSON)</label>
                <textarea
                  value={argsText}
                  onChange={(e) => setArgsText(e.target.value)}
                  disabled={isSimulating}
                  className="w-full h-24 bg-elevated border border-border rounded-lg p-3 font-mono text-xs focus:outline-none focus:border-cyan resize-none"
                />
              </div>

              <button
                onClick={runCall}
                disabled={isSimulating}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                  isSimulating ? 'bg-border text-muted cursor-not-allowed' : 'bg-cyan text-base glow-cyan hover:scale-[1.02]'
                }`}
              >
                {isSimulating ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
                {isSimulating ? 'Executing...' : 'Run Call'}
              </button>

              {/* Message Payload */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-muted tracking-widest">Request Payload</span>
                  <span className="text-[10px] font-mono text-cyan/50">stdin (NDJSON)</span>
                </div>
                <div className="bg-elevated/50 p-4 rounded-lg font-mono text-[11px] leading-relaxed whitespace-pre overflow-hidden">
                  <span className="text-violet">{"{"}</span>
                  <br />
                  &nbsp;&nbsp;<span className="text-amber">"id"</span>: <span className="text-cyan">"{id || '...'}"</span>,
                  <br />
                  &nbsp;&nbsp;<span className="text-amber">"function"</span>: <span className="text-cyan">"{selectedFn}"</span>,
                  <br />
                  &nbsp;&nbsp;<span className="text-amber">"args"</span>: {argsText.split('\n').join('\n  ')},
                  <br />
                  &nbsp;&nbsp;<span className="text-amber">"kwargs"</span>: <span className="text-violet">{"{}"}</span>
                  <br />
                  <span className="text-violet">{"}"}</span>
                </div>
              </div>

              {/* Resolved Result */}
              <AnimatePresence>
                {step === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30 font-mono text-xs"
                  >
                    <div className="text-green-400 font-bold mb-1 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Promise Resolved:
                    </div>
                    {JSON.stringify(result, null, 2)}
                  </motion.div>
                )}
                {errorText && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-lg bg-crimson/10 border border-crimson/30 font-mono text-xs"
                  >
                    <div className="text-crimson font-bold mb-1 flex items-center gap-2">
                      <AlertCircle size={14} /> Exception Caught:
                    </div>
                    {errorText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel: Python */}
          <div className="glass-card border-amber/50 overflow-hidden min-h-[500px]">
            <div className="px-4 py-2 bg-amber/10 border-b border-amber/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-amber ${step === 3 ? 'animate-ping' : ''}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber">Python Runtime</span>
              </div>
              <span className="text-[10px] font-mono text-amber/50">stdout (NDJSON)</span>
            </div>

            <div className="p-6 font-mono text-sm h-full">
              <div className="space-y-4">
                <div className="text-muted">
                  <span className="text-cyan">@expose</span>
                  <br />
                  <span className="text-violet">def</span> <span className="text-amber">{selectedFn}</span>(data):
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-muted inline-block min-w-[200px]">
                    # Simulating process...
                    {step === 3 && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="inline-block w-2 h-4 bg-cyan ml-1" />}
                  </span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-violet">return</span> {JSON.stringify(FUNCTIONS[selectedFn].response)}
                </div>

                <div className="mt-12 pt-12 border-t border-border/50">
                  <div className="text-[10px] font-bold uppercase text-muted tracking-widest mb-4">Runtime Output</div>
                  <div className="bg-base rounded-lg p-4 font-mono text-[11px] leading-6 min-h-[150px]">
                    <div className="text-muted mb-2">$ python bridge_runner.py</div>
                    {step >= 2 && <div className="text-green-500/80 tracking-tighter">[{new Date().toLocaleTimeString()}] RECEIVED CALL: {selectedFn} id={id}</div>}
                    {step === 3 && <div className="text-amber animate-pulse">Running inference...</div>}
                    {step === 4 && simulateError && (
                      <div className="text-crimson">
                        ERROR: division by zero
                        <br />
                        Traceback (most recent call last):
                        <br />
                        &nbsp;&nbsp;File "your_script.py", line 4, in {selectedFn}
                      </div>
                    )}
                    {step >= 4 && !simulateError && (
                      <div className="text-green-500/80">
                        {`{"id": "${id}", "status": "ok", "result": ${JSON.stringify(FUNCTIONS[selectedFn].response)}}`}
                        <br />
                        [DONE]
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RefreshCw = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default CallSimulator;
