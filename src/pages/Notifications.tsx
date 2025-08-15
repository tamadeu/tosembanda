import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellRing, MessageSquare } from "lucide-react";

type Notification = {
  id: number;
  type: 'message' | 'system';
  user?: {
    name: string;
    avatarUrl: string;
  };
  text: string;
  time: string;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'message',
    user: { name: "Carla Dias", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    text: "te enviou uma nova mensagem.",
    time: "5m atrás"
  },
  {
    id: 2,
    type: 'system',
    text: "Seu anúncio 'Vocalista disponível para projetos' foi publicado com sucesso!",
    time: "2h atrás"
  },
  {
    id: 3,
    type: 'message',
    user: { name: "Banda Scapegoat", avatarUrl: "https://i.pravatar.cc/150?img=3" },
    text: "respondeu ao seu interesse no anúncio.",
    time: "1d atrás"
  },
  {
    id: 4,
    type: 'system',
    text: "Bem-vindo ao MusiConnect! Complete seu perfil para ter mais chances de encontrar parceiros.",
    time: "3d atrás"
  }
];

const NotificationItem = ({ notification }: { notification: Notification }) => {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
      {notification.user ? (
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={notification.user.avatarUrl} alt={notification.user.name} />
          <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full">
          <BellRing className="w-5 h-5 text-primary" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm">
          {notification.user && <span className="font-semibold">{notification.user.name}</span>}
          {' '}
          {notification.text}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
      </div>
    </div>
  );
};

const Notifications = () => {
  return (
    <Layout title="Notificações">
      {mockNotifications.length > 0 ? (
        <div className="space-y-2">
          {mockNotifications.map((notification) => (
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