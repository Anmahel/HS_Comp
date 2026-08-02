import React from 'react';

export default function FormularioPecaFields({
  formData,
  setFormData,
  handleCodigoEstampaChange,
  handleNomeDesignChange,
  generatedSku
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="modal-tipo-select" className="block text-slate-500 mb-1">Tipo de Peça</label>
          <select
            id="modal-tipo-select"
            value={formData.tipo || 'CM'}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
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
            list="codigo-estampa-list"
            placeholder="Ex: 001"
            value={formData.codigo_estampa || ''}
            onChange={(e) => handleCodigoEstampaChange(e.target.value)}
            className="w-full p-2.5 sm:p-3 border rounded-xl font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="modal-nome-design-peca" className="block text-slate-500 mb-1">
          Nome do Design <span className="text-rose-500">*</span>
        </label>
        <input
          id="modal-nome-design-peca"
          type="text"
          list="nome-design-list"
          placeholder="Ex: Caveira Rocker Classic"
          value={formData.nome_design || ''}
          onChange={(e) => handleNomeDesignChange(e.target.value)}
          className="w-full p-2.5 sm:p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="modal-cor-peca" className="block text-slate-500 mb-1">Cor</label>
          <select
            id="modal-cor-peca"
            value={formData.cor || 'PRE'}
            onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, tamanho: e.target.value }))}
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
            setFormData(prev => ({ ...prev, quantidade: onlyNums === '' ? '' : parseInt(onlyNums, 10) }));
          }}
          className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label htmlFor="modal-sku-peca" className="block text-slate-500 mb-1">SKU Gerado</label>
        <input
          id="modal-sku-peca"
          type="text"
          placeholder="Ex: CR-CM-001-PRE-M"
          value={generatedSku || ''}
          readOnly
          className="w-full p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 text-xs cursor-not-allowed opacity-90"
        />
      </div>
    </>
  );
}
