export type Location = {
  state: string;
  city: string;
  neighborhood?: string;
};

export type Announcement = {
  id: number;
  user: {
    name: string;
    avatarUrl: string;
  };
  title: string;
  location: Location;
  description: string;
  tags: string[];
  type: 'musician' | 'band';
};

export const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    user: { name: "Carla Dias", avatarUrl: "https://i.pravatar.cc/150?img=1" },
    title: "Procura-se baixista para banda de Rock",
    location: { city: "São Paulo", state: "SP" },
    description: "Somos uma banda de rock alternativo com repertório autoral e alguns covers. Procuramos um baixista comprometido para ensaios semanais e shows.",
    tags: ["Baixo", "Rock", "Entrar em uma banda"],
    type: 'band',
  },
  {
    id: 2,
    user: { name: "Marcos Andrade", avatarUrl: "https://i.pravatar.cc/150?img=2" },
    title: "Vocalista disponível para projetos",
    location: { city: "Rio de Janeiro", state: "RJ" },
    description: "Sou vocalista com experiência em MPB e Bossa Nova. Tenho disponibilidade para shows em bares, eventos e gravações. Timbre suave.",
    tags: ["Vocal", "MPB", "Freelancer", "Show/Evento"],
    type: 'musician',
  },
  {
    id: 3,
    user: { name: "Banda Scapegoat", avatarUrl: "https://i.pravatar.cc/150?img=3" },
    title: "Baterista para banda de Metal",
    location: { city: "Belo Horizonte", state: "MG" },
    description: "Procuramos um baterista versátil e com pegada para completar nossa formação. Ensaiamos aos sábados. Influências: Metallica, Pantera.",
    tags: ["Bateria", "Metal", "Entrar em uma banda"],
    type: 'band',
  },
  {
    id: 4,
    user: { name: "Juliana Lima", avatarUrl: "https://i.pravatar.cc/150?img=5" },
    title: "Tecladista para banda de Pop Rock",
    location: { city: "Curitiba", state: "PR" },
    description: "Banda de pop rock com agenda de shows procura tecladista com equipamento próprio. Ensaios duas vezes por semana.",
    tags: ["Teclado", "Pop", "Rock", "Entrar em uma banda"],
    type: 'band',
  },
  {
    id: 5,
    user: { name: "Fernando Alves", avatarUrl: "https://i.pravatar.cc/150?img=6" },
    title: "Guitarrista para gravações",
    location: { city: "Porto Alegre", state: "RS" },
    description: "Ofereço meus serviços como guitarrista para gravação de trilhas, jingles e álbuns. Toco diversos estilos, do Jazz ao Metal.",
    tags: ["Guitarra", "Jazz", "Metal", "Gravação"],
    type: 'musician',
  },
  // ... (o restante dos dados seguiria o mesmo padrão)
  {
    id: 51,
    user: { name: "Alexandre Costa", avatarUrl: "https://i.pravatar.cc/150?img=4" },
    title: "Guitarrista de Blues/Rock busca banda",
    location: { city: "Curitiba", state: "PR" },
    description: "Guitarrista com 10 anos de experiência, focado em Blues e Rock Clássico. Procuro banda para shows e gravações. Influências: B.B. King, Eric Clapton, Jimi Hendrix.",
    tags: ["Guitarra", "Blues", "Rock", "Entrar em uma banda"],
    type: 'musician',
  },
  {
    id: 52,
    user: { name: "Alexandre Costa", avatarUrl: "https://i.pravatar.cc/150?img=4" },
    title: "Aulas de Guitarra e Violão",
    location: { city: "Curitiba", state: "PR" },
    description: "Ofereço aulas particulares de guitarra e violão para iniciantes e intermediários. Foco em técnica, teoria e repertório popular.",
    tags: ["Aulas", "Guitarra", "Violão", "Freelancer"],
    type: 'musician',
  }
];