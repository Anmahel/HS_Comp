import React, { useState } from 'react';
import { Search, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Shirt, Layers } from 'lucide-react';

export default function BuscaSKU({
  skuSearch,
  setSkuSearch,
  handleVerificarSKU,
  verificando,
  verificacaoResult
}) {
  // Estado para armazenar o histórico dinâmico das 2 últimas buscas realizadas
  const [buscasRecentes, setBuscasRecentes] = useState([]);

  // Adiciona o novo SKU pesquisado no início, removendo duplicatas e mantendo no máximo 2 itens
  const adicionarBuscaRecente = (sku) => {
    const trimmed = sku.trim().toUpperCase();
    if (!trimmed) return;
    setBuscasRecentes((prev) => {
      const filtrado = prev.filter((item) => item !== trimmed);
      return [trimmed, ...filtrado].slice(0, 2);
    });
  };

  const onSubmitForm = (e) => {
    if (e) e.preventDefault();
    if (!skuSearch.trim()) return;
    adicionarBuscaRecente(skuSearch);
    handleVerificarSKU(e);
  };

  const handleChipClick = (sku) => {
    const upperSku = sku.toUpperCase();
    setSkuSearch(upperSku);
    adicionarBuscaRecente(upperSku);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Banner de Boas-Vindas */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Verificação Rápida de Estoque
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Consulte o SKU da peça do pedido para confirmar envio imediato ou se a estampa está disponível para montagem rápida.
        </p>
      </div>

      {/* Barra de Busca de SKU Responsiva */}
      <form onSubmit={onSubmitForm} className="max-w-xl mx-auto flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <label htmlFor="sku-search-input" className="sr-only">Digite o SKU da peça</label>
          <input
            id="sku-search-input"
            aria-label="Digite o SKU da peça"
            type="text"
            value={skuSearch}
            onChange={(e) => setSkuSearch(e.target.value.toUpperCase())}
            placeholder="Digite o SKU (ex: CM-001-PRE-M)"
            className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm text-sm font-mono font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase tracking-wider"
          />
        </div>
        <button
          type="submit"
          disabled={verificando}
          className="px-6 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          {verificando ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verificar'}
        </button>
      </form>

      {/* Chips de Buscas Recentes (exibidos apenas se houver pelo menos 1 busca recente) */}
      {buscasRecentes.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-slate-400 font-medium w-full sm:w-auto text-center">Buscas recentes:</span>
          {buscasRecentes.map((sku) => (
            <button
              key={sku}
              type="button"
              onClick={() => handleChipClick(sku)}
              className="px-2.5 py-1 bg-slate-200/60 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 font-mono rounded-lg transition-colors text-slate-700 dark:text-slate-300 text-[11px]"
            >
              {sku}
            </button>
          ))}
        </div>
      )}

      {/* CARD DE RESULTADO DA VERIFICAÇÃO RESPONSIVO */}
      {verificacaoResult && (
        <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 sm:space-y-6">
          
          {/* Header do Card com Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                SKU Consultado ({verificacaoResult.brand_name})
              </span>
              <h3 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white mt-1 break-all">
                {verificacaoResult.sku}
              </h3>
            </div>

            {/* Badge de Status Principal */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-sm ${
              verificacaoResult.badge_color === 'emerald'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : verificacaoResult.badge_color === 'amber'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
            }`}>
              {verificacaoResult.badge_color === 'emerald' && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
              {verificacaoResult.badge_color === 'amber' && <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
              {verificacaoResult.badge_color === 'rose' && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
              <span>{verificacaoResult.status_label}</span>
            </div>
          </div>

          {/* Mensagem Explicativa */}
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            {verificacaoResult.mensagem}
          </p>

          {/* Grid Comparativo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
            
            {/* Qtd Peça Pronta */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${
              verificacaoResult.peca_pronta_qtd > 0 
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  1. PEÇA PRONTA (Estampada)
                </span>
                <Shirt className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold">{verificacaoResult.peca_pronta_qtd}</span>
                <span className="text-xs text-slate-500 font-medium">unidades em estoque</span>
              </div>
            </div>

            {/* Qtd Estampa Avulsa */}
            <div className={`p-4 sm:p-5 rounded-2xl border ${
              verificacaoResult.estampa_qtd > 0 
                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50' 
                : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  2. ESTAMPA AVULSA ({verificacaoResult.codigo_estampa})
                </span>
                <Layers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold">{verificacaoResult.estampa_qtd}</span>
                <span className="text-xs text-slate-500 font-medium">unidades disponíveis</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 truncate">
                Design: {verificacaoResult.nome_design_estampa}
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
