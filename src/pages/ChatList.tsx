import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const mockConversations = [
  {
    announcementId: "c5a6b2d8-1f3e-4a7b-8c9d-0e1f2a3b4c5d", // Example UUID
    userName: "Carla Dias",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Opa, legal! Me fala um pouco mais sobre você.",
    time: "5m atrás",
  },
  {
    announcementId: "f9e8d7c6-5b4a-3c2d-1e0f-a9b8c7d6e5f4", // Example UUID
    userName: "Banda Scapegoat",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Ainda estamos procurando sim! Qual sua experiência?",
    time: "2h atrás",
  },
  {
    announcementId: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6", // Example UUID
    userName: "Jorge Antunes",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Vi que você toca guitarra, é isso mesmo?",
    time: "1d atrás",
  },
];

const ChatList = () => {
  return (
    <Layout title="Conversas">
      {mockConversations.length > 0 ? (
        <div className="space-y-2">
          {mockConversations.map((convo) => (
            <Link
              key={convo.announcementId}
              to={`/chat/${convo.announcementId}`}
              className="block p-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border">
                  <AvatarImage src={convo.userAvatar} alt={convo.userName} />
                  <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold truncate">{convo.userName}</p>
                    <p className="text-xs text-muted-foreground flex-shrink-0">{convo.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Você não tem nenhuma conversa.</p>
          <p className="text-sm text-muted-foreground/80">Quando você entrar em contato com alguém, sua conversa aparecerá aqui.</p>
        </div>
      )}
    </Layout>
  );
};

export default ChatList;