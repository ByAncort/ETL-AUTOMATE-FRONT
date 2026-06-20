import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../ForgotPassword';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock('../AuthLayout', () => ({
  __esModule: true,
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="auth-layout" data-title={title}>{children}</div>
  ),
}));

import api from '../../services/api';

describe('ForgotPassword', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form', () => {
    render(<ForgotPassword onBack={mockOnBack} />);

    expect(screen.getByText('Enviar Instrucciones')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email@ejemplo.com')).toBeInTheDocument();
  });

  it('should show success state after submit', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(<ForgotPassword onBack={mockOnBack} />);

    fireEvent.change(screen.getByPlaceholderText('email@ejemplo.com'), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByText('Enviar Instrucciones'));

    expect(await screen.findByText('Revisa tu correo')).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
  });

  it('should show error on API failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

    render(<ForgotPassword onBack={mockOnBack} />);

    fireEvent.change(screen.getByPlaceholderText('email@ejemplo.com'), { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByText('Enviar Instrucciones'));

    expect(await screen.findByText(/ocurrió un error/i)).toBeInTheDocument();
  });

  it('should disable submit when email is empty', () => {
    render(<ForgotPassword onBack={mockOnBack} />);

    const button = screen.getByText('Enviar Instrucciones');
    expect(button.closest('button')).toBeDisabled();
  });

  it('should call onBack when back button is clicked', () => {
    render(<ForgotPassword onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: '' }));

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should call onBack from success view', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(<ForgotPassword onBack={mockOnBack} />);

    fireEvent.change(screen.getByPlaceholderText('email@ejemplo.com'), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByText('Enviar Instrucciones'));

    expect(await screen.findByText('Revisa tu correo')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Volver al Login'));
    expect(mockOnBack).toHaveBeenCalled();
  });
});
