import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoadingState from '../LoadingState';

describe('LoadingState', () => {
  it('should render default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render custom message', () => {
    render(<LoadingState message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should render with custom icon', () => {
    render(<LoadingState icon={<span data-testid="custom-icon" />} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render without custom icon (default spinner)', () => {
    const { container } = render(<LoadingState />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });
});
