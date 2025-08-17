import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementWithProfile } from "@/lib/types";

type Message = {
  id: number;
  text: string;
  sender: 'me' | 'other';
};

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<AnnouncementWithProfile | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! Vi seu anúncio e tenho interesse.", sender: 'me' },
    { id: 2, text: "Opa, legal! Me fala um pouco mais sobre você.", sender: 'other' },
    { id: 3, text: "Claro! Sou guitarrista há 5 anos, toco principalmente rock e blues.", sender: 'me' },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) return;
      const { data } = await supabase
        .from('announcements')
        .select('*, profile:profiles!user_id(name, avatar_url)')
        .eq('id', id)
        .single();
      setAnnouncement(data);
    };
    fetchAnnouncement();
  }, [id]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  if (!announcement) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const userName = announcement.profile?.name || "Usuário";
  const userInitial = userName.charAt(0);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="-ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={announcement.profile?.avatar_url || undefined} alt={userName} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{userName}</h1>
        </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'other' && (
                 <Avatar className="w-8 h-8">
                    <AvatarImage src={announcement.profile?.avatar_url || undefined} alt={userName} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  msg.sender === 'me'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </main>

        <footer className="p-4 border-t bg-white dark:bg-black sticky bottom-0">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chat;