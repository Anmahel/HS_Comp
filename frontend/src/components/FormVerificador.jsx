import React from 'react';
import { Search, RefreshCw, Flame, Compass, Filter } from 'lucide-react';
import ColorPickerDropdown from './ColorPickerDropdown';

export default function FormVerificador({
  skuSearch,
  setSkuSearch,
  verificadorBrand,
  setVerificadorBrand,
  verificadorCor,
  setVerificadorCor,
  verificadorTipo,
  setVerificadorTipo,
  onSubmitForm,
  verificando,
  buscasRecentes,
  handleChipClick
}) {
  return (
    <div className="p-4 sm:p-5 bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800 rounded-3xl shadow-lg space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
            Verificador & Filtros
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Filtre por marca, tipo e cor ou pesquise diretamente.
        </p>
      </div>

      <form id="form-buscar" onSubmit={onSubmitForm} className="space-y-4">
        {/* Marca */}
        <div>
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Marca
          </span>
          <div className="flex items-center bg-slate-300/50 dark:bg-slate-950 p-1 rounded-2xl">
            <button
              type="button"
              aria-label="Selecionar Marca Clube Rock (CR)"
              onClick={() => setVerificadorBrand && setVerificadorBrand('CR')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 ${
                verificadorBrand === 'CR'
                  ? 'bg-red-950/40 text-red-500 border border-red-600/50 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Clube Rock (CR)
            </button>
            <button
              type="button"
              aria-label="Selecionar Marca Ride Nation (RN)"
              onClick={() => setVerificadorBrand && setVerificadorBrand('RN')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 ${
                verificadorBrand === 'RN'
                  ? 'bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Ride Nation (RN)
            </button>
          </div>
        </div>

        {/* Tipo */}
        <div>
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Tipo de Peça
          </span>
          <div className="flex items-center bg-slate-300/50 dark:bg-slate-950 p-1 rounded-2xl">
            {['CM', 'CF', 'MO'].map(t => (
              <button
                key={t}
                type="button"
                aria-label={`Selecionar tipo ${t}`}
                onClick={() => setVerificadorTipo && setVerificadorTipo(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors text-center ${
                  verificadorTipo === t
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <ColorPickerDropdown
          value={verificadorCor}
          onChange={(newCor) => setVerificadorCor && setVerificadorCor(newCor)}
        />

        {/* Input */}
        <div>
          <label htmlFor="sku-search-input" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Busca por Código / Estampa
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="sku-search-input"
              aria-label="Buscar por código de estampa ou SKU"
              type="text"
              value={skuSearch}
              onChange={(e) => setSkuSearch(e.target.value)}
              placeholder="Buscar estampa (ex: 001, liver) ou SKU..."
              className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          aria-label="Executar verificação de estoque"
          disabled={verificando}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 transition-colors flex items-center justify-center gap-2"
        >
          {verificando ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verificar Estoque'}
        </button>
      </form>

      {/* Recent Searches */}
      {buscasRecentes && buscasRecentes.length > 0 && (
        <div className="pt-2 border-t border-slate-300/60 dark:border-slate-800 space-y-1.5">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            Buscas recentes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {buscasRecentes.map((sku) => (
              <button
                key={sku}
                type="button"
                aria-label={`Repetir busca por ${sku}`}
                onClick={() => handleChipClick(sku)}
                className="px-2.5 py-1 bg-slate-300/60 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 font-mono rounded-lg transition-colors text-slate-700 dark:text-slate-300 text-[11px]"
              >
                {sku}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
