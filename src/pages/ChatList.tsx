import { useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showError, showSuccess } from "@/utils/toast";

type Conversation = {
  conversation_id: string;
  other_user_id: string;
  other_user_first_name: string | null;
  other_user_last_name: string | null;
  other_user_avatar_url: string | null;
  last_message_content: string | null;
  last_message_created_at: string | null;
};

const ChatList = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase.rpc('get_user_conversations', { p_user_id: user.id });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      setConversations(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (user && (payload.new.sender_id === user.id || payload.new.receiver_id === user.id)) {
            fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  const handleDeleteConfirm = async () => {
    if (!deletingConversationId || !user) return;

    const { data: convData, error: fetchError } = await supabase
      .from('conversations')
      .select('participant1_id')
      .eq('id', deletingConversationId)
      .single();

    if (fetchError || !convData) {
      showError("Não foi possível encontrar a conversa para excluir.");
      setDeletingConversationId(null);
      return;
    }

    const columnToUpdate = convData.participant1_id === user.id
      ? { participant1_deleted: true }
      : { participant2_deleted: true };

    const { error: updateError } = await supabase
      .from('conversations')
      .update(columnToUpdate)
      .eq('id', deletingConversationId);

    if (updateError) {
      showError("Erro ao excluir a conversa.");
    } else {
      showSuccess("Conversa excluída.");
      setConversations(prev => prev.filter(c => c.conversation_id !== deletingConversationId));
    }

    setDeletingConversationId(null);
  };

  if (loading) {
    return (
      <Layout title="Conversas">
        <div className="space-y-2">
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Conversas">
      {conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map((convo) => {
            const userName = [convo.other_user_first_name, convo.other_user_last_name].filter(Boolean).join(' ') || "Usuário";
            const timeAgo = convo.last_message_created_at 
              ? formatDistanceToNow(new Date(convo.last_message_created_at), { addSuffix: true, locale: ptBR })
              : '';

            return (
              <div key={convo.conversation_id} className="flex items-center gap-2 group rounded-lg hover:bg-muted/50 transition-colors">
                <Link
                  to={`/chat/user/${convo.other_user_id}`}
                  className="block p-4 flex-1"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border">
                      <AvatarImage src={convo.other_user_avatar_url || undefined} alt={userName} />
                      <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold truncate">{userName}</p>
                        <p className="text-xs text-muted-foreground flex-shrink-0">{timeAgo}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{convo.last_message_content || "Nenhuma mensagem ainda."}</p>
                    </div>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setDeletingConversationId(convo.conversation_id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Você não tem nenhuma conversa.</p>
          <p className="text-sm text-muted-foreground/80">Quando você entrar em contato com alguém, sua conversa aparecerá aqui.</p>
        </div>
      )}
      <AlertDialog open={!!deletingConversationId} onOpenChange={() => setDeletingConversationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A conversa será removida da sua lista, mas a outra pessoa ainda poderá vê-la.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default ChatList;