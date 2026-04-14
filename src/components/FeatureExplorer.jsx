import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Brain, Activity, Database, Layers, Eye, 
  Sparkles, Play, Terminal, CheckCircle2, ChevronRight
} from 'lucide-react';

const FEATURES = [
  {
    id: 'core',
    icon: <Cpu size={18} />,
    name: 'Core Bridge',
    title: 'Core Bridge API',
    subtitle: 'Ultra-low latency NDJSON communication',
    desc: 'The fundamental layer optimized for speed and safety. Direct memory-efficient calls between Node.js and Python processes.',
    capabilities: [
      { name: 'call()', desc: 'Atomic execution' },
      { name: 'start()', desc: 'Lifecycle management' },
      { name: 'stop()', desc: 'Graceful shutdown' }
    ],
    code: `// Initialize the bridge
const bridge = new PyBridge({
  autoInstall: true,
  pythonPath: 'python3'
});

// Await execution
const result = await bridge.call('module.fn', {
  payload: { x: 10, y: 20 }
});`
  },
  {
    id: 'inference',
    icon: <Brain size={18} />,
    name: 'Model Inference',
    title: 'Model Inference',
    subtitle: 'sklearn · torch · tensorflow · yolov8 · transformers',
    desc: 'Native support for all major ML frameworks. Pass a model path, framework name, and input — PyBridge handles loading, inference, and serialisation automatically.',
    frameworks: ['sklearn', 'torch', 'tensorflow', 'onnxruntime', 'xgboost', 'transformers', 'catboost'],
    code: `// scikit-learn
const skResult = await py.inference.predict({
  modelPath: './model.pkl',
  framework: 'sklearn',
  input: [[5.1, 3.5, 1.4, 0.2]]
});

// PyTorch
const torchResult = await py.inference.predict({
  modelPath: './resnet.pt',
  framework: 'torch',
  input: './image.jpg'
});

// HuggingFace Transformers
const sentiment = await py.inference.predict({
  framework: 'transformers',
  task: 'sentiment-analysis',
  input: 'I love this library!'
});`
  },
  {
    id: 'streaming',
    icon: <Activity size={18} />,
    name: 'Streaming Output',
    title: 'Streaming Output',
    subtitle: 'LLM token streaming via AsyncIterator & EventEmitter',
    desc: 'Perfect for Computer Vision or LLM inference — stream tokens or detections as they are generated. Supports both for-await-of AsyncIterator and EventEmitter patterns.',
    isInteractive: true,
    code: `// CV Stream pattern (for-await-of)
const stream = await py.vision.streamDetect({
  framework: 'yolov8',
  source: './video.mp4',
  confidence: 0.5
});

for await (const detection of stream) {
  process.stdout.write(JSON.stringify(detection));
}

// EventEmitter pattern
stream.on('token', d => console.log('Detected:', d.label));
stream.on('end', () => console.log('\\n[done]'));`
  },
  {
    id: 'rag',
    icon: <Database size={18} />,
    name: 'RAG Pipeline',
    title: 'RAG Pipeline',
    subtitle: 'LangChain · LlamaIndex · Chroma · FAISS',
    desc: 'Bridge directly into LangChain or LlamaIndex RAG pipelines. Query vector stores, stream answers, and chain LLM calls — all from Node.js.',
    backends: ['langchain-chroma', 'langchain-faiss', 'llamaindex-chroma', 'llamaindex-qdrant'],
    code: `// Query a Chroma RAG pipeline
const answer = await py.rag.query({
  backend: 'langchain-chroma',
  vectorStorePath: './chroma_db',
  embeddingModel: 'sentence-transformers/all-MiniLM-L6-v2',
  llm: 'ollama/llama3',
  query: 'What is the attention mechanism?'
});

// Stream RAG answer token-by-token
const stream = py.rag.stream({
  backend: 'langchain-chroma',
  query: 'Summarize the document'
});`
  },
  {
    id: 'embeddings',
    icon: <Layers size={18} />,
    name: 'Embeddings',
    title: 'Embeddings Bridge',
    subtitle: 'High-speed vectorization of text and images',
    desc: 'Generate dense vector embeddings using specialized local models. Optimized for batch processing and vector store ingestion.',
    list: [
      { name: 'embed_text()', desc: 'Transformer-based text vectors' },
      { name: 'embed_image()', desc: 'CLIP/ViT-based visual vectors' },
      { name: 'batch_embed()', desc: 'Parallel execution engine' }
    ],
    code: `// Generate text embeddings
const vectors = await py.embed.text({
  model: 'all-MiniLM-L6-v2',
  input: ["Node.js bridge", "Python interop"]
});

// Generate image embeddings
const imgVectors = await py.embed.image({
  model: 'clip-vit-base-patch32',
  input: ['./img1.jpg', './img2.jpg']
});`
  },
  {
    id: 'vision',
    icon: <Eye size={18} />,
    name: 'Vision Bridge',
    title: 'Vision Bridge',
    subtitle: 'YOLOv8 · Transformers · EasyOCR · DeepFace · SAM2',
    desc: 'Object detection, OCR, face recognition, and segmentation — all from Node.js. Pass image paths or URLs directly.',
    capabilities: [
      { id: 'detect()', framework: 'YOLOv8', desc: 'object detection' },
      { id: 'ocr()', framework: 'EasyOCR', desc: 'text extraction' },
      { id: 'faceAnalysis()', framework: 'DeepFace', desc: 'age/gender/emotion' },
      { id: 'segment()', framework: 'SAM2', desc: 'image segmentation' }
    ],
    code: `// Object detection — YOLOv8
const detections = await py.vision.detect({
  framework: 'yolov8',
  modelPath: './yolov8n.pt',
  image: './scene.jpg'
});
// [{ label: 'cat', confidence: 0.98, bbox: [x,y,w,h] }]

// OCR
const text = await py.vision.ocr({
  image: './invoice.png',
  languages: ['en']
});

// Face recognition — DeepFace
const face = await py.vision.faceAnalysis({
  framework: 'deepface',
  image: './portrait.jpg',
  actions: ['age', 'gender', 'emotion']
});`
  }
];

const FeatureExplorer = () => {
  const [activeTab, setActiveTab] = useState('vision');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamData, setStreamData] = useState([]);
  
  const activeFeature = FEATURES.find(f => f.id === activeTab);

  useEffect(() => {
    let interval;
    if (isStreaming) {
      const detections = [
        '{"id": 1, "label": "person", "conf": 0.98, "box": [120, 45, 80, 200]}',
        '{"id": 2, "label": "dog", "conf": 0.92, "box": [340, 180, 50, 40]}',
        '{"id": 3, "label": "car", "conf": 0.88, "box": [10, 220, 120, 80]}',
        '{"id": 4, "label": "bicycle", "conf": 0.76, "box": [450, 150, 60, 100]}',
        'Done: All frames processed.'
      ];
      let i = 0;
      interval = setInterval(() => {
        if (i < detections.length) {
          setStreamData(prev => [...prev, detections[i]]);
          i++;
        } else {
          setIsStreaming(false);
        }
      }, 800);
    } else {
      setStreamData([]);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <section id="features" className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono text-cyan uppercase tracking-widest mb-4 block">Interactive Demo</span>
          <h2 className="text-5xl font-black mb-6 text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">Feature Explorer</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium">
            Explore all 6 feature tiers. Click a feature to see the real API, code, and a live demo trace.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {FEATURES.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all text-sm font-bold tracking-tight ${
                activeTab === f.id 
                  ? 'border-cyan bg-cyan/10 text-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                  : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              {f.icon}
              {f.name}
            </button>
          ))}
        </div>

        {/* Feature Display */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Description & Interactive */}
          <motion.div
            key={`left-${activeTab}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 min-h-[500px]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center text-cyan">
                {activeFeature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">{activeFeature.title}</h3>
                <p className="text-[10px] font-mono text-cyan uppercase tracking-widest">{activeFeature.subtitle}</p>
              </div>
            </div>

            <p className="text-gray-400 mb-8 leading-relaxed font-medium">
              {activeFeature.desc}
            </p>

            {/* Feature Specific Content */}
            {activeTab === 'vision' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-4">Vision capabilities:</span>
                {activeFeature.capabilities.map(cap => (
                  <div key={cap.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-mono text-sm text-pink-500 font-bold">{cap.id}</span>
                    <span className="text-xs text-gray-500"><span className="text-gray-300 font-bold">{cap.framework}</span> · {cap.desc}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'inference' && (
              <div className="space-y-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Supported frameworks:</span>
                <div className="flex flex-wrap gap-2">
                  {activeFeature.frameworks.map(fw => (
                    <span key={fw} className="px-3 py-1 rounded-md bg-amber/5 border border-amber/20 text-[11px] font-bold text-amber capitalize">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rag' && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Supported backends:</span>
                {activeFeature.backends.map(be => (
                  <div key={be} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-mono">{be}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'streaming' && (
              <div className="space-y-6">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Token stream output:</span>
                <div className="h-40 rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-xs overflow-y-auto">
                  {streamData.length === 0 ? (
                    <span className="text-gray-700 italic">waiting for stream...</span>
                  ) : (
                    streamData.map((line, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        <span className="text-green-500 mr-2">›</span>
                        <span className={line.startsWith('Done') ? 'text-cyan font-bold' : 'text-gray-300'}>{line}</span>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="w-full py-4 rounded-xl bg-cyan/10 border border-cyan/30 text-white font-bold flex items-center justify-center gap-2 hover:bg-cyan/20 transition-all"
                >
                  <Play size={16} fill="white" />
                  {isStreaming ? 'Stop Simulation' : 'Start Stream'}
                </button>
              </div>
            )}

            {/* Fallback for Core/Embeddings */}
            {(activeTab === 'core' || activeTab === 'embeddings') && (
              <div className="space-y-3">
                {(activeFeature.capabilities || activeFeature.list).map(item => (
                  <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-mono text-sm text-cyan font-bold">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Code Block */}
          <motion.div
            key={`right-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-[#0d0d14] border border-white/10 overflow-hidden shadow-2xl overflow-x-auto min-h-[500px]"
          >
            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="text-[11px] text-gray-500 font-mono ml-4 flex items-center gap-2">
                  <Terminal size={12} />
                  node.js (pycall-node)
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-700 font-mono border border-gray-800 px-2 py-0.5 rounded uppercase">v1.1.0</span>
            </div>
            <div className="p-8 font-mono text-[13px] leading-relaxed whitespace-pre text-gray-300 overflow-x-auto">
              <CodeRenderer code={activeFeature.code} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Extremely simple highlighting helper to match visual style
const CodeRenderer = ({ code }) => {
  const parts = code.split(/(\n|'[^']*'|\/\/.*|\{.*\})/);
  return (
    <code>
      {parts.map((part, i) => {
        if (part.startsWith('//')) return <span key={i} className="text-gray-500">{part}</span>;
        if (part.startsWith("'")) return <span key={i} className="text-amber">{part}</span>;
        if (part.includes('const') || part.includes('await') || part.includes('new') || part.includes('for')) 
          return <span key={i} className="text-pink-500">{part}</span>;
        if (part.includes('py.') || part.includes('bridge.'))
          return <span key={i}><span className="text-cyan">{part.split('.')[0]}.</span><span className="text-blue-400">{part.split('.')[1]}</span></span>;
        return <span key={i}>{part}</span>;
      })}
    </code>
  );
};

export default FeatureExplorer;
