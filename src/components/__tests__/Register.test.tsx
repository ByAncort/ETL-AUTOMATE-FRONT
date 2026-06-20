import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../Register';
import api from '../../services/api';

jest.mock('../../services/api');
// AuthLayout arrastra globe/motion (WebGL) que no corre en jsdom -> wrapper simple
jest.mock('../AuthLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockedApi = api as jest.Mocked<typeof api>;
const byId = (c: HTMLElement, id: string) => c.querySelector(`#${id}`) as HTMLInputElement;

async function fillValidForm(c: HTMLElement) {
  const user = userEvent.setup();
  await user.type(byId(c, 'reg-username'), 'usuarioduplicado');
  await user.type(byId(c, 'reg-firstname'), 'Juan');
  await user.type(byId(c, 'reg-lastname'), 'Perez');
  await user.type(byId(c, 'reg-email'), 'dup@qa.cl');
  await user.type(byId(c, 'reg-password'), 'Passw0rd');
  await user.type(byId(c, 'reg-confirm-password'), 'Passw0rd');
  await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
}

describe('Register — limpiar Usuario tras intento fallido (fix 807b83c / QA Exp.3)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('vacía el campo Usuario y conserva el resto cuando el registro falla', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('409 usuario ya existe'));
    const { container } = render(<Register onToggleForm={jest.fn()} />);

    await fillValidForm(container);

    await waitFor(() =>
      expect(screen.getByText(/No se pudo registrar/i)).toBeInTheDocument()
    );
    // el fix: Usuario se limpia...
    expect(byId(container, 'reg-username').value).toBe('');
    // ...y los demás campos se conservan
    expect(byId(container, 'reg-firstname').value).toBe('Juan');
    expect(byId(container, 'reg-email').value).toBe('dup@qa.cl');
  });
});
