import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useHealthReminders() {
  const { user } = useAuth();
  const [remindersActive, setRemindersActive] = useState(false);

  useEffect(() => {
    if (!user || !user.healthProfile?.medications) return;

    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) return;
      if (Notification.permission === 'granted') {
        setRemindersActive(true);
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setRemindersActive(true);
        }
      }
    };

    requestNotificationPermission();

    // Check every hour (3600000 ms)
    const interval = setInterval(() => {
      if (Notification.permission === 'granted') {
        new Notification('Med-Genie Health Reminder', {
          body: `It might be time to take your medication: ${user.healthProfile.medications}`,
          icon: '/favicon.ico' // Assuming a favicon exists
        });
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [user]);

  return { remindersActive };
}
