import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePasswordModal from '../ChangePasswordModal';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { put: jest.fn() },
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    userData: { id: 1, username: 'testuser', email: 'test@test.com' },
  }),
}));

import api from '../../services/api';

describe('ChangePasswordModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the modal', () => {
    render(<ChangePasswordModal onClose={mockOnClose} />);

    expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
  });

  it('should show error when passwords do not match', async () => {
    render(<ChangePasswordModal onClose={mockOnClose} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'password123' } });
    fireEvent.change(inputs[1], { target: { value: 'different456' } });

    fireEvent.click(screen.getByText('Guardar Cambios'));

    expect(await screen.findByText('Las contraseñas no coinciden')).toBeInTheDocument();
  });

  it('should show error when password is too short', async () => {
    render(<ChangePasswordModal onClose={mockOnClose} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: '123' } });
    fireEvent.change(inputs[1], { target: { value: '123' } });

    fireEvent.click(screen.getByText('Guardar Cambios'));

    expect(await screen.findByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
  });

  it('should call api.put on valid submit', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({});

    render(<ChangePasswordModal onClose={mockOnClose} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'newpassword123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpassword123' } });

    fireEvent.click(screen.getByText('Guardar Cambios'));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/api/users/1', expect.objectContaining({
        password: 'newpassword123',
        username: 'testuser',
      }));
    });
  });

  it('should show success state after submit', async () => {
    (api.put as jest.Mock).mockResolvedValueOnce({});

    render(<ChangePasswordModal onClose={mockOnClose} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'newpassword123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpassword123' } });

    fireEvent.click(screen.getByText('Guardar Cambios'));

    expect(await screen.findByText('Contraseña Actualizada')).toBeInTheDocument();
  });

  it('should handle API error', async () => {
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

    render(<ChangePasswordModal onClose={mockOnClose} />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(inputs[0], { target: { value: 'validpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'validpass123' } });

    fireEvent.click(screen.getByText('Guardar Cambios'));

    expect(await screen.findByText(/ocurrió un error/i)).toBeInTheDocument();
  });
});
