import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellRing, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNotifications } from "@/contexts/NotificationsContext";

type Notification = {
  id: string;
  type: 'welcome' | 'new_announcement' | 'profile_view';
  message: string;
  metadata: {
    announcement_id?: string;
    visitor_id?: string;
  };
  created_at: string;
  is_read: boolean;
};

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const baseClasses = "w-5 h-5 text-primary";
  switch (type) {
    case 'profile_view':
      return <UserCheck className={baseClasses} />;
    case 'welcome':
    case 'new_announcement':
    default:
      return <BellRing className={baseClasses} />;
  }
};

const VisitorAvatar = ({ visitorId }: { visitorId: string }) => {
  const [visitor, setVisitor] = useState<{ avatar_url: string | null, first_name: string | null } | null>(null);

  useEffect(() => {
    const fetchVisitor = async () => {
      const { data } = await supabase.from('profiles').select('avatar_url, first_name').eq('id', visitorId).single();
      if (data) {
        setVisitor(data);
      }
    };
    fetchVisitor();
  }, [visitorId]);

  if (!visitor) {
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
        <UserCheck className="w-5 h-5 text-primary" />
      </div>
    );
  }

  return (
    <Avatar className="w-10 h-10 border">
      <AvatarImage src={visitor.avatar_url || undefined} alt={visitor.first_name || 'Visitante'} />
      <AvatarFallback>{visitor.first_name?.charAt(0) || 'V'}</AvatarFallback>
    </Avatar>
  );
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR });
  
  const content = (
    <div className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
      {notification.type === 'profile_view' && notification.metadata.visitor_id ? (
        <VisitorAvatar visitorId={notification.metadata.visitor_id} />
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
          <NotificationIcon type={notification.type} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
    </div>
  );

  if (notification.type === 'profile_view' && notification.metadata.visitor_id) {
    return <Link to={`/user/${notification.metadata.visitor_id}`}>{content}</Link>;
  }
  if (notification.type === 'new_announcement' && notification.metadata.announcement_id) {
    return <Link to={`/announcement/${notification.metadata.announcement_id}`}>{content}</Link>;
  }
  return content;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { unreadCount, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data as Notification[]);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Layout title="Notificações">
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Notificações">
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <BellRing className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Você não tem nenhuma notificação.</p>
          <p className="text-sm text-muted-foreground/80">Novas mensagens e alertas aparecerão aqui.</p>
        </div>
      )}
    </Layout>
  );
};

export default Notifications;