import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import IntegrationCard from '../IntegrationCard';

jest.mock('../ui/spotlight-card', () => ({
  GlowCard: ({ children }: { children: React.ReactNode }) => <div data-testid="glow-card">{children}</div>,
}));

function clickMenuButton(container: HTMLElement) {
  const btn = container.querySelector('button');
  if (btn) fireEvent.click(btn);
}

describe('IntegrationCard', () => {
  const mockIntegration = {
    id: '1',
    source: 'API Source',
    name: 'Test Integration',
    status: 'active' as const,
    lastRun: '2024-01-15T10:00:00Z',
    recordsProcessed: '1500',
  };

  const mockIntegrationResponse = {
    id: 2,
    apiA: 5,
    apiB: 8,
    description: 'Integration from API 5 to API 8',
    status: 'pending' as const,
    createdAt: '2024-06-20T12:00:00Z',
  };

  it('should render with Integration type', () => {
    const { container } = render(<IntegrationCard integration={mockIntegration} />);

    expect(screen.getByText('Test Integration')).toBeInTheDocument();
    expect(screen.getByText('API Source')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('should render with IntegrationResponse type', () => {
    render(<IntegrationCard integration={mockIntegrationResponse} />);

    expect(screen.getByText('Integration from API 5 to API 8')).toBeInTheDocument();
    expect(screen.getByText('API 5 → API 8')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('should render error status with alert', () => {
    render(<IntegrationCard integration={{ ...mockIntegration, status: 'error' }} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Fallo en conexión')).toBeInTheDocument();
  });

  it('should render inactive status', () => {
    render(<IntegrationCard integration={{ ...mockIntegration, status: 'inactive' }} />);

    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('should toggle menu on MoreVertical click', () => {
    const { container } = render(
      <IntegrationCard integration={mockIntegration} onSchemaMatch={jest.fn()} onDelete={jest.fn()} />
    );

    clickMenuButton(container);

    expect(screen.getByText('Configurar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('should call onSchemaMatch when Configurar is clicked', () => {
    const onSchemaMatch = jest.fn();
    const { container } = render(
      <IntegrationCard integration={{ ...mockIntegration, id: '42' }} onSchemaMatch={onSchemaMatch} />
    );

    clickMenuButton(container);
    fireEvent.click(screen.getByText('Configurar'));

    expect(onSchemaMatch).toHaveBeenCalledWith('42');
  });

  it('should call onDelete when Eliminar is clicked', () => {
    const onDelete = jest.fn();
    const { container } = render(
      <IntegrationCard integration={{ ...mockIntegration, id: '99' }} onDelete={onDelete} />
    );

    clickMenuButton(container);
    fireEvent.click(screen.getByText('Eliminar'));

    expect(onDelete).toHaveBeenCalledWith('99');
  });

  it('should not render action buttons when callbacks are not provided', () => {
    const { container } = render(<IntegrationCard integration={mockIntegration} />);

    clickMenuButton(container);

    expect(screen.queryByText('Configurar')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });
});
