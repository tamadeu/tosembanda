import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, MapPin, Settings, PlusCircle } from "lucide-react";
import { mockAnnouncements } from "@/lib/mock-data";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = {
    name: "Alexandre Costa",
    avatarUrl: "https://i.pravatar.cc/150?img=4",
    location: "Curitiba, PR",
    bio: "Guitarrista há 10 anos, apaixonado por Blues e Rock Clássico. Buscando projetos para tocar ao vivo e gravar. Influências: B.B. King, Eric Clapton, Jimi Hendrix.",
    skills: ["Guitarra Elétrica", "Violão", "Composição", "Blues", "Rock"],
  };

  const userAnnouncements = mockAnnouncements.filter(
    (ann) => ann.user.name === user.name
  );

  return (
    <Layout title="Perfil">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <div className="flex items-center justify-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{user.location}</span>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
            </Button>
            <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
            </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80">{user.bio}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habilidades e Interesses</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {user.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meus Anúncios</CardTitle>
        </CardHeader>
        <CardContent>
          {userAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {userAnnouncements.map((announcement) => (
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