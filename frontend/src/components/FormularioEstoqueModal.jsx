import React, { useState, useMemo } from 'react';
import { generateSku } from '../utils/sku';
import ConfirmacaoEstoqueModal from './ConfirmacaoEstoqueModal';
import FormularioPecaFields from './FormularioPecaFields';
import FormularioEstampaFields from './FormularioEstampaFields';

const EMPTY_ARRAY = [];

export default function FormularioEstoqueModal({
  showModal,
  setShowModal,
  modalType,
  formData,
  setFormData,
  brands = EMPTY_ARRAY,
  pecasProntas = EMPTY_ARRAY,
  estampas = EMPTY_ARRAY,
  designs = EMPTY_ARRAY,
  handleSalvarModal,
  isSubmitting
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Mapeamento bidirecional Cód. Estampa <-> Nome do Design a partir do catálogo e inventário
  const catalogMaps = useMemo(() => {
    const codeToDesign = {};
    const nameToDesign = {};
    const codeList = new Set();
    const nameList = new Set();

    (designs || []).forEach(d => {
      const code = d.codigo_estampa || d.Cod_Estampa ? String(d.codigo_estampa || d.Cod_Estampa).trim() : '';
      const name = d.nome_design ? d.nome_design.trim() : '';
      if (code) {
        codeToDesign[code.toUpperCase()] = d;
        codeToDesign[code] = d;
        codeList.add(code);
      }
      if (name) {
        nameToDesign[name.toLowerCase()] = d;
        nameList.add(name);
      }
    });

    [...(pecasProntas || []), ...(estampas || [])].forEach(item => {
      const code = item.codigo_estampa ? String(item.codigo_estampa).trim() : '';
      const name = item.nome_design ? item.nome_design.trim() : '';
      if (code && !codeToDesign[code.toUpperCase()]) {
        const obj = { nome_design: name, codigo_estampa: code };
        codeToDesign[code.toUpperCase()] = obj;
        codeToDesign[code] = obj;
        codeList.add(code);
      }
      if (name && !nameToDesign[name.toLowerCase()]) {
        const obj = { nome_design: name, codigo_estampa: code };
        nameToDesign[name.toLowerCase()] = obj;
        nameList.add(name);
      }
    });

    return {
      codeToDesign,
      nameToDesign,
      codeList: Array.from(codeList),
      nameList: Array.from(nameList)
    };
  }, [designs, pecasProntas, estampas]);

  if (!showModal) return null;

  const isEditing = Boolean(formData.id);

  const handleCodigoEstampaChange = (val) => {
    const upperVal = val.toUpperCase();
    const match = catalogMaps.codeToDesign[upperVal] || catalogMaps.codeToDesign[val];
    
    setFormData(prev => ({
      ...prev,
      codigo_estampa: upperVal,
      nome_design: match?.nome_design ? match.nome_design : prev.nome_design
    }));
  };

  const handleNomeDesignChange = (val) => {
    const lowerVal = val.toLowerCase().trim();
    const match = catalogMaps.nameToDesign[lowerVal];

    setFormData(prev => ({
      ...prev,
      nome_design: val,
      codigo_estampa: match?.codigo_estampa ? String(match.codigo_estampa) : prev.codigo_estampa
    }));
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async (e) => {
    setShowConfirmModal(false);
    await handleSalvarModal(e);
  };

  const selectedBrand = brands.find(b => String(b.id) === String(formData.brand_id)) || brands[0];
  const generatedSku = modalType === 'peca' ? generateSku(formData, brands) : null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <h3 className="text-base sm:text-lg font-bold">
            {isEditing
              ? (modalType === 'peca' ? 'Editar Peça Pronta' : 'Editar Estampa Avulsa')
              : (modalType === 'peca' ? 'Cadastrar Peça Pronta' : 'Cadastrar Estampa Avulsa')}
          </h3>
          
          <form onSubmit={handlePreSubmit} className="space-y-3.5 text-xs font-medium">
            <datalist id="codigo-estampa-list">
              {catalogMaps.codeList.map(c => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <datalist id="nome-design-list">
              {catalogMaps.nameList.map(n => (
                <option key={n} value={n} />
              ))}
            </datalist>

            <div>
              <label htmlFor="modal-brand-select" className="block text-slate-500 mb-1">Marca</label>
              <select
                id="modal-brand-select"
                value={formData.brand_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, brand_id: e.target.value }))}
                className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                required
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {modalType === 'peca' ? (
              <FormularioPecaFields
                formData={formData}
                setFormData={setFormData}
                handleCodigoEstampaChange={handleCodigoEstampaChange}
                handleNomeDesignChange={handleNomeDesignChange}
                generatedSku={generatedSku}
              />
            ) : (
              <FormularioEstampaFields
                formData={formData}
                setFormData={setFormData}
                handleCodigoEstampaChange={handleCodigoEstampaChange}
                handleNomeDesignChange={handleNomeDesignChange}
              />
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-colors"
              >
                {isSubmitting ? (isEditing ? 'Atualizando...' : 'Salvar...') : (isEditing ? 'Atualizar' : 'Salvar')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmacaoEstoqueModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        isEditing={isEditing}
        modalType={modalType}
        generatedSku={generatedSku}
        selectedBrand={selectedBrand}
        formData={formData}
        handleConfirmSave={handleConfirmSave}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
