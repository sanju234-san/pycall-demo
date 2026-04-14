import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-black grid-bg flex flex-col items-center">
      {/* Centered Overlay Gradient */}
      <div className="absolute inset-0 bg-radial-at-t from-cyan/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Version Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-6 py-1.5 rounded-full border border-cyan/30 bg-cyan/5 text-[11px] font-mono font-bold text-cyan tracking-wider uppercase flex items-center gap-2"
        >
          v1.1.0 — npm install pycall-node
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-7xl md:text-9xl font-black tracking-tighter mb-6 flex flex-wrap justify-center items-center"
        >
          <span className="text-cyan drop-shadow-[0_0_25px_rgba(0,229,255,0.4)]">pycall</span>
          <span className="text-white mx-1">-</span>
          <span className="text-amber drop-shadow-[0_0_25px_rgba(255,170,0,0.4)]">node</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl text-gray-300 font-medium max-w-4xl mb-6"
        >
          Call Python <span className="text-cyan font-bold">ML/AI functions</span> from Node.js as <span className="text-amber font-bold">native async functions</span>.
        </motion.p>

        {/* Tags */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 text-sm font-mono text-gray-500 mb-20"
        >
          <span>sklearn</span>
          <span className="text-gray-700">·</span>
          <span>torch</span>
          <span className="text-gray-700">·</span>
          <span>transformers</span>
          <span className="text-gray-700">·</span>
          <span>YOLOv8</span>
          <span className="text-gray-700">·</span>
          <span>LangChain</span>
          <span className="text-gray-700">·</span>
          <span>embeddings</span>
        </motion.div>

        {/* Bridge Visualizer */}
        <div className="relative w-full max-w-3xl flex items-center justify-between mb-24 px-10">
          {/* Node.js Block */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-2xl border-2 border-green-500/50 bg-green-500/10 flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(34,197,94,0.1)] group transition-all"
          >
            <div className="text-4xl font-black text-green-500">N</div>
            <div className="text-[10px] font-bold text-green-500/70 tracking-tighter">Node.js</div>
          </motion.div>

          {/* Bridge Line */}
          <div className="flex-1 relative mx-4">
            <div className="w-full h-[1px] border-t-2 border-dashed border-gray-800 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 py-1 text-[10px] font-mono text-gray-400 border border-white/5 rounded-md flex items-center gap-2">
                NDJSON over stdio
              </div>
              {/* Moving Data Packets */}
              <motion.div 
                animate={{ x: [0, 200] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute top-[-4px] w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_#00e5ff]"
              />
              <motion.div 
                animate={{ x: [0, 200] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1.5 }}
                className="absolute top-[-4px] w-2 h-2 rounded-full bg-amber shadow-[0_0_10px_#ffaa00]"
              />
            </div>
          </div>

          {/* Python Block */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-24 h-24 rounded-2xl border-2 border-amber/50 bg-amber/10 flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(255,170,0,0.1)] group transition-all"
          >
            <div className="text-4xl font-black text-amber">Py</div>
            <div className="text-[10px] font-bold text-amber/70 tracking-tighter">Python</div>
          </motion.div>
        </div>

        {/* Code Block Window */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-2xl bg-[#0d0d14] rounded-xl border border-white/10 overflow-hidden shadow-2xl text-left"
        >
          <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            <span className="text-[10px] text-gray-500 font-mono ml-4">typescript</span>
          </div>
          <div className="p-8 font-mono text-xs md:text-sm leading-relaxed whitespace-pre">
            <span className="text-pink-500 italic">const</span> {'{ PyBridge } = '} 
            <span className="text-blue-400">require</span>(<span className="text-green-400">'pycall-node'</span>);<br /><br />
            <span className="text-pink-500 italic">const</span> py = <span className="text-pink-500 italic">new</span> <span className="text-blue-400">PyBridge</span>({`{ autoInstall: true }`});<br />
            <span className="text-pink-500 italic">await</span> py.<span className="text-blue-400">start</span>();<br /><br />
            <span className="text-gray-500">// sklearn inference</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
