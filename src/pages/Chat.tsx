import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { showError } from "@/utils/toast";
import { RealtimeChannel } from "@supabase/supabase-js";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ChatContext } from "@/components/ChatContext";

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

type OtherUser = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
}

const Chat = () => {
  const { announcementId, userId } = useParams<{ announcementId?: string, userId?: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [announcementContext, setAnnouncementContext] = useState<{ id: string, title: string } | null>(null);
  const [showContext, setShowContext] = useState(true);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const setupConversation = async () => {
      if (!currentUser) {
        showError("Você precisa estar logado para conversar.");
        navigate('/login');
        return;
      }

      let participantId: string | undefined = userId;

      if (announcementId) {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, title, user_id, profile:profiles!user_id(id, first_name, last_name, avatar_url)')
          .eq('id', announcementId)
          .single();
        
        if (error || !data?.profile) {
            showError("Não foi possível encontrar o anúncio.");
            navigate(-1);
            return;
        }
        if (data.user_id === currentUser.id) {
            showError("Você não pode iniciar uma conversa sobre seu próprio anúncio.");
            navigate(-1);
            return;
        }
        setOtherUser(data.profile as OtherUser);
        setAnnouncementContext({ id: data.id, title: data.title });
        participantId = data.user_id;
      } else if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .eq('id', userId)
          .single();

        if (error || !data) {
            showError("Usuário não encontrado.");
            navigate(-1);
            return;
        }
        setOtherUser(data as OtherUser);
      } else {
        navigate(-1);
        return;
      }

      if (!participantId) return;

      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${currentUser.id},participant2_id.eq.${participantId}),and(participant1_id.eq.${participantId},participant2_id.eq.${currentUser.id})`)
        .limit(1)
        .maybeSingle();

      let convId;
      if (existingConversation) {
        convId = existingConversation.id;
      } else {
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            participant1_id: currentUser.id,
            participant2_id: participantId,
          })
          .select('id')
          .single();
        
        if (createError || !newConversation) {
          showError("Erro ao iniciar a conversa.");
          console.error(createError);
          return;
        }
        convId = newConversation.id;
      }
      setConversationId(convId);
    };

    if (currentUser) {
        setupConversation();
    }
  }, [announcementId, userId, navigate, currentUser]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        showError("Erro ao carregar mensagens.");
      } else {
        setMessages(data as Message[]);
      }
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase.channel(`chat:${conversationId}`);
    channelRef.current = channel;

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.new.sender_id !== currentUser?.id) {
            setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
          }
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.senderId !== currentUser?.id) {
          setIsTyping(payload.payload.isTyping);
        }
      })
      .subscribe();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, currentUser?.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !currentUser || !otherUser || !conversationId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: false, senderId: currentUser.id },
    });

    const content = newMessage.trim();
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: content,
      sender_id: currentUser.id,
      created_at: new Date().toISOString(),
    };

    setMessages(prevMessages => [...prevMessages, tempMessage]);
    setNewMessage("");

    const messageData: any = {
      conversation_id: conversationId,
      sender_id: currentUser.id,
      receiver_id: otherUser.id,
      content: content,
    };

    if (messages.length === 0 && announcementId) {
      messageData.announcement_id = announcementId;
    }

    const { data: savedMessage, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      showError("Não foi possível enviar a mensagem.");
      setMessages(prevMessages => prevMessages.filter(m => m.id !== tempMessage.id));
      setNewMessage(content);
    } else if (savedMessage) {
      setMessages(prevMessages =>
        prevMessages.map(m => m.id === tempMessage.id ? savedMessage as Message : m)
      );
    }
  };

  const handleTyping = () => {
    if (!channelRef.current || !currentUser) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: true, senderId: currentUser.id },
    });

    typingTimeoutRef.current = setTimeout(() => {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'typing',
        payload: { isTyping: false, senderId: currentUser.id },
      });
    }, 2000);
  };

  if (loading || !otherUser) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
        </header>
        <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-3/4 self-end ml-auto" />
            <Skeleton className="h-16 w-2/3" />
        </main>
      </div>
    );
  }

  const userName = [otherUser.first_name, otherUser.last_name].filter(Boolean).join(' ') || "Usuário";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="-ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser.avatar_url || undefined} alt={userName} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{userName}</h1>
        </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender_id !== currentUser?.id && (
                 <Avatar className="w-8 h-8">
                    <AvatarImage src={otherUser.avatar_url || undefined} alt={userName} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  msg.sender_id === currentUser?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t bg-white dark:bg-black sticky bottom-0">
          {showContext && messages.length === 0 && (announcementContext || userId) && (
            <div className="mb-2">
              <ChatContext
                type={announcementContext ? 'announcement' : 'profile'}
                data={announcementContext || otherUser}
                onClose={() => setShowContext(false)}
              />
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
            />
            <Button type="submit" size="icon">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chat;