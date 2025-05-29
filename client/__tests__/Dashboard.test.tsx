import { render, screen } from '@testing-library/react';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock API calls
jest.mock('@/lib/api/campaigns', () => ({
  fetchCampaigns: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

test('renders user info when authenticated', () => {
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'test@example.com',
  };

  mockUseAuth.mockReturnValue({
    user: mockUser,
    signin: jest.fn(),
    signout: jest.fn(),
    isAuthenticated: true,
    loading: false,
  });

  render(<Dashboard />);

  expect(screen.getByText(/Campaign Management Portal/)).toBeInTheDocument();
});
