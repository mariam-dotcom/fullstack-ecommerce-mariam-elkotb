import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { BasketProvider } from '../context/BasketContext';
import Shop from '../pages/Shop';

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

describe('Shop page', () => {
  it('renders items returned by the mocked API', async () => {
    renderWithProviders(<Shop />);

    expect(await screen.findByText('Weighted Desk Lamp')).toBeInTheDocument();
    expect(screen.getByText('Canvas Field Bag')).toBeInTheDocument();
  });

  it('shows a low-stock indicator for scarce items', async () => {
    renderWithProviders(<Shop />);

    expect(await screen.findByText('2 left')).toBeInTheDocument();
  });
});
