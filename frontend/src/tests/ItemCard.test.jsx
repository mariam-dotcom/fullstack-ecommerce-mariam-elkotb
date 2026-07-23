import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { BasketProvider } from '../context/BasketContext';
import ItemCard from '../components/ItemCard';

const sampleItem = {
  id: 1,
  title: 'Slim Cardholder Wallet',
  summary: 'Holds up to 8 cards.',
  priceCents: 2400,
  stockCount: 3,
  collection: { name: 'Everyday Carry' },
};

function renderWithProviders(ui) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <BasketProvider>{ui}</BasketProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('ItemCard', () => {
  it('renders the title, formatted price, and collection', () => {
    renderWithProviders(<ItemCard item={sampleItem} />);

    expect(screen.getByText('Slim Cardholder Wallet')).toBeInTheDocument();
    expect(screen.getByText('$24.00')).toBeInTheDocument();
    expect(screen.getByText('Everyday Carry')).toBeInTheDocument();
  });

  it('flags items with low stock', () => {
    renderWithProviders(<ItemCard item={sampleItem} />);

    expect(screen.getByText('3 left')).toBeInTheDocument();
  });
});