import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Database, 
  Server, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  ShieldCheck,
  Globe,
  Cpu
} from 'lucide-react';

export default function App() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    online: false,
    message: '',
    tech: ''
  });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Backend response error');
        return res.json();
      })
      .then((data) => {
        setBackendStatus({
          loading: false,
          online: true,
          message: data.message || 'Operativo',
          tech: data.backend || 'Flask + SQLAlchemy'
        });
      })
      .catch((err) => {
        console.warn('Backend server offline or starting:', err);
        setBackendStatus({
          loading: false,
          online: false,
          message: 'Backend local no detectado (ejecuta app.py o docker-compose)',
          tech: 'Flask + SQLAlchemy'
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Navigation Bar */}
      <header className="border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              HC_comp
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              v0.1
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300">
                {backendStatus.loading 
                  ? 'Verificando Backend...' 
                  : backendStatus.online 
                    ? 'API Conectada' 
                    : 'Modo Standalone'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-1 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md mb-8 shadow-inner shadow-indigo-500/5">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
            Arquitectura Full-Stack Lista
          </span>
        </div>

        {/* Central Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Todo esta listo para comenzar a crear tu gran proyecto.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed mb-12">
          Entorno preconfigurado de alto rendimiento integrando React, Vite, Tailwind CSS, Python Flask y SQLAlchemy gestionado con Bun y UV.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a 
            href="#stack"
            className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium text-sm shadow-xl shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            Explorar Stack Integrado
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300 font-medium text-sm transition-all duration-200 flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-slate-400" />
            Configuración Local
          </a>
        </div>

        {/* Tech Stack Cards Grid */}
        <div id="stack" className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          {/* Card 1: Frontend */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Frontend</h3>
            <p className="text-xs text-slate-400 mb-3">React + Vite + Tailwind CSS</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Gestor Bun v1.2+
            </div>
          </div>

          {/* Card 2: Backend */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Backend API</h3>
            <p className="text-xs text-slate-400 mb-3">Python 3 + Flask + CORS</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Gestor UV (Astral)
            </div>
          </div>

          {/* Card 3: Database & ORM */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">ORM & BD</h3>
            <p className="text-xs text-slate-400 mb-3">SQLAlchemy ORM</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Modelos Inicializados
            </div>
          </div>

          {/* Card 4: Devops & Deploy */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-sm hover:border-indigo-500/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Despliegue</h3>
            <p className="text-xs text-slate-400 mb-3">Docker + Vercel Ready</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Docker-compose Activo
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-600" />
            <span>HC_comp Proyecto Full-Stack • Versión 0.1v</span>
          </div>
          <p>© {new Date().getFullYear()} HC_comp. Estructura base lista para desarrollo.</p>
        </div>
      </footer>
    </div>
  );
}
