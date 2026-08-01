import React, { useState } from 'react';
import { Search, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Shirt, Layers, Minus, Plus, BoxSelect, AlertCircle, X, Flame, Compass } from 'lucide-react';
import BrandBadge from './BrandBadge';

function ColorPickerDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { id: 'PRE', label: 'PRE', style: 'bg-black text-white border-slate-700 font-bold' },
    { id: 'AMA', label: 'AMA', style: 'bg-yellow-400 text-slate-900 font-bold shadow-[0_0_12px_rgba(250,204,21,0.5)]' },
    { id: 'BRA', label: 'BRA', style: 'bg-white text-slate-900 border-slate-300 font-bold' },
  ];

  const activeColor = colors.find(c => c.id === value) || colors[0];

  return (
    <div className="relative inline-block text-left shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${activeColor.style}`}
      >
        <span>Cor: {activeColor.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-30 space-y-1">
          {colors.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onChange(c.id);
                setIsOpen(false);
              }}
              className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${c.style} ${
                value === c.id ? 'ring-2 ring-indigo-500' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <span>{c.label}</span>
              {value === c.id && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ItemVariantCard({ item, onUsar, isSubmitting }) {
  const [qtdUsar, setQtdUsar] = useState(1);
  const isPeca = item.categoria === 'peca';
  const isAvailable = item.quantidade > 0;
  const isInvalidQty = qtdUsar < 1 || qtdUsar > item.quantidade;

  const handleMinus = () => setQtdUsar(prev => Math.max(1, prev - 1));
  const handlePlus = () => setQtdUsar(prev => Math.min(item.quantidade || 1, prev + 1));

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-sm ${
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
          <h4 className="text-base sm:text-lg font-mono font-extrabold text-slate-900 dark:text-white">
            {item.sku}
          </h4>
          <span className={`text-sm font-bold ${isAvailable ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`}>
            {item.quantidade} un. disponíveis
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
          <span className="text-xs font-semibold text-slate-500">Qtd a usar:</span>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 p-0.5">
            <button
              type="button"
              disabled={!isAvailable || qtdUsar <= 1}
              onClick={handleMinus}
              className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="1"
              max={item.quantidade || 1}
              value={qtdUsar}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setQtdUsar(isNaN(val) ? 1 : Math.max(1, val));
              }}
              disabled={!isAvailable}
              className="w-12 text-center text-xs font-bold bg-transparent outline-none disabled:opacity-40"
            />
            <button
              type="button"
              disabled={!isAvailable || qtdUsar >= item.quantidade}
              onClick={handlePlus}
              className="w-7 h-7 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={!isAvailable || isInvalidQty || isSubmitting}
          onClick={() => onUsar(item.categoria, item.id, qtdUsar, item.sku)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
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

export default function BuscaSKU({
  skuSearch,
  setSkuSearch,
  verificadorBrand = 'CR',
  setVerificadorBrand,
  verificadorCor = 'TODOS',
  setVerificadorCor,
  verificadorTipo = 'CM',
  setVerificadorTipo,
  handleVerificarSKU,
  handleUsarEstoque,
  verificando,
  verificacaoResult
}) {
  const [buscasRecentes, setBuscasRecentes] = useState([]);
  const [toast, setToast] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const adicionarBuscaRecente = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setBuscasRecentes((prev) => {
      const filtrado = prev.filter((item) => item.toUpperCase() !== trimmed.toUpperCase());
      return [trimmed, ...filtrado].slice(0, 3);
    });
  };

  const onSubmitForm = (e) => {
    if (e) e.preventDefault();
    if (skuSearch.trim()) adicionarBuscaRecente(skuSearch);
    handleVerificarSKU(e);
  };

  const handleChipClick = (term) => {
    setSkuSearch(term);
    adicionarBuscaRecente(term);
  };

  const handleUsar = async (categoria, id, cantidad, sku) => {
    if (!handleUsarEstoque) return;
    const key = `${categoria}-${id}`;
    setSubmittingId(key);
    const res = await handleUsarEstoque(categoria, id, cantidad);
    setSubmittingId(null);

    if (res.success) {
      showToast('success', res.message || `Baixa de ${cantidad} un. em ${sku} realizada com sucesso!`);
    } else {
      showToast('error', res.message || 'Erro ao realizar baixa no estoque.');
    }
  };

  const pecas = verificacaoResult?.pecas || [];
  const estampas = verificacaoResult?.estampas || [];
  const totalItems = (pecas.length + estampas.length);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all max-w-md text-xs sm:text-sm font-semibold ${
          toast.type === 'success'
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
            : 'bg-rose-900 text-rose-100 border-rose-700 dark:bg-rose-950 dark:text-rose-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Verificador & Consumo de Estoque
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Filtre por marca, tipo ou cor, ou busque por código de estampa, nome do design ou SKU.
        </p>
      </div>

      {/* Integrated Search Toolbar & Segmented Controls */}
      <div className="p-2 sm:p-2.5 bg-slate-200/70 dark:bg-slate-900/90 border border-slate-300/80 dark:border-slate-800 rounded-3xl shadow-lg space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2 max-w-4xl mx-auto">
        
        {/* GRUPO MARCA (Segmented Control) */}
        <div className="flex items-center bg-slate-300/50 dark:bg-slate-950 p-1 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setVerificadorBrand && setVerificadorBrand('CR')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              verificadorBrand === 'CR'
                ? 'bg-red-950/40 text-red-500 border border-red-600/50 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            CR
          </button>
          <button
            type="button"
            onClick={() => setVerificadorBrand && setVerificadorBrand('RN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              verificadorBrand === 'RN'
                ? 'bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            RN
          </button>
        </div>

        {/* GRUPO TIPO (Segmented Control) */}
        <div className="flex items-center bg-slate-300/50 dark:bg-slate-950 p-1 rounded-2xl shrink-0">
          {['CM', 'CF', 'MO'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setVerificadorTipo && setVerificadorTipo(t)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                verificadorTipo === t
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* SELECTOR DE COLOR VISUAL */}
        <ColorPickerDropdown
          value={verificadorCor}
          onChange={(newCor) => setVerificadorCor && setVerificadorCor(newCor)}
        />

        {/* INPUT DE BÚSQUEDA & BOTÓN */}
        <form id="form-buscar" onSubmit={onSubmitForm} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="sku-search-input"
              aria-label="Buscar estampa ou SKU"
              type="text"
              value={skuSearch}
              onChange={(e) => setSkuSearch(e.target.value)}
              placeholder="Buscar estampa (ex: 001, liver) ou SKU..."
              className="w-full pl-10 pr-3 py-2 sm:py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={verificando}
            className="px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
          >
            {verificando ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Verificar'}
          </button>
        </form>
      </div>

      {/* Recent Searches Chips */}
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

      {/* Search Results Display */}
      {verificacaoResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {totalItems > 0 ? `${totalItems} variante(s) encontrada(s)` : 'Resultado da consulta'}
            </h3>
            {verificacaoResult.termo_busca && (
              <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                Termo: "{verificacaoResult.termo_busca}"
              </span>
            )}
          </div>

          {totalItems === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <XCircle className="w-10 h-10 text-rose-500 mx-auto opacity-80" />
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Nenhum item encontrado
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Não encontramos peças prontas ou estampas avulsas correspondentes aos filtros ativos.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Peças Prontas Variants */}
              {pecas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
                    <Shirt className="w-4 h-4 text-indigo-500" />
                    <span>Peças Prontas ({pecas.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pecas.map((item) => (
                      <ItemVariantCard
                        key={`peca-${item.id}`}
                        item={item}
                        onUsar={handleUsar}
                        isSubmitting={submittingId === `peca-${item.id}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Estampas Avulsas Variants */}
              {estampas.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>Estampas Avulsas ({estampas.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {estampas.map((item) => (
                      <ItemVariantCard
                        key={`estampa-${item.id}`}
                        item={item}
                        onUsar={handleUsar}
                        isSubmitting={submittingId === `estampa-${item.id}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
