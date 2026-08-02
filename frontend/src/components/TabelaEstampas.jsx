import React from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import BrandBadge from './BrandBadge';

export default function TabelaEstampas({
  estampas,
  handleAjustarQtdEstampa,
  handleDeletarEstampa,
  onOpenModal,
  onEditEstampa
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold">Estoque de Estampas Avulsas</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estampas individuais (formato NUM-COR) estocadas para aplicação rápida sob demanda.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Nova Estampa
        </button>
      </div>

      {/* Data Table Scrollable */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-3.5">Código Estampa</th>
                <th className="px-4 sm:px-6 py-3.5">Nome do Design</th>
                <th className="px-4 sm:px-6 py-3.5">Cor</th>
                <th className="px-4 sm:px-6 py-3.5">Marca</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Qtd Disponível</th>
                <th className="px-4 sm:px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {estampas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    Nenhuma estampa cadastrada para esta seleção.
                  </td>
                </tr>
              ) : (
                estampas.map((estampa) => (
                  <tr key={estampa.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {estampa.codigo_estampa}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-900 dark:text-white font-semibold">
                      {estampa.nome_design}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">{estampa.cor}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <BrandBadge brandName={estampa.brand_name} />
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-center font-bold text-sm">
                      <span className={estampa.quantidade === 0 ? 'text-rose-500 font-extrabold' : 'text-slate-900 dark:text-white'}>
                        {estampa.quantidade}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Editar estampa"
                          onClick={() => onEditEstampa && onEditEstampa(estampa)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Deletar estampa"
                          onClick={() => handleDeletarEstampa(estampa.id)}
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
