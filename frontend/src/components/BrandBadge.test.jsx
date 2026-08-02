import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrandBadge from './BrandBadge';

describe('BrandBadge Component', () => {
  it('renders Clube Rock badge with CR abbreviation and red theme', () => {
    render(<BrandBadge brandName="Clube Rock" />);
    const badge = screen.getByText('CR');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-red-500');
  });

  it('renders Ride Nation badge with RN abbreviation and slate theme', () => {
    render(<BrandBadge brandName="Ride Nation" />);
    const badge = screen.getByText('RN');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('text-slate-100');
  });

  it('renders fallback badge abbreviation for unknown brand', () => {
    render(<BrandBadge brandName="Marca Exemplo" />);
    const badge = screen.getByText('ME');
    expect(badge).toBeInTheDocument();
  });
});
