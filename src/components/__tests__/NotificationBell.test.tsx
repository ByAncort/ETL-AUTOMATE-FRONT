import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NotificationBell from '../NotificationBell';
import { addNotification, clearAll } from '../../services/notificationService';

describe('NotificationBell', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    clearAll();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render bell button', () => {
    render(<NotificationBell />);
    expect(screen.getByLabelText('Notificaciones')).toBeInTheDocument();
  });

  it('should show unread count badge', () => {
    render(<NotificationBell />);
    act(() => { addNotification('success', 'Test title', 'Test message'); });

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should show 99+ badge when >99 unread', () => {
    render(<NotificationBell />);
    act(() => {
      for (let i = 0; i < 100; i++) {
        addNotification('system', `Notification ${i}`, 'msg');
      }
    });

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should open menu on bell click', () => {
    render(<NotificationBell />);
    act(() => { addNotification('integration', 'Test', 'Message'); });

    fireEvent.click(screen.getByLabelText('Notificaciones'));

    expect(screen.getByText('Notificaciones')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('Notificaciones'));

    expect(screen.getByText('Sin notificaciones')).toBeInTheDocument();
  });

  it('should show Marcar leídas button when unread exist', () => {
    render(<NotificationBell />);
    act(() => { addNotification('error', 'Error', 'Something failed'); });

    fireEvent.click(screen.getByLabelText('Notificaciones'));

    expect(screen.getByText('Marcar leídas')).toBeInTheDocument();
  });

  it('should render different notification types with correct icons', () => {
    render(<NotificationBell />);

    act(() => { addNotification('success', 'Success!', 'OK'); });
    act(() => { addNotification('connection', 'Conn', 'Connected'); });
    act(() => { addNotification('system', 'Sys', 'Info'); });

    fireEvent.click(screen.getByLabelText('Notificaciones'));

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Conn')).toBeInTheDocument();
    expect(screen.getByText('Sys')).toBeInTheDocument();
  });
});
