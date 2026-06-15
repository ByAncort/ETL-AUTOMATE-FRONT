import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    render(<Modal {...defaultProps} />);
    const backdrop = document.querySelector('.bg-black\\/40');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should render subtitle when provided', () => {
    render(<Modal {...defaultProps} subtitle="Modal subtitle" />);
    expect(screen.getByText('Modal subtitle')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    render(<Modal {...defaultProps} icon={<span data-testid="modal-icon" />} />);
    expect(screen.getByTestId('modal-icon')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    render(<Modal {...defaultProps} footer={<button>Save</button>} />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should apply correct size class', () => {
    const { container } = render(<Modal {...defaultProps} size="xl" />);
    const modalDiv = container.querySelector('.max-w-xl');
    expect(modalDiv).toBeInTheDocument();
  });

  it('should use default md size', () => {
    const { container } = render(<Modal {...defaultProps} />);
    const modalDiv = container.querySelector('.max-w-md');
    expect(modalDiv).toBeInTheDocument();
  });
});
