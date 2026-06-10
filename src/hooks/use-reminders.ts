import { useState, useEffect, useCallback } from 'react';

export interface Reminder {
  id: number;
  userId: number;
  name: string;
  dosage?: string | null;
  frequency: string;
  time: string; // "HH:MM"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/reminders', { headers });
      const data = await res.json();

      if (data.success) {
        setReminders(data.reminders);
      } else {
        throw new Error(data.message || 'Failed to fetch reminders');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReminder = async (data: Partial<Reminder>) => {
    try {
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setReminders(prev => [...prev, result.reminder]);
        return result.reminder;
      }
      throw new Error(result.message);
    } catch (err: any) {
      throw err;
    }
  };

  const updateReminder = async (id: number, data: Partial<Reminder>) => {
    try {
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setReminders(prev => prev.map(r => r.id === id ? result.reminder : r));
        return result.reminder;
      }
      throw new Error(result.message);
    } catch (err: any) {
      throw err;
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      const token = localStorage.getItem('med-genie-token') || sessionStorage.getItem('med-genie-token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE',
        headers,
      });
      const result = await res.json();
      if (result.success) {
        setReminders(prev => prev.filter(r => r.id !== id));
        return true;
      }
      throw new Error(result.message);
    } catch (err: any) {
      throw err;
    }
  };

  // Setup Notification Logic
  useEffect(() => {
    fetchReminders();
    
    // Request permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [fetchReminders]);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted' || reminders.length === 0) {
      return;
    }

    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      reminders.forEach(reminder => {
        if (!reminder.isActive) return;

        if (reminder.time === currentTimeStr) {
          // Check if we already fired this today to prevent spam
          const lastFiredKey = `reminder_fired_${reminder.id}`;
          const lastFiredDate = localStorage.getItem(lastFiredKey);
          const todayDateStr = now.toDateString();

          if (lastFiredDate !== todayDateStr) {
            // Fire notification
            const notification = new Notification('Med Genie Health Reminder', {
              body: `Time for your reminder: ${reminder.name}${reminder.dosage ? ` (${reminder.dosage})` : ''}`,
              icon: '/favicon.ico', // Optional icon
              tag: `reminder-${reminder.id}`,
            });

            // Mark as fired for today
            localStorage.setItem(lastFiredKey, todayDateStr);

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }
        }
      });
    };

    // Check immediately, then every 30 seconds
    checkReminders();
    const interval = setInterval(checkReminders, 30000);

    return () => clearInterval(interval);
  }, [reminders]);

  return {
    reminders,
    isLoading,
    error,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
  };
}
