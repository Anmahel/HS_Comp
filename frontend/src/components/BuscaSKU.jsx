import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import FormVerificador from './FormVerificador';
import PecasProntasList from './PecasProntasList';
import EstampasAvulsasList from './EstampasAvulsasList';

export default function BuscaSKU({
  skuSearch,
  setSkuSearch,
  verificadorBrand = 'CR',
  setVerificadorBrand,
  verificadorCor = 'PRE',
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 transition-colors max-w-md text-xs sm:text-sm font-semibold ${
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
            aria-label="Fechar notificação"
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Search Form Subcomponent */}
        <div className="w-full lg:col-span-4 lg:sticky lg:top-6 space-y-4">
          <FormVerificador
            skuSearch={skuSearch}
            setSkuSearch={setSkuSearch}
            verificadorBrand={verificadorBrand}
            setVerificadorBrand={setVerificadorBrand}
            verificadorCor={verificadorCor}
            setVerificadorCor={setVerificadorCor}
            verificadorTipo={verificadorTipo}
            setVerificadorTipo={setVerificadorTipo}
            onSubmitForm={onSubmitForm}
            verificando={verificando}
            buscasRecentes={buscasRecentes}
            handleChipClick={handleChipClick}
          />
        </div>

        {/* RIGHT COLUMN: Search Results Subcomponents */}
        <div className="w-full lg:col-span-8 space-y-6">
          {verificacaoResult && (
            <div className="space-y-6">

              {totalItems === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
                  <XCircle className="w-10 h-10 text-rose-500 mx-auto opacity-80" />
                  <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                    Nenhum item encontrado
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Não encontramos peças prontas ou estampas avulsas correspondentes aos filtros activos.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <PecasProntasList pecas={pecas} onUsar={handleUsar} submittingId={submittingId} />
                  <EstampasAvulsasList estampas={estampas} onUsar={handleUsar} submittingId={submittingId} />
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
