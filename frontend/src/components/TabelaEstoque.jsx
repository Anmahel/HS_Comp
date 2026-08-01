import React from 'react';
import TabelaPecasProntas from './TabelaPecasProntas';
import TabelaEstampas from './TabelaEstampas';

export default function TabelaEstoque({
  activeTab,
  pecasProntas,
  estampas,
  handleAjustarQtdPeca,
  handleAjustarQtdEstampa,
  handleDeletarPeca,
  handleDeletarEstampa,
  onOpenModalPeca,
  onOpenModalEstampa,
  onEditPeca
}) {
  if (activeTab === 'pecas') {
    return (
      <TabelaPecasProntas
        pecasProntas={pecasProntas}
        handleAjustarQtdPeca={handleAjustarQtdPeca}
        handleDeletarPeca={handleDeletarPeca}
        onOpenModal={onOpenModalPeca}
        onEditPeca={onEditPeca}
      />
    );
  }

  if (activeTab === 'estampas') {
    return (
      <TabelaEstampas
        estampas={estampas}
        handleAjustarQtdEstampa={handleAjustarQtdEstampa}
        handleDeletarEstampa={handleDeletarEstampa}
        onOpenModal={onOpenModalEstampa}
      />
    );
  }

  return null;
}
