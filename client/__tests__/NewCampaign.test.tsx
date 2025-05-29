import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CampaignsPage from '@/app/campaigns/new/page';
import { useAuth } from '@/contexts/AuthContext';
import { createCampaign, Campaign, CampaignPayout } from '@/lib/api/campaigns';

// Mock Next.js navigation hooks to avoid router dependency issues
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: () => '/campaigns/new',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock authentication context to simulate authenticated user
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock campaign API functions
jest.mock('@/lib/api/campaigns', () => ({
  createCampaign: jest.fn(),
  fetchCampaigns: jest.fn(),
}));

// Mock CampaignForm component for simple test of form submission
jest.mock('@/components/CampaignForm', () => {
  return function MockCampaignForm({ onSubmit }: { onSubmit: (data: Partial<Campaign>) => void }) {
    return (
      <div data-testid="campaign-form">
        <button
          onClick={() => onSubmit({
            title: 'Test Campaign',
            landing_page_url: 'https://example.com',
            is_running: false,
            // Include at least one payout as required by business logic
            payouts: [
              {
                campaign_id: 1, // Will be set by backend
                country: null, // Worldwide payout
                amount: 10.50,
                currency: 'EUR',
                created_at: new Date(),
                updated_at: new Date(),
              }
            ]
          })}
          data-testid="submit-form"
        >
          Submit Form
        </button>
      </div>
    );
  };
});

// Create mock references for easier testing
const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockCreateCampaign = createCampaign as jest.MockedFunction<typeof createCampaign>;

describe('CampaignsPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test to ensure clean state
    jest.clearAllMocks();

    // Setup router mock with all required methods
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);

    // Setup authenticated user state
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com', username: 'test@example.com' },
      signin: jest.fn(),
      signout: jest.fn(),
      isAuthenticated: true,
      loading: false,
    });
  });

  test('renders new campaign page with title', () => {
    render(<CampaignsPage />);

    // Verify page renders with correct heading and form
    expect(screen.getByRole('heading', { level: 1, name: 'New Campaign' })).toBeInTheDocument();
    expect(screen.getByTestId('campaign-form')).toBeInTheDocument();
  });

  test('handles campaign creation with payouts and redirects to dashboard', async () => {
    // Setup successful API response with created campaign including payouts
    const mockPayout: CampaignPayout = {
      id: 1,
      campaign_id: 1,
      country: null, // Worldwide
      amount: 10.50,
      currency: 'EUR',
      created_at: new Date('2025-05-29T00:00:00Z'),
      updated_at: new Date('2025-05-29T00:00:00Z'),
    };

    const mockCampaign: Campaign = {
      id: 1,
      title: 'Test Campaign',
      landing_page_url: 'https://example.com',
      is_running: false,
      created_at: new Date('2025-05-29T00:00:00Z'),
      updated_at: new Date('2025-05-29T00:00:00Z'),
      payouts: [mockPayout],
    };

    mockCreateCampaign.mockResolvedValueOnce(mockCampaign);

    render(<CampaignsPage />);

    // Simulate form submission with payouts
    const submitButton = screen.getByTestId('submit-form');
    submitButton.click();

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify API was called with correct data including payouts
    expect(mockCreateCampaign).toHaveBeenCalledWith({
      title: 'Test Campaign',
      landing_page_url: 'https://example.com',
      is_running: false,
      payouts: [
        {
          campaign_id: 1,
          country: null,
          amount: 10.50,
          currency: 'EUR',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }
      ],
    });

    // Verify redirect to dashboard after successful creation
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('handles campaign creation error gracefully', async () => {
    // Setup console spy to verify error logging
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // Setup API to reject with error
    mockCreateCampaign.mockRejectedValueOnce(new Error('Payout validation failed'));

    render(<CampaignsPage />);

    // Simulate form submission that will fail
    const submitButton = screen.getByTestId('submit-form');
    submitButton.click();

    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify API was called
    expect(mockCreateCampaign).toHaveBeenCalled();
    // Verify error was logged to console
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create campaign:', expect.any(Error));
    // Verify no redirect happens on error
    expect(mockPush).not.toHaveBeenCalled();

    // Clean up console spy
    consoleSpy.mockRestore();
  });

  test('validates that at least one payout is included', async () => {
    render(<CampaignsPage />);

    // Submit form (our mock already includes a payout)
    const submitButton = screen.getByTestId('submit-form');
    submitButton.click();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    // Verify the submitted data includes payouts array with at least one item
    const callArgs = mockCreateCampaign.mock.calls[0][0];
    expect(callArgs.payouts).toBeDefined();
    expect(Array.isArray(callArgs.payouts)).toBe(true);
    expect(callArgs.payouts!.length).toBeGreaterThanOrEqual(1);

    // Verify payout structure
    const payout = callArgs.payouts![0];
    expect(payout).toHaveProperty('amount');
    expect(payout).toHaveProperty('currency');
    expect(payout).toHaveProperty('country');
  });
});