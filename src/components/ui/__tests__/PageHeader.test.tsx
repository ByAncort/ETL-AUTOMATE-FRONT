import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  it('should render title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<PageHeader title="Dashboard" description="Welcome to dashboard" />);
    expect(screen.getByText('Welcome to dashboard')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByText('Welcome to dashboard')).not.toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    render(<PageHeader title="Dashboard" icon={<span data-testid="header-icon" />} />);
    expect(screen.getByTestId('header-icon')).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(<PageHeader title="Dashboard"><button>Action</button></PageHeader>);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});
