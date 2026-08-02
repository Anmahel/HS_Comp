import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BuscaSKU from './BuscaSKU';

describe('BuscaSKU Component', () => {
  const mockResult = {
    termo_busca: '001',
    pecas: [
      {
        id: 1,
        categoria: 'peca',
        sku: 'CR-CM-001-PRE-M',
        tipo: 'CM',
        codigo_estampa: '001',
        nome_design: 'Caveira Rocker',
        cor: 'PRE',
        tamanho: 'M',
        brand_name: 'Clube Rock',
        quantidade: 4,
        status_code: 'PRONTO',
        status_label: 'Pronto para Envio',
        badge_color: 'emerald'
      }
    ],
    estampas: []
  };

  it('renders search form and filters', () => {
    render(
      <BuscaSKU
        skuSearch="001"
        setSkuSearch={vi.fn()}
        verificadorBrand="CR"
        setVerificadorBrand={vi.fn()}
        verificadorCor="PRE"
        setVerificadorCor={vi.fn()}
        verificadorTipo="CM"
        setVerificadorTipo={vi.fn()}
        handleVerificarSKU={vi.fn()}
        handleUsarEstoque={vi.fn()}
        verificando={false}
        verificacaoResult={null}
      />
    );

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByLabelText('Selecionar Marca Clube Rock (CR)')).toBeInTheDocument();
    expect(screen.getByLabelText('Selecionar Marca Ride Nation (RN)')).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar por código de estampa ou SKU')).toBeInTheDocument();
  });

  it('calls setVerificadorBrand when brand filter button is clicked', () => {
    const setVerificadorBrand = vi.fn();
    render(
      <BuscaSKU
        skuSearch="001"
        setSkuSearch={vi.fn()}
        verificadorBrand="CR"
        setVerificadorBrand={setVerificadorBrand}
        verificadorCor="PRE"
        setVerificadorCor={vi.fn()}
        verificadorTipo="CM"
        setVerificadorTipo={vi.fn()}
        handleVerificarSKU={vi.fn()}
        handleUsarEstoque={vi.fn()}
        verificando={false}
        verificacaoResult={null}
      />
    );

    const rnButton = screen.getByLabelText('Selecionar Marca Ride Nation (RN)');
    fireEvent.click(rnButton);
    expect(setVerificadorBrand).toHaveBeenCalledWith('RN');
  });

  it('renders search results when verificacaoResult is provided', () => {
    render(
      <BuscaSKU
        skuSearch="001"
        setSkuSearch={vi.fn()}
        verificadorBrand="CR"
        setVerificadorBrand={vi.fn()}
        verificadorCor="PRE"
        setVerificadorCor={vi.fn()}
        verificadorTipo="CM"
        setVerificadorTipo={vi.fn()}
        handleVerificarSKU={vi.fn()}
        handleUsarEstoque={vi.fn()}
        verificando={false}
        verificacaoResult={mockResult}
      />
    );

    expect(screen.getByText('CR-CM-001-PRE-M')).toBeInTheDocument();
    expect(screen.getByText('Caveira Rocker')).toBeInTheDocument();
    expect(screen.getByText('Pronto para Envio')).toBeInTheDocument();
  });

  it('triggers handleUsarEstoque when Usar/Dar Baixa button is clicked', async () => {
    const handleUsarEstoque = vi.fn().mockResolvedValue({ success: true, message: 'Sucesso' });

    render(
      <BuscaSKU
        skuSearch="001"
        setSkuSearch={vi.fn()}
        verificadorBrand="CR"
        setVerificadorBrand={vi.fn()}
        verificadorCor="PRE"
        setVerificadorCor={vi.fn()}
        verificadorTipo="CM"
        setVerificadorTipo={vi.fn()}
        handleVerificarSKU={vi.fn()}
        handleUsarEstoque={handleUsarEstoque}
        verificando={false}
        verificacaoResult={mockResult}
      />
    );

    const usarBtn = screen.getByRole('button', { name: /Dar baixa de 1 unidades no item CR-CM-001-PRE-M/i });
    expect(usarBtn).toBeInTheDocument();

    fireEvent.click(usarBtn);
    expect(handleUsarEstoque).toHaveBeenCalledWith('peca', 1, 1);
  });
});
