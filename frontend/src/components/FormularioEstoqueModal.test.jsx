import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormularioEstoqueModal from './FormularioEstoqueModal';

describe('FormularioEstoqueModal Component', () => {
  const mockBrands = [
    { id: 1, name: 'Clube Rock', slug: 'clube-rock' },
    { id: 2, name: 'Ride Nation', slug: 'ride-nation' }
  ];

  it('does not render when showModal is false', () => {
    const { container } = render(
      <FormularioEstoqueModal
        showModal={false}
        setShowModal={vi.fn()}
        modalType="peca"
        formData={{}}
        setFormData={vi.fn()}
        brands={mockBrands}
        handleSalvarModal={vi.fn()}
        isSubmitting={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal inputs, confirmation step and triggers submit', () => {
    const handleSalvarModal = vi.fn((e) => e.preventDefault());

    render(
      <FormularioEstoqueModal
        showModal={true}
        setShowModal={vi.fn()}
        modalType="peca"
        formData={{ brand_id: 1, tipo: 'CM', codigo_estampa: '001', nome_design: 'Caveira Rocker Classic', cor: 'PRE', tamanho: 'M', quantidade: 5 }}
        setFormData={vi.fn()}
        brands={mockBrands}
        handleSalvarModal={handleSalvarModal}
        isSubmitting={false}
      />
    );

    expect(screen.getByText('Cadastrar Peça Pronta')).toBeInTheDocument();
    expect(screen.getByLabelText('Marca')).toBeInTheDocument();
    expect(screen.getByLabelText('Cód. Estampa')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantidade Inicial')).toBeInTheDocument();
    expect(screen.getByLabelText('SKU Gerado')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: 'Salvar' });
    expect(submitBtn).toBeInTheDocument();

    // Click submit button to open confirmation modal
    fireEvent.click(submitBtn);

    // Confirmation modal should be visible
    expect(screen.getByText('Confirmar Cadastro')).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: 'Confirmar' });
    expect(confirmBtn).toBeInTheDocument();

    // Click confirm button to execute save
    fireEvent.click(confirmBtn);
    expect(handleSalvarModal).toHaveBeenCalledTimes(1);
  });

  it('handles input filtering for Cód. Estampa and Quantidade', () => {
    const setFormData = vi.fn();

    render(
      <FormularioEstoqueModal
        showModal={true}
        setShowModal={vi.fn()}
        modalType="peca"
        formData={{ codigo_estampa: '', quantidade: '' }}
        setFormData={setFormData}
        brands={mockBrands}
        handleSalvarModal={vi.fn()}
        isSubmitting={false}
      />
    );

    const estampaInput = screen.getByLabelText('Cód. Estampa');
    fireEvent.change(estampaInput, { target: { value: '001' } });

    expect(setFormData).toHaveBeenCalled();
  });
});
