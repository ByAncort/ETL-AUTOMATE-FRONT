import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import StatsBar from '../StatsBar';

describe('StatsBar', () => {
  it('should render all stats', () => {
    render(<StatsBar />);

    expect(screen.getByText('Integraciones Activas')).toBeInTheDocument();
    expect(screen.getByText('Registros Procesados')).toBeInTheDocument();
    expect(screen.getByText('Próxima Ejecución')).toBeInTheDocument();
    expect(screen.getByText('Confianza Promedio ML')).toBeInTheDocument();
  });

  it('should render stat values', () => {
    render(<StatsBar />);

    expect(screen.getByText('3 / 4')).toBeInTheDocument();
    expect(screen.getByText('33,859')).toBeInTheDocument();
    expect(screen.getByText('14:30 hrs')).toBeInTheDocument();
    expect(screen.getByText('87.9%')).toBeInTheDocument();
  });

  it('should render subtitles', () => {
    render(<StatsBar />);

    expect(screen.getByText('+1 esta semana')).toBeInTheDocument();
    expect(screen.getByText('Últimas 24h')).toBeInTheDocument();
    expect(screen.getByText('ERP Ventas')).toBeInTheDocument();
    expect(screen.getByText('Record Linkage')).toBeInTheDocument();
  });
});
