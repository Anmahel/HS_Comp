import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 py-4 sm:py-6 bg-white dark:bg-slate-950 text-[11px] sm:text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p>© {new Date().getFullYear()} HC_comp • Sistema de Gestão de Estoque (pt-BR)</p>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-slate-400">
          <span>Clube Rock (cluberock.com.br)</span>
          <span className="hidden sm:inline">•</span>
          <span>Ride Nation (ridenation.com.br)</span>
        </div>
      </div>
    </footer>
  );
}
