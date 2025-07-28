import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CarValuationForm } from '@/components/car-valuation/car-valuation-form';
import { CarValuationService } from '@/lib/services/car-valuation';

// Mock the service
jest.mock('@/lib/services/car-valuation');
const mockCarValuationService = CarValuationService as jest.Mocked<typeof CarValuationService>;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CarValuationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render initial form step', () => {
    renderWithQueryClient(<CarValuationForm />);
    
    expect(screen.getByText('Valoración de Vehículo')).toBeInTheDocument();
    expect(screen.getByText('Año')).toBeInTheDocument();
    expect(screen.getByText('Marca')).toBeInTheDocument();
    expect(screen.getByText('Modelo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    renderWithQueryClient(<CarValuationForm />);
    
    const submitButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La marca es requerida')).toBeInTheDocument();
      expect(screen.getByText('El modelo es requerido')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockResponse = [
      {
        total_vehiculos: 48,
        exchange_rate_used: "1 USD = 1300 ARS",
        precios_ars_completo: { total: 728776000, min: 11750000, max: 20670000, avg: 15182833 },
        precios_usd_completo: { total: 560597, min: 9038, max: 15900, avg: 11679 },
        primeros_3_productos: []
      }
    ];

    mockCarValuationService.getCarValuation.mockResolvedValueOnce(mockResponse);

    renderWithQueryClient(<CarValuationForm />);

    // Fill out the form
    const yearSelect = screen.getByDisplayValue('');
    const brandSelect = screen.getByDisplayValue('');
    const modelInput = screen.getByPlaceholderText('Ej: Corolla, Civic, Focus');

    fireEvent.click(yearSelect);
    fireEvent.click(screen.getByText('2015'));

    fireEvent.click(brandSelect);
    fireEvent.click(screen.getByText('Peugeot'));

    fireEvent.change(modelInput, { target: { value: '208' } });

    const submitButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCarValuationService.getCarValuation).toHaveBeenCalledWith({
        ano: 2015,
        marca: 'Peugeot',
        modelo: '208'
      });
    });
  });

  it('should show loading state during submission', async () => {
    mockCarValuationService.getCarValuation.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    renderWithQueryClient(<CarValuationForm />);

    // Fill and submit form quickly
    const modelInput = screen.getByPlaceholderText('Ej: Corolla, Civic, Focus');
    fireEvent.change(modelInput, { target: { value: '208' } });

    const submitButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Obteniendo valoración...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should display error message on API failure', async () => {
    mockCarValuationService.getCarValuation.mockRejectedValueOnce(
      new Error('Failed to fetch car valuation data')
    );

    renderWithQueryClient(<CarValuationForm />);

    // Fill and submit form
    const modelInput = screen.getByPlaceholderText('Ej: Corolla, Civic, Focus');
    fireEvent.change(modelInput, { target: { value: '208' } });

    const submitButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch car valuation data')).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    const mockOnClose = jest.fn();
    renderWithQueryClient(<CarValuationForm onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});