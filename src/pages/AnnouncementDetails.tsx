import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementWithProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import PullToRefresh from "react-simple-pull-to-refresh";

const AnnouncementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<AnnouncementWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*, profile:profiles!user_id(first_name, last_name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching announcement details:", error);
      } else {
        setAnnouncement(data);
      }
      setLoading(false);
    };

    fetchAnnouncement();
  }, [id]);

  const handleRefresh = async () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p>O anúncio que você está procurando não existe ou foi removido.</p>
          <Button asChild className="mt-4">
            <Link to="/">Voltar para o Início</Link>
          </Button>
        </div>
      </div>
    );
  }

  const userName = [announcement.profile?.first_name, announcement.profile?.last_name].filter(Boolean).join(' ') || "Usuário Anônimo";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            <h1 className="text-xl font-bold text-center">Detalhes</h1>
          </header>
          <PullToRefresh onRefresh={handleRefresh}>
            <main className="p-4 space-y-4">
              <Card className="shadow-none border-none">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={announcement.profile?.avatar_url || undefined} alt={userName} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold">{announcement.title}</CardTitle>
                      <Link to={`/user/${announcement.user_id}`} className="text-sm text-muted-foreground hover:underline">
                        {userName}
                      </Link>
                      {announcement.location && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{`${announcement.location.city}, ${announcement.location.state}`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">{announcement.description}</p>
                </CardContent>
              </Card>

              {announcement.instruments && announcement.instruments.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Instrumentos</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {announcement.instruments.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                  </CardContent>
                </Card>
              )}
              {announcement.genres && announcement.genres.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Gêneros Musicais</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {announcement.genres.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                  </CardContent>
                </Card>
              )}
              {announcement.objectives && announcement.objectives.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Objetivos</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {announcement.objectives.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                  </CardContent>
                </Card>
              )}
              {announcement.tags && announcement.tags.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Outras Tags</CardTitle></CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {announcement.tags.map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
                  </CardContent>
                </Card>
              )}
            </main>
          </PullToRefresh>
        </div>
        <footer className="p-4 border-t bg-white dark:bg-black">
          <Button asChild className="w-full">
            <Link to={`/chat/announcement/${announcement.id}?source=announcement`}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Entrar em contato
            </Link>
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AnnouncementDetails;