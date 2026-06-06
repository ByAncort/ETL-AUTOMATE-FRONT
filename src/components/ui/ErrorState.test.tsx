import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';

/**
 * Tema 2 — Experiencia de Usuario.
 * Iconografia y color del estado de error + accion de reintento.
 */
describe('ErrorState', () => {
  it('muestra el mensaje de error recibido', () => {
    render(<ErrorState message="No se pudo conectar con el servidor" />);
    expect(screen.getByText('No se pudo conectar con el servidor')).toBeInTheDocument();
  });

  it('usa el color rojo de error en el contenedor del icono', () => {
    const { container } = render(<ErrorState message="error" />);
    // El estado de error debe ser visualmente reconocible (fondo rojo).
    expect(container.querySelector('.bg-red-50')).not.toBeNull();
  });

  it('muestra el boton Reintentar solo cuando se entrega onRetry', () => {
    const { rerender } = render(<ErrorState message="error" />);
    expect(screen.queryByRole('button', { name: /reintentar/i })).toBeNull();

    rerender(<ErrorState message="error" onRetry={() => {}} />);
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('invoca onRetry al hacer click en Reintentar', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="error" onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
