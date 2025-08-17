import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementWithProfile } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

const PublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);

      const [profileResponse, announcementsResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('announcements').select('*, profile:profiles!user_id(first_name, last_name, avatar_url)').eq('user_id', id).order('created_at', { ascending: false })
      ]);

      if (profileResponse.error || !profileResponse.data) {
        console.error("Error fetching profile:", profileResponse.error);
        setLoading(false);
        return;
      }
      
      setProfile(profileResponse.data);
      
      if (announcementsResponse.data) {
        setAnnouncements(announcementsResponse.data as AnnouncementWithProfile[]);
      }

      setLoading(false);

      // Se houver um usuário logado e ele não for o dono do perfil, cria a notificação.
      if (currentUser && currentUser.id !== id) {
        await supabase.functions.invoke('create-profile-view-notification', {
          body: { profileOwnerId: id },
        });
      }
    };

    fetchPublicProfile();
  }, [id, navigate, currentUser]);

  if (loading) {
    return (
      <Layout title="Perfil">
        <div className="space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout title="Perfil não encontrado">
        <div className="text-center py-10">
          <p>Este usuário não foi encontrado.</p>
          <Button asChild variant="link" className="mt-4">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Usuário';
  const locationString = [profile.location?.city, profile.location?.state].filter(Boolean).join(', ') || 'Localização não definida';
  const fallbackInitial = fullName.charAt(0).toUpperCase();

  return (
    <Layout title={`Perfil de ${profile.first_name || 'Usuário'}`}>
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={profile.avatar_url} alt={fullName} />
          <AvatarFallback>{fallbackInitial}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{fullName}</h2>
          <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{locationString}</span>
          </div>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80">{profile.bio || 'Nenhuma biografia adicionada.'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habilidades e Interesses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {profile.skills?.length > 0 ? profile.skills.map((skill: string) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          )) : <p className="text-sm text-muted-foreground">Nenhuma habilidade adicionada.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anúncios de {profile.first_name || 'Usuário'}</CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>Este usuário não publicou nenhum anúncio.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default PublicProfile;