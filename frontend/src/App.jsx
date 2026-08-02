import React from 'react';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import BuscaSKU from './components/BuscaSKU';
import TabelaEstoque from './components/TabelaEstoque';
import FormularioEstoque from './components/FormularioEstoque';
import Footer from './components/Footer';
import { useEstoque } from './hooks/useEstoque';

export default function App() {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    brands,
    selectedBrand,
    setSelectedBrand,
    estampas,
    pecasProntas,
    designs,
    skuSearch,
    setSkuSearch,
    verificadorBrand,
    setVerificadorBrand,
    verificadorCor,
    setVerificadorCor,
    verificadorTipo,
    setVerificadorTipo,
    verificacaoResult,
    verificando,
    handleVerificarSKU,
    handleUsarEstoque,
    showModal,
    setShowModal,
    modalType,
    formData,
    setFormData,
    isSubmitting,
    handleAjustarQtdPeca,
    handleAjustarQtdEstampa,
    handleDeletarPeca,
    handleDeletarEstampa,
    handleOpenModalPeca,
    handleOpenModalEditPeca,
    handleOpenModalEstampa,
    handleOpenModalEditEstampa,
    handleSalvarModal
  } = useEstoque();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* HEADER */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        brands={brands}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />

      {/* NAVIGATION TABS */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pecasCount={pecasProntas.length}
        estampasCount={estampas.length}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {activeTab === 'verificador' && (
          <BuscaSKU
            skuSearch={skuSearch}
            setSkuSearch={setSkuSearch}
            verificadorBrand={verificadorBrand}
            setVerificadorBrand={setVerificadorBrand}
            verificadorCor={verificadorCor}
            setVerificadorCor={setVerificadorCor}
            verificadorTipo={verificadorTipo}
            setVerificadorTipo={setVerificadorTipo}
            handleVerificarSKU={handleVerificarSKU}
            handleUsarEstoque={handleUsarEstoque}
            verificando={verificando}
            verificacaoResult={verificacaoResult}
          />
        )}

        {(activeTab === 'pecas' || activeTab === 'estampas') && (
          <TabelaEstoque
            activeTab={activeTab}
            pecasProntas={pecasProntas}
            estampas={estampas}
            handleAjustarQtdPeca={handleAjustarQtdPeca}
            handleAjustarQtdEstampa={handleAjustarQtdEstampa}
            handleDeletarPeca={handleDeletarPeca}
            handleDeletarEstampa={handleDeletarEstampa}
            onOpenModalPeca={handleOpenModalPeca}
            onOpenModalEstampa={handleOpenModalEstampa}
            onEditPeca={handleOpenModalEditPeca}
            onEditEstampa={handleOpenModalEditEstampa}
          />
        )}
      </main>

      {/* MODAL DE CADASTRO */}
      <FormularioEstoque
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
        brands={brands}
        pecasProntas={pecasProntas}
        estampas={estampas}
        designs={designs}
        handleSalvarModal={handleSalvarModal}
        isSubmitting={isSubmitting}
      />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}
