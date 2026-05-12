export interface Notification {
  id: string;
  type: 'integration' | 'connection' | 'system' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

type Listener = (notifications: Notification[]) => void;

let notifications: Notification[] = [];
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach(l => l([...notifications]));
}

let idCounter = 0;

export function addNotification(type: Notification['type'], title: string, message: string) {
  const notification: Notification = {
    id: String(++idCounter),
    type,
    title,
    message,
    timestamp: new Date(),
    read: false,
  };
  notifications = [notification, ...notifications];
  notify();
}

export function markAsRead(id: string) {
  notifications = notifications.map(n =>
    n.id === id ? { ...n, read: true } : n
  );
  notify();
}

export function markAllAsRead() {
  notifications = notifications.map(n => ({ ...n, read: true }));
  notify();
}

export function clearAll() {
  notifications = [];
  notify();
}

export function getNotifications(): Notification[] {
  return [...notifications];
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
