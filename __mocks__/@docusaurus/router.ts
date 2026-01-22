/**
 * Mock for @docusaurus/router
 * Used in tests to mock navigation and location
 */

export const mockLocation = { pathname: '/' };

export const useLocation = () => mockLocation;

export const useHistory = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
});

export const Link = ({  children }: { to: string; children: React.ReactNode }) => children;
