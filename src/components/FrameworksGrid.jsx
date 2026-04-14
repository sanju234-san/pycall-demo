import React from 'react';
import { motion } from 'framer-motion';
import { Layers, BrainCircuit, ScanEye, Cloud } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Core ML',
    icon: <Layers size={18} className="text-cyan" />,
    items: ['PyTorch', 'TensorFlow', 'JAX', 'scikit-learn', 'XGBoost', 'Pandas']
  },
  {
    name: 'GenAI',
    icon: <BrainCircuit size={18} className="text-violet" />,
    items: ['Transformers', 'LangChain', 'LlamaIndex', 'AutoGPT', 'Pinecone', 'Chromadb']
  },
  {
    name: 'Vision',
    icon: <ScanEye size={18} className="text-amber" />,
    items: ['Ultralytics (YOLO)', 'OpenCV', 'MediaPipe', 'Dlib', 'Tesseract', 'Diffusers']
  },
  {
    name: 'Providers',
    icon: <Cloud size={18} className="text-blue-400" />,
    items: ['OpenAI', 'Anthropic', 'HuggingFace', 'Google Gemini', 'AWS Bedrock', 'Mistral']
  }
];

const FrameworksGrid = () => {
  return (
    <section id="frameworks" className="py-32 bg-[#05050a]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl font-black mb-4">Native Interoperability</h2>
          <p className="text-muted">Works with every major Python intelligence framework</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3 mb-8">
                {cat.icon}
                <h3 className="font-black text-xs uppercase tracking-[0.2em]">{cat.name}</h3>
              </div>

              <div className="space-y-4">
                {cat.items.map((item) => (
                  <div key={item} className="flex items-center justify-between group cursor-default">
                    <span className="text-sm font-medium text-muted group-hover:text-primary transition-colors">{item}</span>
                    <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-cyan transition-colors" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-8 glass-card border-dashed border-white/10 text-center">
          <p className="text-muted text-sm font-medium">
            Don't see your framework? 
            <span className="text-white ml-2">As long as it's Python, it works.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FrameworksGrid;
