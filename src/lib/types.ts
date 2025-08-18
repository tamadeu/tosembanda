// Este tipo representa a estrutura de um perfil de usuário vindo do Supabase.
export type Profile = {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

// Este tipo representa a estrutura do campo de localização JSONB nos anúncios.
export type AnnouncementLocation = {
  state: string;
  city: string;
  neighborhood?: string | null;
};

// Este é o tipo principal que usaremos na aplicação.
// Ele representa um anúncio com as informações do criador já incluídas.
export type AnnouncementWithProfile = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'musician' | 'band';
  location: AnnouncementLocation | null;
  tags: string[] | null;
  band_name: string | null;
  experience: string | null;
  profile: Profile | null;
  instruments: string[] | null;
  genres: string[] | null;
  objectives: string[] | null;
};

// Novo tipo para o resultado da busca de perfis
export type ProfileSearchResult = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  skills: string[] | null;
  location: {
    state: string;
    city: string;
  } | null;
};