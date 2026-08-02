import React from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import BrandBadge from './BrandBadge';

export default function TabelaPecasProntas({
  pecasProntas = [],
  handleAjustarQtdPeca,
  handleDeletarPeca,
  onOpenModal,
  onEditPeca
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Estoque de Peças Prontas</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Camisetas e moletons já estampados e prontos para envio.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Nova Peça Pronta
        </button>
      </div>

      {/* Data Table Scrollable */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-3.5">SKU Completo</th>
                <th className="px-4 sm:px-6 py-3.5">Tipo</th>
                <th className="px-4 sm:px-6 py-3.5">Estampa</th>
                <th className="px-4 sm:px-6 py-3.5">Tamanho</th>
                <th className="px-4 sm:px-6 py-3.5">Marca</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Estoque</th>
                <th className="px-4 sm:px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {pecasProntas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    Nenhuma peça pronta cadastrada para esta seleção.
                  </td>
                </tr>
              ) : (
                pecasProntas.map((peca) => (
                  <tr key={peca.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {peca.sku}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {peca.tipo || peca.tipo_codigo}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {peca.nome_design || `Estampa ${peca.codigo_estampa}`}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className="font-bold">{peca.tamanho}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <BrandBadge brandName={peca.brand_name} />
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-center font-bold text-sm">
                      <span className={peca.quantidade === 0 ? 'text-rose-500 font-extrabold' : 'text-slate-900 dark:text-white'}>
                        {peca.quantidade}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Editar peça pronta"
                          onClick={() => onEditPeca && onEditPeca(peca)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Deletar peça pronta"
                          onClick={() => handleDeletarPeca(peca.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
