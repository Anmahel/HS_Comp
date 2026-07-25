import React from 'react';
import { Shirt, Filter, Sun, Moon } from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  brands,
  selectedBrand,
  setSelectedBrand
}) {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-[64px] flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold shrink-0">
            <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                HC_comp
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Estoque
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Clube Rock & Ride Nation
            </p>
          </div>
        </div>

        {/* Controls: Brand Selector + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter by Brand */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <label htmlFor="brand-filter-select" className="sr-only">Filtrar por marca</label>
            <select
              id="brand-filter-select"
              aria-label="Filtrar por marca"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none pr-1 cursor-pointer max-w-[130px] sm:max-w-none text-xs"
            >
              <option value="" className="bg-white dark:bg-slate-900">Marcas</option>
              {brands.map(b => (
                <option key={b.id} value={b.id} className="bg-white dark:bg-slate-900">{b.name}</option>
              ))}
            </select>
          </div>

          {/* Toggle Sol / Lua */}
          <button
            type="button"
            onClick={toggleTheme}
            title={`Alternar para modo ${theme === 'dark' ? 'Claro' : 'Escuro'}`}
            aria-label={`Alternar para modo ${theme === 'dark' ? 'Claro' : 'Escuro'}`}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
