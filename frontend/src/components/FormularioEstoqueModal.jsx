import React, { useEffect } from 'react';
import { generateSku } from '../utils/sku';

export default function FormularioEstoqueModal({
  showModal,
  setShowModal,
  modalType,
  formData,
  setFormData,
  brands,
  handleSalvarModal,
  isSubmitting
}) {
  useEffect(() => {
    if (showModal && modalType === 'peca') {
      const calculated = generateSku(formData, brands);
      if (formData.sku !== calculated) {
        setFormData(prev => ({ ...prev, sku: calculated }));
      }
    }
  }, [showModal, modalType, formData.brand_id, formData.tipo, formData.codigo_estampa, formData.cor, formData.tamanho, brands]);

  if (!showModal) return null;

  const isEditing = Boolean(formData.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-bold">
          {isEditing
            ? (modalType === 'peca' ? 'Editar Peça Pronta' : 'Editar Estampa Avulsa')
            : (modalType === 'peca' ? 'Cadastrar Peça Pronta' : 'Cadastrar Estampa Avulsa')}
        </h3>
        
        <form onSubmit={handleSalvarModal} className="space-y-3.5 text-xs font-medium">
          
          <div>
            <label htmlFor="modal-brand-select" className="block text-slate-500 mb-1">Marca</label>
            <select
              id="modal-brand-select"
              value={formData.brand_id || ''}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
              className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
              required
            >
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {modalType === 'peca' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-tipo-select" className="block text-slate-500 mb-1">Tipo de Peça</label>
                  <select
                    id="modal-tipo-select"
                    value={formData.tipo || 'CM'}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="CM">CM (Camisa Masc)</option>
                    <option value="CF">CF (Camisa Fem)</option>
                    <option value="MO">MO (Moletom)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="modal-codigo-estampa-peca" className="block text-slate-500 mb-1">Cód. Estampa</label>
                  <input
                    id="modal-codigo-estampa-peca"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Ex: 001"
                    value={formData.codigo_estampa || ''}
                    onChange={(e) => setFormData({ ...formData, codigo_estampa: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="modal-cor-peca" className="block text-slate-500 mb-1">Cor</label>
                  <select
                    id="modal-cor-peca"
                    value={formData.cor || 'PRE'}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="PRE">PRE (Preto)</option>
                    <option value="BRA">BRA (Branca)</option>
                    <option value="AMA">AMA (Amarelo)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="modal-tamanho-peca" className="block text-slate-500 mb-1">Tamanho</label>
                  <select
                    id="modal-tamanho-peca"
                    value={formData.tamanho || 'M'}
                    onChange={(e) => setFormData({ ...formData, tamanho: e.target.value })}
                    className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    {['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'G4'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-quantidade" className="block text-slate-500 mb-1">Quantidade Inicial</label>
                <input
                  id="modal-quantidade"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={formData.quantidade ?? ''}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, quantidade: onlyNums === '' ? '' : parseInt(onlyNums, 10) });
                  }}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="modal-sku-peca" className="block text-slate-500 mb-1">SKU Gerado</label>
                <input
                  id="modal-sku-peca"
                  type="text"
                  placeholder="Ex: CR-CM-001-PRE-M"
                  value={generateSku(formData, brands)}
                  readOnly
                  className="w-full p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 text-xs cursor-not-allowed opacity-90"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="modal-codigo-estampa" className="block text-slate-500 mb-1">Código Estampa (NUM-COR)</label>
                <input
                  id="modal-codigo-estampa"
                  type="text"
                  placeholder="Ex: 005-PRE"
                  value={formData.codigo_estampa || ''}
                  onChange={(e) => setFormData({ ...formData, codigo_estampa: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-nome-design" className="block text-slate-500 mb-1">Nome do Design</label>
                <input
                  id="modal-nome-design"
                  type="text"
                  placeholder="Ex: Caveira Heavy Metal"
                  value={formData.nome_design || ''}
                  onChange={(e) => setFormData({ ...formData, nome_design: e.target.value })}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  required
                />
              </div>
              <div>
                <label htmlFor="modal-cor-estampa" className="block text-slate-500 mb-1">Cor</label>
                <select
                  id="modal-cor-estampa"
                  value={formData.cor || 'PRE'}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <option value="PRE">PRE (Preto)</option>
                  <option value="BRA">BRA (Branca)</option>
                  <option value="AMA">AMA (Amarelo)</option>
                </select>
              </div>

              <div>
                <label htmlFor="modal-quantidade" className="block text-slate-500 mb-1">Quantidade Inicial</label>
                <input
                  id="modal-quantidade"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  value={formData.quantidade ?? ''}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, quantidade: onlyNums === '' ? '' : parseInt(onlyNums, 10) });
                  }}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? (isEditing ? 'Atualizando...' : 'Salvar...') : (isEditing ? 'Atualizar' : 'Salvar')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
