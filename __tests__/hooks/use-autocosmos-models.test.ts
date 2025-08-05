/**
 * Tests: useAutocosmosModels Hook
 * Tests unitarios para el hook de modelos dinámicos
 */

import { renderHook, act } from '@testing-library/react';
import { useAutocosmosModels } from '@/hooks/use-autocosmos-models';

// Mock fetch global
global.fetch = jest.fn();

describe('useAutocosmosModels', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAutocosmosModels());

    expect(result.current.models).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasModels).toBe(false);
  });

  it('should fetch models successfully', async () => {
    const mockModels = [
      {
        name: 'Corolla',
        slug: 'corolla',
        brandSlug: 'toyota',
        displayName: 'Toyota Corolla',
        isActive: true
      }
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockModels
      })
    });

    const { result } = renderHook(() => useAutocosmosModels());

    await act(async () => {
      await result.current.fetchModels('Toyota');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasModels).toBe(true);
    expect(result.current.models).toHaveLength(1);
    expect(result.current.models[0].name).toBe('Corolla');
  });

  it('should handle fetch errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useAutocosmosModels());

    await act(async () => {
      await result.current.fetchModels('Toyota');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.hasModels).toBe(false);
    expect(result.current.models).toEqual([]);
  });

  it('should reset models', () => {
    const { result } = renderHook(() => useAutocosmosModels());

    act(() => {
      result.current.resetModels();
    });

    expect(result.current.models).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasModels).toBe(false);
  });

  it('should handle empty brand', async () => {
    const { result } = renderHook(() => useAutocosmosModels());

    await act(async () => {
      await result.current.fetchModels('');
    });

    expect(result.current.models).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasModels).toBe(false);
  });
});