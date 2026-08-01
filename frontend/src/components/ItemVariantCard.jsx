import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Minus, Plus, BoxSelect, RefreshCw } from 'lucide-react';
import BrandBadge from './BrandBadge';

export default function ItemVariantCard({ item, onUsar, isSubmitting }) {
  const [qtdUsar, setQtdUsar] = useState(1);
  const isPeca = item.categoria === 'peca';
  const isAvailable = item.quantidade > 0;
  const numQty = typeof qtdUsar === 'number' ? qtdUsar : parseInt(qtdUsar, 10);
  const isInvalidQty = isNaN(numQty) || numQty < 1 || numQty > item.quantidade;

  const handleMinus = () => {
    setQtdUsar(prev => {
      const current = typeof prev === 'number' ? prev : parseInt(prev, 10) || 1;
      return Math.max(1, current - 1);
    });
  };

  const handlePlus = () => {
    setQtdUsar(prev => {
      const current = typeof prev === 'number' ? prev : parseInt(prev, 10) || 1;
      return Math.min(item.quantidade || 1, current + 1);
    });
  };

  const handleQtdChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setQtdUsar('');
      return;
    }
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) return;
    setQtdUsar(Math.max(1, Math.min(item.quantidade || 1, parsed)));
  };

  const handleQtdBlur = () => {
    if (qtdUsar === '' || isNaN(Number(qtdUsar)) || Number(qtdUsar) < 1) {
      setQtdUsar(1);
    }
  };

  const inputId = `qtd-input-${item.categoria}-${item.id}`;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-colors shadow-sm ${
      isAvailable 
        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
        : 'bg-slate-50/70 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-800/60 opacity-80'
    }`}>
      {/* Header with BrandBadge & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BrandBadge brandName={item.brand_name} />
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {isPeca ? 'PEÇA PRONTA' : 'ESTAMPA AVULSA'}
          </span>
        </div>

        {/* Status Badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          item.badge_color === 'emerald'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            : item.badge_color === 'amber'
              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        }`}>
          {item.badge_color === 'emerald' && <CheckCircle2 className="w-3.5 h-3.5" />}
          {item.badge_color === 'amber' && <AlertTriangle className="w-3.5 h-3.5" />}
          {item.badge_color === 'rose' && <XCircle className="w-3.5 h-3.5" />}
          {item.status_label}
        </span>
      </div>

      {/* Main Info */}
      <div className="py-3 space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="text-base sm:text-lg font-mono font-extrabold text-slate-900 dark:text-white break-all">
            {item.sku}
          </h4>
          <span className={`text-sm font-bold shrink-0 ${isAvailable ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`}>
            {item.quantidade} un.
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          Design: <span className="font-semibold text-slate-900 dark:text-white">{item.nome_design}</span>
        </p>

        {isPeca ? (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              Tipo: <strong className="text-slate-900 dark:text-white">{item.tipo}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              Cor: <strong className="text-slate-900 dark:text-white">{item.cor}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              Tamanho: <strong className="text-slate-900 dark:text-white">{item.tamanho}</strong>
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              Cor: <strong className="text-slate-900 dark:text-white">{item.cor}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Action Footer: Quantity Selector + Usar / Dar Baixa Button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-500">
            Qtd a usar:
          </label>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 p-0.5">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={!isAvailable || numQty <= 1}
              onClick={handleMinus}
              className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              id={inputId}
              aria-label={`Quantidade a usar de ${item.sku}`}
              type="number"
              min="1"
              max={item.quantidade || 1}
              value={qtdUsar}
              onChange={handleQtdChange}
              onBlur={handleQtdBlur}
              disabled={!isAvailable}
              className="w-12 text-center text-xs font-bold bg-transparent outline-none disabled:opacity-40"
            />
            <button
              type="button"
              aria-label="Aumentar quantidade"
              disabled={!isAvailable || numQty >= item.quantidade}
              onClick={handlePlus}
              className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Dar baixa de ${numQty || 1} unidades no item ${item.sku}`}
          disabled={!isAvailable || isInvalidQty || isSubmitting}
          onClick={() => onUsar(item.categoria, item.id, numQty || 1, item.sku)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          {isSubmitting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <BoxSelect className="w-4 h-4" />
              Usar / Dar Baixa
            </>
          )}
        </button>
      </div>
    </div>
  );
}
