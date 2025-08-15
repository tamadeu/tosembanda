import { useParams, Link, useNavigate } from "react-router-dom";
import { mockAnnouncements } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, MessageSquare } from "lucide-react";
import { Layout } from "@/components/Layout";

const AnnouncementDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const announcement = mockAnnouncements.find((a) => a.id.toString() === id);

  if (!announcement) {
    return (
      <Layout title="Anúncio não encontrado">
        <div className="text-center">
          <p>O anúncio que você está procurando não existe ou foi removido.</p>
          <Button asChild className="mt-4">
            <Link to="/">Voltar para o Início</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="-ml-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-center flex-1 -ml-10">Detalhes</h1>
        </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
          <Card className="shadow-none border-none">
            <CardHeader className="p-0">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={announcement.user.avatarUrl} alt={announcement.user.name} />
                  <AvatarFallback>{announcement.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg font-bold">{announcement.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{announcement.user.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{announcement.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{announcement.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Habilidades e Interesses</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {announcement.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </main>

        <footer className="p-4 border-t bg-white dark:bg-black sticky bottom-0">
          <Button className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Entrar em contato
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default AnnouncementDetails;