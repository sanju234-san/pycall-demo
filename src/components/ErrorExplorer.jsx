import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Terminal, ChevronDown } from 'lucide-react';

const ERRORS = {
  PyCallNodeError: {
    title: 'PyCallNodeError',
    desc: 'The base class for all library errors. Catch this for a catch-all safety net.',
    props: [
      { name: 'message', type: 'string', desc: 'Descriptive error message' }
    ],
    code: `try {
  await bridge.call('fn');
} catch (e) {
  if (e instanceof PyCallNodeError) {
    // Handle any bridge error
  }
}`
  },
  PyTimeoutError: {
    title: 'PyTimeoutError',
    desc: 'Thrown when a call() exceeds the specified timeoutMs duration.',
    props: [
      { name: 'timeoutMs', type: 'number', desc: 'The timeout limit that was hit' },
      { name: 'message', type: 'string', desc: 'Descriptive error message' }
    ],
    code: `try {
  await bridge.call('slow_fn', args, { timeoutMs: 1000 });
} catch (e) {
  if (e instanceof PyTimeoutError) {
    console.log(\`Timed out after \${e.timeoutMs}ms\`);
  }
}`
  },
  PyProcessError: {
    title: 'PyProcessError',
    desc: 'Thrown when the Python subprocess exits unexpectedly or fails to start.',
    props: [
      { name: 'exitCode', type: 'number | null', desc: 'The OS process exit code' },
      { name: 'stderr', type: 'string', desc: 'The last 100 lines of Python stderr' }
    ],
    code: `bridge.on('crash', (e) => {
  if (e instanceof PyProcessError) {
    console.error('Crash code:', e.exitCode);
    console.error('Stack:', e.stderr);
  }
});`
  },
  PyRuntimeError: {
    title: 'PyRuntimeError',
    desc: 'Thrown when an exception occurs inside your Python function.',
    props: [
      { name: 'pythonType', type: 'string', desc: 'The Python Exception class name (e.g. ValueError)' },
      { name: 'pythonTraceback', type: 'string', desc: 'The full Python stack trace' }
    ],
    code: `try {
  await bridge.call('buggy_fn');
} catch (e) {
  if (e instanceof PyRuntimeError) {
    console.log(e.pythonType); // "ZeroDivisionError"
    console.log(e.pythonTraceback);
  }
}`
  }
};

const ErrorExplorer = () => {
  const [selectedId, setSelectedId] = useState('PyRuntimeError');

  return (
    <section id="errors" className="py-24 bg-base">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Error Hierarchy</h2>
          <div className="w-24 h-1 bg-crimson mx-auto rounded-full" />
        </div>

        {/* Tree Visual */}
        <div className="max-w-4xl mx-auto mb-16 relative h-[250px] flex justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polyline points="450,80 450,120 180,120 180,160" fill="none" stroke="#1e1e3a" strokeWidth="2" />
            <line x1="450" y1="80" x2="450" y2="160" stroke="#1e1e3a" strokeWidth="2" />
            <polyline points="450,120 720,120 720,160" fill="none" stroke="#1e1e3a" strokeWidth="2" />
          </svg>

          {/* Root */}
          <ErrorNode
            data={ERRORS.PyCallNodeError}
            active={selectedId === 'PyCallNodeError'}
            onClick={() => setSelectedId('PyCallNodeError')}
            className="top-0 left-1/2 -translate-x-1/2"
            icon={<AlertTriangle size={18} />}
          />

          {/* Children */}
          <div className="absolute top-[170px] left-0 w-full flex justify-between px-12">
            <ErrorNode
              data={ERRORS.PyTimeoutError}
              active={selectedId === 'PyTimeoutError'}
              onClick={() => setSelectedId('PyTimeoutError')}
              icon={<Clock size={16} />}
            />
            <ErrorNode
              data={ERRORS.PyProcessError}
              active={selectedId === 'PyProcessError'}
              onClick={() => setSelectedId('PyProcessError')}
              icon={<Terminal size={16} />}
            />
            <ErrorNode
              data={ERRORS.PyRuntimeError}
              active={selectedId === 'PyRuntimeError'}
              onClick={() => setSelectedId('PyRuntimeError')}
              icon={<AlertTriangle size={16} />}
            />
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto glass-card border-crimson/20 bg-elevated/20 p-8 grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-crimson/10 text-crimson">
                  {selectedId.includes('Timeout') ? <Clock size={24} /> : selectedId.includes('Process') ? <Terminal size={24} /> : <AlertTriangle size={24} />}
                </div>
                <h3 className="text-2xl font-black">{ERRORS[selectedId].title}</h3>
              </div>
              <p className="text-muted mb-8 leading-relaxed">
                {ERRORS[selectedId].desc}
              </p>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Extra Properties</h4>
                <div className="space-y-3">
                  {ERRORS[selectedId].props.map(prop => (
                    <div key={prop.name} className="flex flex-col gap-1 p-3 rounded-lg bg-base/50 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-cyan">.{prop.name}</span>
                        <span className="text-[10px] text-muted font-mono">{prop.type}</span>
                      </div>
                      <span className="text-xs text-muted">{prop.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted">Usage Pattern</h4>
              <div className="bg-base rounded-xl p-6 font-mono text-xs overflow-x-auto border border-border leading-relaxed">
                <pre className="text-violet">
                  {ERRORS[selectedId].code}
                </pre>
              </div>
              
              {selectedId === 'PyRuntimeError' && (
                <div className="mt-4 p-4 rounded-lg bg-crimson/5 border border-crimson/10">
                  <span className="text-[10px] font-bold uppercase text-crimson/50 block mb-2">Simulated Traceback</span>
                  <div className="font-mono text-[10px] text-muted leading-tight">
                    Traceback (most recent call last):<br />
                    &nbsp;&nbsp;File "bridge_runner.py", line 42, in process_msg<br />
                    &nbsp;&nbsp;File "your_script.py", line 12, in train_model<br />
                    ValueError: Expected axis=1 to have shape 10, got 8
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const ErrorNode = ({ data, active, onClick, className = '', icon }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`glass-card px-6 py-4 flex items-center gap-3 transition-colors ${
        active 
          ? 'bg-crimson/10 border-crimson ring-4 ring-crimson/5' 
          : 'bg-elevated/50 border-border hover:border-crimson/50'
      } ${className}`}
    >
      <div className={`${active ? 'text-crimson' : 'text-muted'}`}>
        {icon}
      </div>
      <span className={`font-mono text-sm font-bold ${active ? 'text-primary' : 'text-muted'}`}>
        {data.title}
      </span>
    </motion.button>
  );
};

export default ErrorExplorer;
