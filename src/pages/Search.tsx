import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { states, City } from "@/lib/location-data";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementWithProfile, ProfileSearchResult } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/ProfileCard";

const instruments = ["Guitarra", "Baixo", "Bateria", "Vocal", "Teclado", "Violino", "Saxofone"];
const genres = ["Rock", "Pop", "MPB", "Jazz", "Metal", "Samba", "Funk", "Sertanejo"];
const goals = ["Entrar em uma banda", "Show/Evento", "Gravação", "Freelancer"];
const suggestions = ["Vocalista", "Guitarra Rock", "Bateria Metal", "Baixo MPB", "Freelancer"];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const [instrument, setInstrument] = useState(searchParams.get('instrument') || "");
  const [genre, setGenre] = useState(searchParams.get('genre') || "");
  const [goal, setGoal] = useState(searchParams.get('goal') || "");
  const [type, setType] = useState(searchParams.get('type') || "");
  const [state, setState] = useState(searchParams.get('state') || "");
  const [city, setCity] = useState(searchParams.get('city') || "");
  const [cities, setCities] = useState<City[]>([]);
  
  const [announcements, setAnnouncements] = useState<AnnouncementWithProfile[]>([]);
  const [profiles, setProfiles] = useState<ProfileSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("announcements");

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setInstrument(searchParams.get('instrument') || '');
    setGenre(searchParams.get('genre') || '');
    setGoal(searchParams.get('goal') || '');
    setType(searchParams.get('type') || '');
    const stateParam = searchParams.get('state') || '';
    setState(stateParam);
    if (stateParam) {
        const stateData = states.find(s => s.sigla === stateParam);
        if (stateData) {
            setCities(stateData.cidades);
            setCity(searchParams.get('city') || '');
        }
    } else {
        setCities([]);
        setCity('');
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm) {
        newParams.set('q', searchTerm);
      } else {
        newParams.delete('q');
      }
      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams, { replace: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, searchParams, setSearchParams]);

  useEffect(() => {
    const performSearch = async () => {
      const q = searchParams.get('q') || '';
      const typeParam = searchParams.get('type') || '';
      const stateParam = searchParams.get('state') || '';
      const cityParam = searchParams.get('city') || '';
      const instrumentParam = searchParams.get('instrument') || '';
      const genreParam = searchParams.get('genre') || '';
      const goalParam = searchParams.get('goal') || '';

      const hasSearchParams = q || typeParam || stateParam || cityParam || instrumentParam || genreParam || goalParam;

      if (!hasSearchParams) {
        setAnnouncements([]);
        setProfiles([]);
        return;
      }

      setIsLoading(true);
      const tagsToFilter = [instrumentParam, genreParam, goalParam].filter(Boolean);

      const [announcementsResponse, profilesResponse] = await Promise.all([
        supabase.rpc('search_announcements', {
          p_search_term: q || null,
          p_type: typeParam || null,
          p_state: stateParam || null,
          p_city: cityParam || null,
          p_tags: tagsToFilter.length > 0 ? tagsToFilter : null,
        }),
        supabase.rpc('search_profiles', {
          p_search_term: q || null,
          p_state: stateParam || null,
          p_city: cityParam || null,
          p_tags: tagsToFilter.length > 0 ? tagsToFilter : null,
        })
      ]);

      if (announcementsResponse.error) {
        console.error("Error searching announcements:", announcementsResponse.error);
        setAnnouncements([]);
      } else {
        setAnnouncements((announcementsResponse.data as any[] as AnnouncementWithProfile[]) || []);
      }

      if (profilesResponse.error) {
        console.error("Error searching profiles:", profilesResponse.error);
        setProfiles([]);
      } else {
        setProfiles((profilesResponse.data as any[] as ProfileSearchResult[]) || []);
      }

      setIsLoading(false);
    };

    performSearch();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    const updateParam = (key: string, value: string) => value ? newParams.set(key, value) : newParams.delete(key);
    
    updateParam('type', type);
    updateParam('state', state);
    updateParam('city', city);
    updateParam('instrument', instrument);
    updateParam('genre', genre);
    updateParam('goal', goal);

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setInstrument("");
    setGenre("");
    setGoal("");
    setType("");
    setState("");
    setCity("");

    const newParams = new URLSearchParams(searchParams);
    ['type', 'state', 'city', 'instrument', 'genre', 'goal'].forEach(key => newParams.delete(key));
    setSearchParams(newParams);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const activeFiltersCount = ['type', 'state', 'city', 'instrument', 'genre', 'goal'].filter(key => searchParams.has(key)).length;
  const showSuggestions = searchParams.toString() === '';

  const renderLoadingSkeleton = () => (
    <div className="space-y-4 mt-4">
      <Skeleton className="h-[150px] w-full rounded-xl" />
      <Skeleton className="h-[150px] w-full rounded-xl" />
    </div>
  );

  const renderNoResults = (message: string) => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-muted-foreground">{message}</p>
      <p className="text-sm text-muted-foreground/80">Tente ajustar sua busca ou filtros.</p>
    </div>
  );

  return (
    <Layout title="Buscar">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Busque por músicos, bandas..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="w-full max-w-md mx-auto">
              <DrawerHeader>
                <DrawerTitle>Filtros</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((s) => (
                          <SelectItem key={s.sigla} value={s.sigla}>{s.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Select value={city} onValueChange={setCity} disabled={!state}>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c.nome} value={c.nome}>{c.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Anúncio</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="musician">Músico procurando</SelectItem>
                      <SelectItem value="band">Banda procurando</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instrument">Instrumento</Label>
                  <Select value={instrument} onValueChange={setInstrument}>
                    <SelectTrigger id="instrument">
                      <SelectValue placeholder="Selecione um instrumento" />
                    </SelectTrigger>
                    <SelectContent>
                      {instruments.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Gênero Musical</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Objetivo</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Selecione um objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DrawerFooter className="flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={clearFilters}>Limpar</Button>
                <DrawerClose asChild>
                  <Button className="flex-1" onClick={handleApplyFilters}>Aplicar</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {showSuggestions ? (
        <div className="text-center pt-8">
          <p className="text-muted-foreground mb-4">Tente buscar por:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="announcements">
              Anúncios <Badge variant={activeTab === 'announcements' ? 'default' : 'secondary'} className="ml-2">{announcements.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="profiles">
              Perfis <Badge variant={activeTab === 'profiles' ? 'default' : 'secondary'} className="ml-2">{profiles.length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="announcements">
            {isLoading ? renderLoadingSkeleton() : announcements.length > 0 ? (
              <div className="space-y-4 mt-4">
                {announcements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
              </div>
            ) : renderNoResults("Nenhum anúncio encontrado.")}
          </TabsContent>
          <TabsContent value="profiles">
            {isLoading ? renderLoadingSkeleton() : profiles.length > 0 ? (
              <div className="space-y-4 mt-4">
                {profiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : renderNoResults("Nenhum perfil encontrado.")}
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
};

export default Search;