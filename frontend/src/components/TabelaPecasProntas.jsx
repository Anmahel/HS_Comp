import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TabelaPecasProntas({
  pecasProntas,
  handleAjustarQtdPeca,
  handleDeletarPeca,
  onOpenModal
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
                <th className="px-4 sm:px-6 py-3.5">Cód. Estampa</th>
                <th className="px-4 sm:px-6 py-3.5">Cor</th>
                <th className="px-4 sm:px-6 py-3.5">Tamanho</th>
                <th className="px-4 sm:px-6 py-3.5">Marca</th>
                <th className="px-4 sm:px-6 py-3.5">Qtd Estoque</th>
                <th className="px-4 sm:px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {pecasProntas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
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
                        {peca.tipo}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {peca.codigo_estampa}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">{peca.cor}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className="font-bold">{peca.tamanho}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-slate-500">{peca.brand_name}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade de peça pronta"
                          onClick={() => handleAjustarQtdPeca(peca.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className={`w-8 text-center font-bold text-sm ${peca.quantidade === 0 ? 'text-rose-500' : ''}`}>
                          {peca.quantidade}
                        </span>
                        <button
                          type="button"
                          aria-label="Aumentar quantidade de peça pronta"
                          onClick={() => handleAjustarQtdPeca(peca.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <button
                        type="button"
                        aria-label="Deletar peça pronta"
                        onClick={() => handleDeletarPeca(peca.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
