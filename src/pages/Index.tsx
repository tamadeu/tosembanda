import { AnnouncementCard, Announcement } from "@/components/AnnouncementCard";
import { Home, Search, PlusSquare, User, Bell } from "lucide-react";

const announcements: Announcement[] = [
  {
    id: 1,
    user: {
      name: "Carla Dias",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    title: "Procura-se baixista para banda de Rock",
    location: "São Paulo, SP",
    description: "Somos uma banda de rock alternativo com repertório autoral e alguns covers. Procuramos um baixista comprometido para ensaios semanais e shows.",
    tags: ["Baixista", "Rock Alternativo", "Autoral"],
  },
  {
    id: 2,
    user: {
      name: "Marcos Andrade",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    title: "Vocalista disponível para projetos",
    location: "Rio de Janeiro, RJ",
    description: "Sou vocalista com experiência em MPB e Bossa Nova. Tenho disponibilidade para shows em bares, eventos e gravações. Timbre suave.",
    tags: ["Vocalista", "MPB", "Bossa Nova", "Freelancer"],
  },
  {
    id: 3,
    user: {
      name: "Banda Scapegoat",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    title: "Baterista para banda de Metal",
    location: "Belo Horizonte, MG",
    description: "Procuramos um baterista versátil e com pegada para completar nossa formação. Ensaiamos aos sábados. Influências: Metallica, Pantera.",
    tags: ["Baterista", "Metal", "Compromisso"],
  },
];

const Index = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-black min-h-screen flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
          <h1 className="text-xl font-bold text-center">MusiConnect</h1>
        </header>

        <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </main>

        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white dark:bg-black border-t">
          <nav className="flex justify-around items-center p-2">
            <a href="#" className="flex flex-col items-center text-primary p-2">
              <Home className="h-6 w-6" />
              <span className="text-xs font-medium">Início</span>
            </a>
            <a href="#" className="flex flex-col items-center text-gray-500 hover:text-primary p-2">
              <Search className="h-6 w-6" />
              <span className="text-xs">Buscar</span>
            </a>
            <a href="#" className="flex flex-col items-center text-gray-500 hover:text-primary p-2">
              <PlusSquare className="h-6 w-6" />
              <span className="text-xs">Anunciar</span>
            </a>
            <a href="#" className="flex flex-col items-center text-gray-500 hover:text-primary p-2">
              <Bell className="h-6 w-6" />
              <span className="text-xs">Notificações</span>
            </a>
            <a href="#" className="flex flex-col items-center text-gray-500 hover:text-primary p-2">
              <User className="h-6 w-6" />
              <span className="text-xs">Perfil</span>
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Index;