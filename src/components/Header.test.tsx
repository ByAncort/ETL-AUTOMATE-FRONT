import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AuthProvider } from '../context/AuthContext';

/**
 * Tema 2 — Experiencia de Usuario.
 * "El menu superior debe verse siempre de la misma forma."
 * Sin token en localStorage el usuario no es admin: el menu base es constante.
 */
function renderHeader(props = {}) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Header {...props} />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Header (menú superior consistente)', () => {
  it('muestra siempre la marca y el subtitulo por defecto', () => {
    renderHeader();
    expect(screen.getByRole('heading', { name: 'ETL Automate' })).toBeInTheDocument();
    expect(screen.getByText('Plataforma de Integración')).toBeInTheDocument();
  });

  it('siempre incluye notificaciones y el menu de usuario', () => {
    renderHeader();
    expect(screen.getByLabelText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByLabelText('Menú de usuario')).toBeInTheDocument();
  });

  it('el menu de usuario expone Perfil y Cerrar Sesión', async () => {
    renderHeader();
    await userEvent.click(screen.getByLabelText('Menú de usuario'));

    expect(screen.getByRole('menuitem', { name: /editar perfil/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  it('sin rol admin NO aparece el toggle de modo admin', async () => {
    renderHeader();
    await userEvent.click(screen.getByLabelText('Menú de usuario'));

    expect(screen.queryByRole('menuitem', { name: /modo admin/i })).toBeNull();
  });
});
