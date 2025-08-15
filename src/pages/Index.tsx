import { AnnouncementCard, Announcement } from "@/components/AnnouncementCard";
import { Layout } from "@/components/Layout";

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
    <Layout title="MusiConnect">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </Layout>
  );
};

export default Index;