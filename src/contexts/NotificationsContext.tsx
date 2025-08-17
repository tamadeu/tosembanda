import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  unreadCount: number;
  markAllAsRead: () => void;
  markOneAsRead: (notificationId: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  unreadCount: 0,
  markAllAsRead: () => {},
  markOneAsRead: () => {},
});

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error && count !== null) {
      setUnreadCount(count);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        (payload) => {
          console.log('New notification received!', payload);
          setUnreadCount((prevCount) => prevCount + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    
    setUnreadCount(0);

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error("Error marking notifications as read:", error);
      fetchUnreadCount();
    }
  }, [user, fetchUnreadCount]);

  const markOneAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('is_read', false);

    if (error) {
      console.error("Error marking notification as read:", error);
      fetchUnreadCount();
    }
  }, [user, fetchUnreadCount]);

  return (
    <NotificationsContext.Provider value={{ unreadCount, markAllAsRead, markOneAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};