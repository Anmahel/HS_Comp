import React from 'react';
import { Sparkles, Shirt, Layers } from 'lucide-react';

export default function NavigationTabs({ activeTab, setActiveTab, pecasCount, estampasCount }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 pt-2 min-w-max">
        <button
          type="button"
          onClick={() => setActiveTab('verificador')}
          className={`px-3 sm:px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'verificador'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Verificador
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pecas')}
          className={`px-3 sm:px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'pecas'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4" />
          Prontas ({pecasCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('estampas')}
          className={`px-3 sm:px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'estampas'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Estampas({estampasCount})
        </button>
      </div>
    </div>
  );
}
