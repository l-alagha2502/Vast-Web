/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence, useVelocity, useAnimationFrame, useMotionValue } from "motion/react";
import { ArrowUpRight, Users, Target, Zap, Globe, Menu, X, ChevronRight, Sparkles, Instagram, Youtube, Linkedin, MessageSquare, Phone, Layers, Activity, Cpu, Shield, Mail, MapPin, Send, Terminal, Command, Eye, Box, Code, Palette } from "lucide-react";
import * as React from "react";
import { useState, useRef, useEffect, useMemo, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera, Text, Environment, ContactShadows, PresentationControls, Float as DreiFloat, Image } from "@react-three/drei";
import { ReactLenis } from '@studio-freight/react-lenis';
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from "three";

// --- Context & State ---
const GlobalStateContext = React.createContext<{
  isGlitchActive: boolean;
  setIsGlitchActive: React.Dispatch<React.SetStateAction<boolean>>;
  showTerminal: boolean;
  setShowTerminal: React.Dispatch<React.SetStateAction<boolean>>;
  terminalLogs: string[];
  setTerminalLogs: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  isGlitchActive: false,
  setIsGlitchActive: () => {},
  showTerminal: false,
  setShowTerminal: () => {},
  terminalLogs: [],
  setTerminalLogs: () => {},
});

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["VAST_OS v4.2.0", "Type 'help' for commands..."]);

  return (
    <GlobalStateContext.Provider value={{ isGlitchActive, setIsGlitchActive, showTerminal, setShowTerminal, terminalLogs, setTerminalLogs }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const VastTerminal = () => {
  const { showTerminal, setShowTerminal, terminalLogs, setTerminalLogs, isGlitchActive, setIsGlitchActive } = React.useContext(GlobalStateContext);
  const [terminalInput, setTerminalInput] = useState("");

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.toLowerCase().trim();
    let response = "";

    switch(cmd) {
      case 'help': response = "Available: help, clear, glitch, about, exit, status, vision"; break;
      case 'clear': setTerminalLogs([]); setTerminalInput(""); return;
      case 'glitch': setIsGlitchActive(!isGlitchActive); response = `Glitch mode: ${!isGlitchActive ? 'ON' : 'OFF'}`; break;
      case 'about': response = "VAST: A collective of visionaries bypassing traditional gatekeepers."; break;
      case 'status': response = "All systems operational. VAST_CORE at 98% capacity."; break;
      case 'vision': response = "VAST_VISION filter toggled."; break;
      case 'exit': setShowTerminal(false); return;
      default: response = `Command not found: ${cmd}`;
    }

    setTerminalLogs(prev => [...prev, `> ${cmd}`, response]);
    setTerminalInput("");
  };

  if (!showTerminal) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    >
      <div className="w-full max-w-2xl bg-vast-black border border-white/10 p-6 font-mono text-sm shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-bottom border-white/10 pb-2">
          <span className="text-vast-accent uppercase tracking-widest text-[10px]">Vast_Terminal.exe</span>
          <button onClick={() => setShowTerminal(false)} className="hover:text-vast-accent transition-colors"><X size={14} /></button>
        </div>
        <div className="h-64 overflow-y-auto mb-4 custom-scrollbar flex flex-col gap-1">
          {terminalLogs.map((log, i) => (
            <div key={i} className={log.startsWith('>') ? 'text-white/50' : 'text-vast-accent'}>{log}</div>
          ))}
        </div>
        <form onSubmit={handleTerminalSubmit} className="flex gap-2">
          <span className="text-vast-accent">{">"}</span>
          <input 
            autoFocus
            type="text" 
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white"
            placeholder="Type command..."
          />
        </form>
      </div>
    </motion.div>
  );
};

// --- Types ---
interface EcosystemItem {
  title: string;
  tag: string;
  desc: string;
  img: string;
  icon: React.ReactNode;
}

// --- Components ---

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const systemLogs = [
    "INITIALIZING_VAST_CORE...",
    "LOADING_NEURAL_NETWORK...",
    "ESTABLISHING_VAST_CONNECTION...",
    "SYNCING_COLLECTIVE_NODES...",
    "BYPASSING_TRADITIONAL_GATEKEEPERS...",
    "UNLEASHING_POTENTIAL...",
    "SYSTEM_READY."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < systemLogs.length) {
        setLogs(prev => [...prev, systemLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onComplete, 1000);
    }
  }, [progress, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        clipPath: "inset(0 0 100% 0)",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[200] bg-vast-black flex flex-col items-center justify-center overflow-hidden p-6"
    >
      <div className="absolute inset-0 noise opacity-10 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex justify-between items-end mb-4 font-mono text-[10px] tracking-widest text-vast-accent">
          <div className="flex flex-col gap-1">
            {logs.map((log, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {">"} {log}
              </motion.span>
            ))}
          </div>
          <span className="text-4xl font-display italic">{progress}%</span>
        </div>
        
        <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
          <motion.div 
            className="h-full bg-vast-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-12 flex justify-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border border-vast-accent/20 rounded-full flex items-center justify-center"
          >
            <VastLogo className="w-40 h-40 text-vast-accent" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 font-mono text-[10px] opacity-20 uppercase tracking-[0.5em]">
        VAST_OS_BOOT_SEQUENCE_V4.2
      </div>
    </motion.div>
  );
};

const VastLogo = ({ className = "w-12 h-12", variant = "white" }: { className?: string; variant?: "white" | "black" }) => (
  <img 
    src={variant === "white" ? "/Untitled.svg" : "/Vast Logo - Logo Only - Black3.png"} 
    alt="Vast Logo" 
    className={`${className} object-contain`}
    referrerPolicy="no-referrer"
    onError={(e) => {
      // Fallback to text if image fails to load
      const target = e.target as HTMLImageElement;
      target.style.display = 'none';
      const parent = target.parentElement;
      if (parent) {
        const span = document.createElement('span');
        span.className = "font-display text-lg tracking-tighter uppercase";
        span.innerText = "Vast™";
        parent.appendChild(span);
      }
    }}
  />
);

const MagneticButton = ({ children, className, onClick }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", damping: 15, stiffness: 150, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const RevealText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const words = text.split(" ");
  
  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.25em]">
          <motion.span
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: delay + i * 0.05, ease: [0.33, 1, 0.68, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, .interactive')) setIsHovering(true);
      else setIsHovering(false);
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 w-4 h-4 bg-vast-accent rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        animate={{ 
          x: mousePos.x - 8, 
          y: mousePos.y - 8, 
          scale: isClicking ? 0.8 : (isHovering ? 4 : 1),
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.2 }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-12 h-12 border border-vast-accent/30 rounded-full pointer-events-none z-[9998] hidden md:block"
        animate={{ 
          x: mousePos.x - 24, 
          y: mousePos.y - 24, 
          scale: isClicking ? 1.2 : (isHovering ? 1.5 : 1),
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200, mass: 0.5 }}
      />
    </>
  );
};

const StudioLabel = ({ text, side = "left" }: { text: string; side?: "left" | "right" }) => (
  <div className={`fixed top-1/2 -translate-y-1/2 z-50 hidden xl:block ${side === "left" ? "left-10" : "right-10"}`}>
    <div className={`flex items-center gap-4 ${side === "right" ? "flex-row-reverse" : ""}`}>
      <div className="w-8 h-[1px] bg-white/20" />
      <span className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30 whitespace-nowrap rotate-90 origin-center">
        {text}
      </span>
    </div>
  </div>
);

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[9997] noise opacity-[0.03]" />
);

const GlitchOverlay = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.98) {
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 50);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none mix-blend-difference bg-vast-accent/5 opacity-30" />
  );
};

const Scene3D = () => {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[-3, 2, -5]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0} metalness={1} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[4, -2, -8]}>
          <icosahedronGeometry args={[2, 0]} />
          <MeshDistortMaterial color="var(--color-vast-accent)" speed={2} distort={0.3} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, -12]}>
          <torusGeometry args={[8, 0.02, 16, 100]} />
          <meshStandardMaterial color="var(--color-vast-accent)" emissive="var(--color-vast-accent)" emissiveIntensity={1} />
        </mesh>
      </Float>
      <Environment preset="night" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <Noise opacity={0.05} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </group>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { setIsGlitchActive, isGlitchActive } = React.useContext(GlobalStateContext);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = (e: React.MouseEvent) => {
    // We don't prevent default here to allow navigation, but we track clicks
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 5) {
      setIsGlitchActive(!isGlitchActive);
      setLogoClicks(0);
      console.log("%c VAST GLITCH MODE: " + (!isGlitchActive ? "ENABLED" : "DISABLED"), "color: #00FF66; font-weight: bold; font-size: 20px;");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-4 flex justify-between items-center pointer-events-none">
        <div className="flex-1 flex justify-start items-center pointer-events-auto">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-3 group">
            <VastLogo className="h-16 w-auto group-hover:scale-110 transition-transform duration-700" />
            <span className="font-display text-xl md:text-2xl tracking-tighter uppercase text-vast-paper group-hover:text-vast-accent transition-colors duration-500">
              Vast™
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center pointer-events-auto">
          <button 
            className="p-4 glass rounded-full hover:bg-vast-accent hover:text-vast-black transition-all duration-500 group relative overflow-hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative z-10">
              {isOpen ? <X size={20} /> : <Menu size={20} className="group-hover:rotate-90 transition-transform duration-500" />}
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-vast-black z-[90] flex flex-col justify-center items-center p-12 overflow-hidden"
          >
            <div className="absolute inset-0 noise opacity-5 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center gap-16">
              {['Home', 'Manifesto', 'Ecosystem', 'Vast'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link 
                    to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="text-5xl md:text-[8vw] font-display uppercase tracking-tight hover:text-vast-accent transition-all duration-500 relative group"
                  >
                    <span className="relative z-10">{item}</span>
                    <span className="absolute inset-0 text-outline opacity-20 group-hover:opacity-100 transition-opacity translate-x-2 translate-y-2">{item}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-12 flex gap-12 text-vast-accent font-mono text-xs tracking-widest">
              <a href="#" className="hover:line-through transition-all">INSTAGRAM</a>
              <a href="#" className="hover:line-through transition-all">DISCORD</a>
              <a href="#" className="hover:line-through transition-all">YOUTUBE</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Sections ---

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col justify-center px-6 md:px-24 overflow-hidden bg-vast-black">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vast-dim via-vast-black to-vast-black" />
      
      <motion.div style={{ y, opacity, scale }} className="z-10 relative flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-vast-accent px-4 py-2 border border-vast-accent/20">
            EST. 2026
          </span>
        </motion.div>
        
        <h1 className="text-[12vw] md:text-[10vw] font-display leading-[0.85] uppercase tracking-tighter mb-12 select-none relative">
          <motion.span 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="block text-vast-paper"
          >
            UNLEASH
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="block text-vast-accent italic"
          >
            POTENTIAL.
          </motion.span>
        </h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <p className="text-lg md:text-xl text-vast-paper/70 font-sans font-light leading-relaxed tracking-wide mb-16">
            The world doesn't need more potential. It needs more work. Join the community built for the most ambitious teens.
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center">
            <MagneticButton className="px-10 py-5 bg-vast-accent text-vast-black rounded-none font-sans font-semibold text-sm uppercase tracking-widest hover:bg-white transition-colors duration-500" onClick={() => window.open("https://discord.gg/CcEFeHw9MN", "_blank", "noopener,noreferrer")}>
              JOIN THE COMMUNITY
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>

      {/* 3D Background Scene */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-20">
        <div className="flex flex-col gap-2 font-mono text-[10px] opacity-30">
          <span>LAT: 25.3271° N</span>
          <span>LNG: 51.1967° E</span>
        </div>
        <div className="flex flex-col items-end gap-2 font-mono text-[10px] opacity-30">
          <span>VAST_CORE_V4.2</span>
          <span>STATUS: ONLINE</span>
        </div>
      </div>
    </section>
  );
};

const MissionSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5], [180, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-vast-paper text-vast-black py-80 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-dot opacity-5 pointer-events-none" />
      
      <motion.div style={{ rotateX: rotate, scale, opacity }} className="relative z-10 w-full max-w-screen-2xl">
        <div className="flex flex-col items-center text-center mb-32">
          <VastLogo className="h-12 w-auto mb-8 opacity-40" variant="black" />
          <RevealText 
            text="Vast Awaits." 
            className="text-6xl md:text-[12vw] font-display leading-[0.9] tracking-tight uppercase mb-16 justify-center" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
          <div className="relative aspect-square bg-vast-black rounded-3xl overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/mission/1200/1200" 
              alt="Mission" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <VastLogo className="w-64 h-64 text-vast-accent opacity-20 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          </div>
          
          <div className="flex flex-col gap-12">
            <p className="text-3xl md:text-5xl font-display leading-tight tracking-tight italic">
              "Potential is common. Investment is rare. Stop saving your talent for a future that isn't coming without it"
            </p>
            <div className="h-[1px] w-full bg-vast-black/10" />
            <div className="grid grid-cols-2 gap-8 font-space">
              <div>
                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">Focus</span>
                <p className="text-lg font-medium">Youth, Potential, Summit, Ambition</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest opacity-40 block mb-2">COMMUNITY</span>
                <p className="text-lg font-medium">Outliers, Builders, Frontiers</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D MISSION Header that spins */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <Suspense fallback={null}>
            <MissionHeader3D progress={scrollYProgress} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

const MissionHeader3D = ({ progress }: { progress: any }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const p = progress.get();
    meshRef.current.rotation.x = Math.PI * (1 - p * 2);
    meshRef.current.position.y = 5 - p * 10;
  });

  return (
    <group ref={meshRef}>
      <Text
        fontSize={4}
        color="#050505"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/syne/v12/8vIb7wUr0m_6iW0.woff"
      >
        MISSION
      </Text>
    </group>
  );
};

const EcosystemSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const items: EcosystemItem[] = [
    {
      title: "MAKE SOMETHING",
      tag: "Incubation",
      desc: "We give you the resources. You give yourself the work. No more waiting for \"later\".",
      img: "https://picsum.photos/seed/youth-coding-together/800/800",
      icon: <Cpu size={32} />
    },
    {
      title: "NETWORK",
      tag: "Network",
      desc: "Most youth just waste their life away, find the ones who aren't, and be one of them.",
      img: "https://picsum.photos/seed/diverse-teens-talking/400/400",
      icon: <Globe size={24} />
    },
    {
      title: "TRY THINGS",
      tag: "Research",
      desc: "We don't have the answers to all the questions, we search for them.",
      img: "https://picsum.photos/seed/creative-workshop/400/400",
      icon: <Shield size={24} />
    },
    {
      title: "MOVE FASTER",
      tag: "Platform",
      desc: "The tools you need to stay ahead. Found by the community, for you.",
      img: "https://picsum.photos/seed/digital-collaboration/800/400",
      icon: <Layers size={24} />
    }
  ];

  return (
    <motion.section 
      id="ecosystem" 
      ref={targetRef} 
      className="relative h-[1000vh] bg-vast-black"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-start overflow-hidden pt-12 md:pt-16">
        <div className="px-6 md:px-12 mb-6 md:mb-8 flex justify-between items-end z-10">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-vast-accent mb-2 block">02 / Ecosystem</span>
            <RevealText text="The Infrastructure." className="text-3xl md:text-[5vw] font-display uppercase leading-none tracking-tight" />
          </div>
          <div className="hidden lg:block max-w-xs text-right">
            <p className="font-space text-sm opacity-40 leading-relaxed">
              You have the talent; we have the leverage. We built the systems to help you spend your youth on things that actually matter.
            </p>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-16 md:gap-24 px-6 md:px-12 relative z-10">
          {items.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-[70vw] md:w-[40vw] group">
              <div className="relative aspect-[21/9] md:aspect-[16/7] overflow-hidden rounded-3xl mb-6 border border-white/5 bg-vast-dim group-hover:rotate-2 transition-transform duration-700">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ease-out opacity-70 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-vast-black via-transparent to-transparent opacity-60" />
                <div className="absolute top-8 left-8 w-16 h-16 glass rounded-full flex items-center justify-center text-vast-accent group-hover:rotate-12 transition-transform">
                  {item.icon}
                </div>
                <div className="absolute bottom-8 right-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest bg-vast-black/80 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                    {item.tag}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-display uppercase mb-2 flex items-center gap-4 group-hover:text-vast-accent transition-colors">
                    <span className="opacity-20 font-mono text-xl">0{i+1}</span>
                    {item.title}
                  </h3>
                  <p className="font-space text-base md:text-lg opacity-60 leading-relaxed max-w-xl group-hover:opacity-100 transition-opacity">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Background Kinetic Text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.01] pointer-events-none whitespace-nowrap">
          <span className="font-display text-[40vw] leading-none text-outline uppercase">COLLECTIVE_NODES</span>
        </div>
      </div>
    </motion.section>
  );
};

const VastHall3D = () => {
  const images = [
    "/1756392333894-1.jpeg",
    "/Vast-BTC.png",
    "/Vast-Cheesy.png",
    "/general over all pic-1.jpeg",
    "/qatari-girls.jpeg",
    "https://picsum.photos/seed/tech-innovation/800/800",
    "https://picsum.photos/seed/community-collaboration/800/800",
    "https://picsum.photos/seed/creative-workspace/800/800",
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-96 px-6 md:px-12 bg-vast-black overflow-hidden relative min-h-screen flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
      
      <div className="max-w-screen-2xl mx-auto text-center mb-40 relative z-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.6em] mb-8 block opacity-40">03 / Visual Vast</span>
        <h2 className="text-7xl md:text-[15vw] font-display leading-[0.9] tracking-tight uppercase italic">VAST HALL.</h2>
      </div>

      <div className="w-full h-screen relative cursor-grab active:cursor-grabbing">
        <Canvas shadows camera={{ position: [0, 0, 32], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={15} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={5} />
          <Suspense fallback={null}>
            <OrbitControls 
              enableDamping 
              dampingFactor={0.05} 
              rotateSpeed={0.5} 
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
            <DreiFloat rotationIntensity={0.5} floatIntensity={0.5} speed={2}>
              <ImageGallery3D images={images} />
              {/* Central 3D Shape */}
              <mesh>
                <icosahedronGeometry args={[2, 0]} />
                <meshStandardMaterial color="#00FF66" wireframe />
              </mesh>
            </DreiFloat>
            <ContactShadows position={[0, -6, 0]} opacity={0.4} scale={30} blur={2} far={10} />
          </Suspense>
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Noise opacity={0.05} />
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
          </EffectComposer>
        </Canvas>
      </div>
    </motion.section>
  );
};

function ImageGallery3D({ images }: { images: string[] }) {
  return (
    <group>
      {images.map((url, i) => {
        const angle = (i / images.length) * Math.PI * 2;
        const radius = 14;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <InteractiveImageCard 
            key={i} 
            url={url} 
            position={[x, Math.sin(i) * 2, z]} 
            rotation={[0, -angle + Math.PI / 2, 0]} 
          />
        );
      })}
    </group>
  );
}

// ... (rest of imports)

function InteractiveImageCard({ url, position, rotation }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <Image
      url={url}
      position={position}
      rotation={rotation}
      scale={hovered ? 1.15 : 1}
      transparent
      toneMapped={false}
      onClick={() => console.log("Easter Egg: Image Node Activated")}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      // The Image component handles aspect ratio and cropping automatically
      // to fit the scale provided.
      width={10}
      height={12}
    />
  );
}

const ManifestoPage = ({ setShowOverride, showOverride }: any) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-60 pb-40 px-6 md:px-12 bg-vast-black min-h-screen"
      >
        <div className="max-w-screen-2xl mx-auto">
          <span className="font-mono text-[10px] uppercase tracking-[0.8em] mb-12 block opacity-40">The Manifesto</span>
          
          <div className="mb-60">
            <h1 className="text-7xl md:text-[15vw] font-display leading-[0.9] tracking-tight uppercase mb-24">
              <motion.span 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                USE THE
              </motion.span>
              <motion.span 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block text-vast-accent italic"
              >
                POTENTIAL.
              </motion.span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-80">
            <div className="lg:col-span-4">
              <div className="sticky top-40">
                <div className="w-20 h-20 glass rounded-full flex items-center justify-center text-vast-accent mb-8">
                  <Zap size={32} />
                </div>
                <h3 className="text-4xl font-display uppercase mb-6">01. The Premise</h3>
                <p className="font-space text-lg opacity-60 leading-relaxed">
                  Vast™ is a community for ambitious youth. It’s a space to learn new skills, explore new hobbies, and build a network. We’re here to socialize, grow, and most importantly break the cycle of wasted potential.
                </p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-60">
                {[
                  {
                    title: "The Mission",
                    content: "To build the future of the world by empowering the next generation today, and to make sure no talent or potential goes to waste."
                  },
                  {
                    title: "The Vision",
                    content: "A world where everyone has reached their full potential."
                  },
                  {
                    title: "The Mindset",
                    content: "A mistake is a loss when you learn nothing from it, we don't fear mistakes; we learn from them to become better."
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <span className="font-mono text-vast-accent mb-4 block">/ 0{i+2}</span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight mb-8 group-hover:translate-x-4 transition-transform duration-500 break-words">
                      {item.title}
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl font-space font-light opacity-40 group-hover:opacity-100 transition-opacity duration-500 leading-tight">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative h-screen flex items-center justify-center overflow-hidden rounded-3xl mb-40">
            <div className="absolute inset-0 bg-vast-accent/10 z-0" />
            <Canvas camera={{ position: [0, 0, 5] }}>
              <Suspense fallback={null}>
                <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                  <mesh>
                    <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
                    <MeshDistortMaterial color="var(--color-vast-accent)" speed={3} distort={0.5} />
                  </mesh>
                </Float>
                <Environment preset="night" />
              </Suspense>
            </Canvas>
            <div className="absolute z-10 text-center">
              <h2 className="text-6xl md:text-[10vw] font-display uppercase tracking-tighter text-outline-accent">JOIN THE COMMUNITY</h2>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer setShowOverride={setShowOverride} showOverride={showOverride} />
    </>
  );
};

const EcosystemPage = ({ setShowOverride, showOverride }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-vast-black min-h-screen"
    >
      <div className="pt-60 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto mb-60">
          <span className="font-mono text-[10px] uppercase tracking-[0.8em] mb-12 block opacity-40">The Infrastructure</span>
          <h1 className="text-7xl md:text-[12vw] font-display leading-[0.9] tracking-tight uppercase mb-12">
            Global<br/><span className="text-vast-accent">Nexus.</span>
          </h1>
          <p className="text-2xl md:text-4xl font-space font-light max-w-3xl opacity-60 italic">
            "A community designed to save potential and talent from being wasted through action and collaboration."
          </p>
        </div>
      </div>

      <EcosystemSection />

      <div className="py-60 px-6 md:px-12 bg-vast-paper text-vast-black">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <h2 className="text-5xl md:text-8xl font-display uppercase tracking-tight mb-12">Community<br/>Architecture.</h2>
              <div className="flex flex-col gap-8">
                {[
                  { title: "Global Hubs", desc: "Ambitious teens from all around the world, connected by one goal." },
                  { title: "The Nexus", desc: "Socializing, skill-sharing, and a space to explore new hobbies all in one community." },
                  { title: "Vast Standard", desc: "A culture built on trying new things, breaking cycles, and building the future." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full border border-vast-black/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-xs">0{i+1}</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-display uppercase mb-2">{item.title}</h4>
                      <p className="font-space opacity-60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-square glass-dark rounded-3xl overflow-hidden relative">
              <Canvas camera={{ position: [0, 0, 10] }}>
                <Suspense fallback={null}>
                  <OrbitControls enableZoom={false} autoRotate />
                  <mesh>
                    <dodecahedronGeometry args={[3, 0]} />
                    <meshStandardMaterial wireframe color="#00FF66" />
                  </mesh>
                  <Environment preset="night" />
                </Suspense>
                <EffectComposer>
                  <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                  <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
                </EffectComposer>
              </Canvas>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-[10px] uppercase tracking-[1em] opacity-20">Network_Map_V4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer setShowOverride={setShowOverride} showOverride={showOverride} />
    </motion.div>
  );
};

const VastLogo3D = ({ className }: { className?: string }) => {
  return (
    <Canvas className={className} camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <DreiFloat speed={2} rotationIntensity={1} floatIntensity={1}>
        <group rotation={[0, 0, 0]}>
          {/* Simple 3D V shape */}
          <mesh rotation={[0, 0, -0.5]}>
            <boxGeometry args={[0.5, 3, 0.5]} />
            <meshStandardMaterial color="#00FF66" emissive="#00FF66" emissiveIntensity={0.5} />
          </mesh>
          <mesh rotation={[0, 0, 0.5]} position={[1.5, 1.2, 0]}>
            <boxGeometry args={[0.5, 3, 0.5]} />
            <meshStandardMaterial color="#00FF66" emissive="#00FF66" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </DreiFloat>
      <Environment preset="night" />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
      </EffectComposer>
    </Canvas>
  );
};
const VastPage = ({ setShowOverride, showOverride }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-vast-black min-h-screen relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="pt-40 px-6 md:px-12 relative z-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-40">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="w-60 h-60"
            >
              <VastLogo3D />
            </motion.div>
            <h1 className="text-8xl md:text-[18vw] font-display leading-[0.7] tracking-tighter uppercase mb-12 glitch" data-text="VAST™">
              VAST™
            </h1>
            <p className="text-2xl md:text-4xl font-space font-light max-w-3xl opacity-40 italic">
              "The global community for ambitious teens. Where we stop wasting potential and start building the future."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-60">
            {[
              { title: "SKILLS", icon: <Command size={32} />, desc: "Trading skills between members within the community." },
              { title: "HOBBIES", icon: <Sparkles size={32} />, desc: "Exploring new and unique hobbies of highly ambitious teens." },
              { title: "SOCIAL", icon: <Globe size={32} />, desc: "Building networks between like-minded people and mentors." }
            ].map((item, i) => (
              <div key={i} className="glass p-12 rounded-3xl group hover:bg-vast-accent hover:text-vast-black transition-all duration-700">
                <div className="mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-4xl font-display uppercase mb-6">{item.title}</h3>
                <p className="font-space text-lg opacity-60 group-hover:opacity-100 transition-opacity">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="h-[80vh] w-full relative mb-40">
            <Canvas camera={{ position: [0, 0, 15] }}>
              <Suspense fallback={null}>
                <PresentationControls
                  global
                  rotation={[0, 0.3, 0]}
                  polar={[-Math.PI / 3, Math.PI / 3]}
                  azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                >
                  <DreiFloat rotationIntensity={1} floatIntensity={1} speed={2}>
                    <mesh>
                      <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
                      <MeshDistortMaterial color="var(--color-vast-accent)" speed={3} distort={0.8} metalness={1} roughness={0} />
                    </mesh>
                  </DreiFloat>
                </PresentationControls>
                <Environment preset="night" />
              </Suspense>
              <EffectComposer>
                <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
              </EffectComposer>
            </Canvas>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h2 className="text-6xl md:text-[12vw] font-display uppercase tracking-tighter text-outline opacity-10">THE_CORE</h2>
            </div>
          </div>
        </div>
      </div>
      <Footer setShowOverride={setShowOverride} showOverride={showOverride} />
    </motion.div>
  );
};

const Footer = ({ setShowOverride, showOverride }: { setShowOverride: (v: boolean) => void, showOverride: boolean }) => {
  return (
    <footer className="bg-vast-paper text-vast-black py-4 md:py-6 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot opacity-5 pointer-events-none" />
      
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-4 md:mb-6 items-center">
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <h2 className="text-2xl md:text-4xl font-display leading-none tracking-tight uppercase mb-1">
              DON'T WASTE IT.
            </h2>
            <p className="text-sm md:text-base font-space font-light opacity-60">
              Stop talking. Start building.
            </p>
            <MagneticButton className="px-4 py-2 bg-vast-black text-vast-paper rounded-full font-display text-sm uppercase tracking-widest hover:bg-vast-accent hover:text-vast-black transition-all duration-500">
              ENTER
            </MagneticButton>
          </div>
          
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-8">
            <div className="flex flex-row gap-4 items-center">
              <span className="font-mono text-[8px] uppercase tracking-widest opacity-40">Nav:</span>
              <div className="flex flex-row gap-3 font-display text-xs uppercase tracking-tight">
                <Link to="/" className="hover:text-vast-accent transition-colors">Home</Link>
                <Link to="/manifesto" className="hover:text-vast-accent transition-colors">Manifesto</Link>
                <Link to="/ecosystem" className="hover:text-vast-accent transition-colors">Ecosystem</Link>
              </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <span className="font-mono text-[8px] uppercase tracking-widest opacity-40">Social:</span>
              <div className="flex flex-row gap-3 font-display text-xs uppercase tracking-tight">
                <MagneticButton className="hover:text-vast-accent transition-colors" onClick={() => window.open("https://www.instagram.com/vast.qa/", "_blank", "noopener,noreferrer")}><Instagram size={16} /></MagneticButton>
                <MagneticButton className="hover:text-vast-accent transition-colors" onClick={() => window.open("https://discord.gg/CcEFeHw9MN", "_blank", "noopener,noreferrer")}><MessageSquare size={16} /></MagneticButton>
                <MagneticButton className="hover:text-vast-accent transition-colors" onClick={() => window.open("https://www.youtube.com/@Vast-qa", "_blank", "noopener,noreferrer")}><Youtube size={16} /></MagneticButton>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-vast-black/10">
          <div className="flex items-center gap-2">
            <VastLogo className="w-8 h-8" variant="black" />
            <span className="font-display text-lg tracking-tighter uppercase text-vast-black">
              Vast™
            </span>
          </div>
          <div className="font-mono text-[8px] opacity-30 tracking-[0.5em] uppercase">
            © 2026 VAST COLLECTIVE
          </div>
        </div>
      </div>

      {/* Easter Egg: Hidden Button */}
      <button 
        className="absolute bottom-4 right-4 w-2 h-2 bg-vast-black/5 rounded-full cursor-help"
        onClick={() => setShowOverride(true)}
      />

      <AnimatePresence>
        {showOverride && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-vast-black flex items-center justify-center p-12"
            onClick={() => setShowOverride(false)}
          >
            <div className="absolute inset-0 noise opacity-20" />
            <div className="relative z-10 text-vast-accent font-mono text-xl md:text-3xl text-center max-w-2xl">
              <motion.div 
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.1, repeat: Infinity }}
                className="mb-8"
              >
                [ SYSTEM OVERRIDE INITIATED ]
              </motion.div>
              <div className="flex flex-col gap-2 text-left text-xs md:text-sm opacity-60">
                <span>{">"} BYPASSING_VAST_SECURITY...</span>
                <span>{">"} ACCESSING_VOID_PROTOCOLS...</span>
                <span>{">"} DECRYPTING_COLLECTIVE_DATA...</span>
                <span>{">"} INITIATING_SYSTEM_REBOOT...</span>
                <span className="text-vast-paper mt-4">YOU HAVE FOUND THE CORE. WELCOME TO THE VAST.</span>
              </div>
              <button className="mt-12 px-8 py-4 border border-vast-accent text-vast-accent hover:bg-vast-accent hover:text-vast-black transition-all uppercase tracking-widest text-xs">
                Close Terminal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Main App ---

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  return (
      <GlobalStateProvider>
        <AppContent 
          isLoading={isLoading} 
          setIsLoading={setIsLoading} 
          showEasterEgg={showEasterEgg} 
          setShowEasterEgg={setShowEasterEgg}
          showOverride={showOverride}
          setShowOverride={setShowOverride}
        />
      </GlobalStateProvider>
  );
};

const AppContent = ({ isLoading, setIsLoading, showEasterEgg, setShowEasterEgg, showOverride, setShowOverride }: any) => {
  const { isGlitchActive, setShowTerminal } = React.useContext(GlobalStateContext);

  // Easter Egg: Konami Code & Terminal Shortcut
  useEffect(() => {
    let keys: string[] = [];
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Konami Code
      keys.push(e.key);
      keys = keys.slice(-10);
      if (keys.join(',') === konami.join(',')) {
        setShowEasterEgg(true);
        setTimeout(() => setShowEasterEgg(false), 5000);
      }

      // Terminal Shortcut
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowTerminal((prev: boolean) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowEasterEgg, setShowTerminal]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative ${isGlitchActive ? 'glitch-active' : ''}`}
          >
            <CustomCursor />
            <NoiseOverlay />
            <GlitchOverlay />
            <VastTerminal />
            <Navbar />
            <StudioLabel text="VAST™ COLLECTIVE" side="left" />
            <StudioLabel text="EST. 2026" side="right" />
            
            <Routes>
              <Route path="/" element={
                <main className="flex flex-col gap-32 md:gap-60">
                  <Hero />
                  <MissionSection />
                  <EcosystemSection />
                  <VastHall3D />
                  <Footer setShowOverride={setShowOverride} showOverride={showOverride} />
                </main>
              } />
              <Route path="/manifesto" element={<ManifestoPage setShowOverride={setShowOverride} showOverride={showOverride} />} />
              <Route path="/ecosystem" element={<EcosystemPage setShowOverride={setShowOverride} showOverride={showOverride} />} />
              <Route path="/vast" element={<VastPage setShowOverride={setShowOverride} showOverride={showOverride} />} />
            </Routes>

            {showEasterEgg && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed inset-0 z-[300] bg-vast-accent flex items-center justify-center text-vast-black font-display text-[20vw] tracking-tighter uppercase italic"
              >
                GOD MODE
              </motion.div>
            )}
            
            {/* Liquid Filter SVG */}
            <svg className="hidden">
              <defs>
                <filter id="liquid">
                  <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" />
                </filter>
              </defs>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default App;
