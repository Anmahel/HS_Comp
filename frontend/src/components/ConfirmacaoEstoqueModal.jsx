import React from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ConfirmacaoEstoqueModal({
  showConfirmModal,
  setShowConfirmModal,
  isEditing,
  modalType,
  generatedSku,
  selectedBrand,
  formData,
  handleConfirmSave,
  isSubmitting
}) {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <CheckCircle2 className="w-6 h-6" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Confirmar Atualização' : 'Confirmar Cadastro'}
          </h4>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Revise os dados antes de registrar no sistema. Se o item já existir, o estoque será somado automaticamente.
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          {modalType === 'peca' && (
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">SKU:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{generatedSku}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-slate-400">Marca:</span>
            <span className="font-bold text-slate-900 dark:text-white">{selectedBrand?.name || 'Clube Rock'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Design:</span>
            <span className="font-bold text-slate-900 dark:text-white">{formData.nome_design || 'Design Padrão'}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Cód. Estampa:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formData.codigo_estampa || '-'}</span>
          </div>

          {modalType === 'peca' && (
            <div className="flex justify-between">
              <span className="text-slate-400">Cor / Tamanho:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formData.cor || 'PRE'} / {formData.tamanho || 'M'}</span>
            </div>
          )}

          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Qtd. a Adicionar:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">+{formData.quantidade ?? 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setShowConfirmModal(false)}
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ajustar
          </button>
          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
