import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 py-4 sm:py-6 bg-white dark:bg-slate-950 text-[11px] sm:text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p>© {new Date().getFullYear()} HC_comp • Sistema de Gestão de Estoque (pt-BR)</p>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-slate-400">
          <a
            href="https://www.cluberock.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-200 hover:underline transition-colors"
          >
            Clube Rock (cluberock.com.br)
          </a>
          <span className="hidden sm:inline">•</span>
          <a
            href="https://www.ridenation.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-200 hover:underline transition-colors"
          >
            Ride Nation (ridenation.com.br)
          </a>
        </div>
      </div>
    </footer>
  );
}