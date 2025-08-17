import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, LogOut, MapPin, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AnnouncementWithProfile } from "@/lib/types";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndAnnouncements = async () => {
      if (!user) return;

      setLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        setProfile(profileData);
      }

      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*, profile:profiles!user_id(name, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (announcementsError) {
        console.error("Error fetching user announcements:", announcementsError);
      } else {
        setAnnouncements(announcementsData as AnnouncementWithProfile[]);
      }

      setLoading(false);
    };

    if (user) {
      fetchProfileAndAnnouncements();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <Layout title="Perfil">
        <div className="space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-32 mx-auto" />
          <div className="flex justify-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout title="Perfil">
        <p>Não foi possível carregar o perfil.</p>
      </Layout>
    );
  }

  return (
    <Layout title="Perfil">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={profile.avatar_url} alt={profile.name} />
          <AvatarFallback>{profile.name ? profile.name.charAt(0) : user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{profile.name || 'Novo Usuário'}</h2>
          <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{profile.location || 'Localização não definida'}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
            </Button>
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
          <CardTitle>Meus Anúncios</CardTitle>
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
              <p className="mb-4">Você ainda não publicou nenhum anúncio.</p>
              <Button asChild>
                <Link to="/announce">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Criar meu primeiro anúncio
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Profile;