import React from 'react';

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
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-bold">
          {modalType === 'peca' ? 'Cadastrar Peça Pronta' : 'Cadastrar Estampa Avulsa'}
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
                  <label htmlFor="modal-codigo-estampa-peca" className="block text-slate-500 mb-1">Cód. Estampa (NUM-COR)</label>
                  <input
                    id="modal-codigo-estampa-peca"
                    type="text"
                    placeholder="Ex: 001-PRE"
                    value={formData.codigo_estampa || ''}
                    onChange={(e) => setFormData({ ...formData, codigo_estampa: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase"
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
                <label htmlFor="modal-sku-peca" className="block text-slate-500 mb-1">SKU Gerado</label>
                <input
                  id="modal-sku-peca"
                  type="text"
                  placeholder="Ex: CM-001-PRE-M"
                  value={formData.sku || `${formData.tipo || 'CM'}-${formData.codigo_estampa || '001-PRE'}-${formData.tamanho || 'M'}`}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 text-xs"
                  required
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
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase"
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
            </>
          )}

          <div>
            <label htmlFor="modal-quantidade" className="block text-slate-500 mb-1">Quantidade Inicial</label>
            <input
              id="modal-quantidade"
              type="number"
              min="0"
              value={formData.quantidade ?? 0}
              onChange={(e) => {
                const val = e.target.value;
                const parsedVal = val !== '' ? Math.max(0, parseInt(val, 10) || 0) : '';
                setFormData({ ...formData, quantidade: parsedVal });
              }}
              className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
              required
            />
          </div>

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
              {isSubmitting ? 'Salvar...' : 'Salvar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
