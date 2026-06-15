import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../ErrorState';

describe('ErrorState', () => {
  it('should render error message', () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    render(<ErrorState message="Error" onRetry={jest.fn()} />);
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorState message="Error" />);
    expect(screen.queryByText('Reintentar')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Error" onRetry={onRetry} />);

    fireEvent.click(screen.getByText('Reintentar'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render AlertCircle icon', () => {
    const { container } = render(<ErrorState message="Error" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
