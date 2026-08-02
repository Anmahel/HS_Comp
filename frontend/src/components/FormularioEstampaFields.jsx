import React from 'react';

export default function FormularioEstampaFields({
  formData,
  setFormData,
  handleCodigoEstampaChange,
  handleNomeDesignChange
}) {
  return (
    <>
      <div>
        <label htmlFor="modal-codigo-estampa" className="block text-slate-500 mb-1">Código Estampa</label>
        <input
          id="modal-codigo-estampa"
          type="text"
          list="codigo-estampa-list"
          placeholder="Ex: 005"
          value={formData.codigo_estampa || ''}
          onChange={(e) => handleCodigoEstampaChange(e.target.value)}
          className="w-full p-2.5 sm:p-3 border rounded-xl font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
          required
        />
      </div>

      <div>
        <label htmlFor="modal-nome-design" className="block text-slate-500 mb-1">
          Nome do Design <span className="text-rose-500">*</span>
        </label>
        <input
          id="modal-nome-design"
          type="text"
          list="nome-design-list"
          placeholder="Ex: Caveira Heavy Metal"
          value={formData.nome_design || ''}
          onChange={(e) => handleNomeDesignChange(e.target.value)}
          className="w-full p-2.5 sm:p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-colors bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
          required
        />
      </div>

      <div>
        <label htmlFor="modal-cor-estampa" className="block text-slate-500 mb-1">Cor</label>
        <select
          id="modal-cor-estampa"
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
    </>
  );
}
