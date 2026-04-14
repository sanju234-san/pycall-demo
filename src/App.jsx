import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import CallSimulator from './components/CallSimulator';
import FeatureExplorer from './components/FeatureExplorer';
import FrameworksGrid from './components/FrameworksGrid';
import BridgePoolDemo from './components/BridgePoolDemo';
import ResilienceDemo from './components/ResilienceDemo';
import LifecycleTimeline from './components/LifecycleTimeline';
import ErrorExplorer from './components/ErrorExplorer';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main>
        {/* Core Redesign Flow */}
        <HeroSection />
        <ArchitectureDiagram />
        <CallSimulator />
        <FeatureExplorer />
        <FrameworksGrid />
        
        {/* Advanced Demos & Deep Dives */}
        <div className="border-t border-white/5 bg-gradient-to-b from-black to-[#05050a] pt-32 pb-16 text-center">
          <h2 className="text-4xl font-black mb-4">Advanced Capabilities</h2>
          <p className="text-muted">Production-grade features for enterprise workloads</p>
        </div>
        
        <ResilienceDemo />
        <BridgePoolDemo />
        <LifecycleTimeline />
        <ErrorExplorer />
      </main>

      <Footer />
    </div>
  );
}

export default App;
