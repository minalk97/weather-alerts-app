import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertProvider, useAlertContext } from '../context/AlertsContext';
import { fetchWeatherAlertData, fetchAlertsByZone } from '../services/WeatherAPI';

// Mock the API calls
jest.mock("../services/WeatherAPI", () => ({
  fetchWeatherAlertData: jest.fn(),
  fetchAlertsByZone: jest.fn(),
}));


describe('AlertsContext', () => {
  // Setup QueryClient for tests
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Create a wrapper component for testing hooks
  const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>
          <AlertProvider>{children}</AlertProvider>
          </QueryClientProvider>
  );
  // Mock data
  const mockWeatherAlerts = [
    {
      id: '1',
      type: 'Feature',
      properties: {
        id: 'alert1',
        status: 'Actual',
        severity: 'Severe',
        urgency: 'Immediate',
        sent: '2024-03-07T10:00:00Z',
        effective: '2024-03-07T10:00:00Z',
        expires: '2024-03-08T10:00:00Z',
      },
    },
    {
      id: '2',
      type: 'Feature',
      properties: {
        id: 'alert2',
        status: 'Test', // This should be filtered out
        severity: 'Minor',
        urgency: 'Expected',
        sent: '2024-03-07T11:00:00Z',
        effective: '2024-03-07T11:00:00Z',
        expires: '2024-03-08T11:00:00Z',
      },
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset QueryClient
    queryClient.clear();

    // Setup default mock implementations
    (fetchWeatherAlertData as jest.Mock).mockResolvedValue(mockWeatherAlerts);
    (fetchAlertsByZone as jest.Mock).mockResolvedValue(mockWeatherAlerts);
  });

  it('should throw error when used outside provider', () => {
    const { result } = renderHook(() => useAlertContext());
    expect(result.error).toEqual(
      Error('useAlertContext must be used within an AlertProvider')
    );
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    expect(result.current).toMatchObject({
      selectedState: '',
      selectedZone: '',
      selectedSeverity: '',
      selectedUrgency: '',
      sortBy: 'sent',
      sortDirection: 'desc',
      alerts: [],
      loadingAlerts: false,
      isError: false,
    });
  });

  it('should update selected state', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    act(() => {
      result.current.setSelectedState('CA');
    });

    expect(result.current.selectedState).toBe('CA');
  });

  it('should filter out test alerts', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    // Wait for the alerts to be processed
    await act(async () => {
      result.current.setSelectedState('CA');
    });

    // Only non-test alerts should be present
    expect(result.current.alerts.length).toBe(1);
    expect(result.current.alerts[0].properties.status).not.toBe('Test');
  });

  it('should filter alerts by severity', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    await act(async () => {
      result.current.setSelectedState('CA');
      result.current.setSelectedSeverity('Severe');
    });

    expect(result.current.alerts.every(alert => alert.properties.severity === 'Severe')).toBe(true);
  });

  it('should filter alerts by urgency', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    await act(async () => {
      result.current.setSelectedState('CA');
      result.current.setSelectedUrgency('Immediate');
    });

    expect(result.current.alerts.every(alert => alert.properties.urgency === 'Immediate')).toBe(true);
  });

  it('should sort alerts by date fields', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    await act(async () => {
      result.current.setSelectedState('CA');
      result.current.setSortBy('sent');
      result.current.setSortDirection('asc');
    });

    // Verify ascending order
    const dates = result.current.alerts.map(alert => new Date(alert.properties.sent).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });

  it('should sort alerts by severity', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    await act(async () => {
      result.current.setSelectedState('CA');
      result.current.setSortBy('severity');
      result.current.setSortDirection('desc');
    });

    const severityOrder = {
      Extreme: 4,
      Severe: 3,
      Moderate: 2,
      Minor: 1,
      Unknown: 0,
    };

    // Verify descending severity order
    const alerts = result.current.alerts;
    for (let i = 1; i < alerts.length; i++) {
      const prev = severityOrder[alerts[i - 1].properties.severity];
      const curr = severityOrder[alerts[i].properties.severity];
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('should handle API errors correctly', async () => {
    // Mock API error
    (fetchWeatherAlertData as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAlertContext(), { wrapper });

    await act(async () => {
      result.current.setSelectedState('CA');
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeDefined();
  });

  it('should handle zone selection', async () => {
    const { result } = renderHook(() => useAlertContext(), { wrapper });

    await act(async () => {
      result.current.setSelectedZone('zone1');
    });

    expect(result.current.selectedZone).toBe('zone1');
    expect(fetchAlertsByZone).toHaveBeenCalledWith('zone1');
  });

  // Test loading states
  it('should show loading state while fetching alerts', async () => {
    // Mock a delay in the API response
    (fetchWeatherAlertData as jest.Mock).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve(mockWeatherAlerts), 100))
    );

    const { result } = renderHook(() => useAlertContext(), { wrapper });

    act(() => {
      result.current.setSelectedState('CA');
    });

    expect(result.current.loadingAlerts).toBe(true);

    // Wait for the loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.loadingAlerts).toBe(false);
  });
});