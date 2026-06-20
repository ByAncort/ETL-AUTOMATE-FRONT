import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../ResetPassword';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock('../AuthLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

import api from '../../services/api';

const renderWithRouter = (initialRoute: string) => {
  window.history.pushState({}, '', initialRoute);
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ResetPassword />
    </MemoryRouter>
  );
};

describe('ResetPassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show invalid link message when no token', () => {
    renderWithRouter('/reset-password');

    expect(screen.getByText('Enlace inválido')).toBeInTheDocument();
    expect(screen.getByText(/el enlace de restablecimiento no es válido/i)).toBeInTheDocument();
  });

  it('should show form when token is present', () => {
    renderWithRouter('/reset-password?token=valid-token-123');

    expect(screen.getByText('Restablecer Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Contraseña')).toBeInTheDocument();
  });

  it('should show error when passwords do not match', async () => {
    renderWithRouter('/reset-password?token=valid-token');

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'password123' } });
    fireEvent.change(inputs[1], { target: { value: 'different456' } });

    fireEvent.click(screen.getByText('Restablecer Contraseña'));

    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('should show error when password is too short', async () => {
    renderWithRouter('/reset-password?token=valid-token');

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: '123' } });
    fireEvent.change(inputs[1], { target: { value: '123' } });

    fireEvent.click(screen.getByText('Restablecer Contraseña'));

    expect(await screen.findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
  });

  it('should call api.post on valid submit', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    renderWithRouter('/reset-password?token=valid-token');

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'newpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpass123' } });

    fireEvent.click(screen.getByText('Restablecer Contraseña'));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/users/reset-password', {
        token: 'valid-token',
        newPassword: 'newpass123',
      });
    });
  });

  it('should show success after API call', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({});

    renderWithRouter('/reset-password?token=valid-token');

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'newpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpass123' } });

    fireEvent.click(screen.getByText('Restablecer Contraseña'));

    expect(await screen.findByText('Contraseña actualizada')).toBeInTheDocument();
  });

  it('should show error on API failure', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

    renderWithRouter('/reset-password?token=expired-token');

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'newpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpass123' } });

    fireEvent.click(screen.getByText('Restablecer Contraseña'));

    expect(await screen.findByText(/el enlace es inválido o ha expirado/i)).toBeInTheDocument();
  });
});
