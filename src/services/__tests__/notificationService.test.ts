import {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearAll,
  getNotifications,
  subscribe,
} from '../notificationService';

describe('notificationService', () => {
  beforeEach(() => {
    clearAll();
  });

  describe('addNotification', () => {
    it('should add a notification to the list', () => {
      addNotification('integration', 'Test Title', 'Test Message');

      const notifications = getNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Test Title');
      expect(notifications[0].message).toBe('Test Message');
      expect(notifications[0].type).toBe('integration');
      expect(notifications[0].read).toBe(false);
    });

    it('should add multiple notifications in order', () => {
      addNotification('system', 'First', 'Message 1');
      addNotification('error', 'Second', 'Message 2');

      const notifications = getNotifications();
      expect(notifications).toHaveLength(2);
      expect(notifications[0].title).toBe('Second');
      expect(notifications[1].title).toBe('First');
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', () => {
      addNotification('system', 'Title', 'Message');
      const { id } = getNotifications()[0];

      markAsRead(id);

      const notifications = getNotifications();
      expect(notifications[0].read).toBe(true);
    });

    it('should not affect other notifications', () => {
      addNotification('system', 'First', 'Msg');
      addNotification('error', 'Second', 'Msg');
      const notifications = getNotifications();
      const firstId = notifications[1].id;

      markAsRead(firstId);

      const updated = getNotifications();
      expect(updated.find(n => n.id === firstId)?.read).toBe(true);
      expect(updated[0].read).toBe(false);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      addNotification('system', 'A', 'Msg');
      addNotification('error', 'B', 'Msg');
      addNotification('success', 'C', 'Msg');

      markAllAsRead();

      getNotifications().forEach(n => {
        expect(n.read).toBe(true);
      });
    });
  });

  describe('clearAll', () => {
    it('should remove all notifications', () => {
      addNotification('system', 'A', 'Msg');
      addNotification('error', 'B', 'Msg');

      clearAll();

      expect(getNotifications()).toHaveLength(0);
    });
  });

  describe('subscribe', () => {
    it('should notify listeners when notifications change', () => {
      const listener = jest.fn();

      subscribe(listener);
      addNotification('system', 'Title', 'Msg');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'Title' })])
      );
    });

    it('should return unsubscribe function', () => {
      const listener = jest.fn();
      const unsubscribe = subscribe(listener);

      unsubscribe();
      addNotification('system', 'Title', 'Msg');

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
