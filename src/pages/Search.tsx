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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { states, City } from "@/lib/location-data";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementWithProfile, ProfileSearchResult } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/ProfileCard";
import { instruments as instrumentOptions, genres as genreOptions, objectives as objectiveOptions } from "@/lib/music-data";
import { MultiSelectBadges } from "@/components/MultiSelectBadges";

const suggestions = ["Vocalista", "Guitarra Rock", "Bateria Metal", "Baixo MPB", "Freelancer"];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const [type, setType] = useState(searchParams.get('type') || "");
  const [state, setState] = useState(searchParams.get('state') || "");
  const [city, setCity] = useState(searchParams.get('city') || "");
  const [cities, setCities] = useState<City[]>([]);
  const [instruments, setInstruments] = useState<string[]>(searchParams.get('instruments')?.split(',') || []);
  const [genres, setGenres] = useState<string[]>(searchParams.get('genres')?.split(',') || []);
  const [objectives, setObjectives] = useState<string[]>(searchParams.get('objectives')?.split(',') || []);
  
  const [announcements, setAnnouncements] = useState<AnnouncementWithProfile[]>([]);
  const [profiles, setProfiles] = useState<ProfileSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("announcements");

  useEffect(() => {
    const getArrayParam = (name: string) => searchParams.get(name)?.split(',').filter(Boolean) || [];
    setSearchTerm(searchParams.get('q') || '');
    setType(searchParams.get('type') || '');
    const stateParam = searchParams.get('state') || '';
    setState(stateParam);
    setInstruments(getArrayParam('instruments'));
    setGenres(getArrayParam('genres'));
    setObjectives(getArrayParam('objectives'));

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
      const getArrayParam = (name: string) => searchParams.get(name)?.split(',').filter(Boolean) || [];
      const q = searchParams.get('q') || '';
      const typeParam = searchParams.get('type') || '';
      const stateParam = searchParams.get('state') || '';
      const cityParam = searchParams.get('city') || '';
      const instrumentsParam = getArrayParam('instruments');
      const genresParam = getArrayParam('genres');
      const objectivesParam = getArrayParam('objectives');

      const hasSearchParams = q || typeParam || stateParam || cityParam || instrumentsParam.length > 0 || genresParam.length > 0 || objectivesParam.length > 0;

      if (!hasSearchParams) {
        setAnnouncements([]);
        setProfiles([]);
        return;
      }

      setIsLoading(true);

      const [announcementsResponse, profilesResponse] = await Promise.all([
        supabase.rpc('search_announcements', {
          p_search_term: q || null,
          p_type: typeParam || null,
          p_state: stateParam || null,
          p_city: cityParam || null,
          p_tags: null,
          p_instruments: instrumentsParam.length > 0 ? instrumentsParam : null,
          p_genres: genresParam.length > 0 ? genresParam : null,
          p_objectives: objectivesParam.length > 0 ? objectivesParam : null,
        }),
        supabase.rpc('search_profiles', {
          p_search_term: q || null,
          p_state: stateParam || null,
          p_city: cityParam || null,
          p_tags: [...instrumentsParam, ...genresParam, ...objectivesParam].length > 0 ? [...instrumentsParam, ...genresParam, ...objectivesParam] : null,
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
        setProfiles((profilesResponse.data as any[] as ProfileSearchResult[]) || []);
      } else {
        setProfiles((profilesResponse.data as any[] as ProfileSearchResult[]) || []);
      }

      setIsLoading(false);
    };

    performSearch();
  }, [searchParams]);

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    const updateParam = (key: string, value: string | string[]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) newParams.set(key, value.join(','));
        else newParams.delete(key);
      } else {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      }
    };
    
    updateParam('type', type);
    updateParam('state', state);
    updateParam('city', city);
    updateParam('instruments', instruments);
    updateParam('genres', genres);
    updateParam('objectives', objectives);

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setType("");
    setState("");
    setCity("");
    setInstruments([]);
    setGenres([]);
    setObjectives([]);

    const newParams = new URLSearchParams(searchParams);
    ['type', 'state', 'city', 'instruments', 'genres', 'objectives'].forEach(key => newParams.delete(key));
    setSearchParams(newParams);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const handleToggle = (field: 'instruments' | 'genres' | 'objectives') => (option: string) => {
    const setter = { instruments: setInstruments, genres: setGenres, objectives: setObjectives }[field];
    setter(prev => {
        return prev.includes(option)
            ? prev.filter(item => item !== option)
            : [...prev, option];
    });
  };

  const activeFiltersCount = ['type', 'state', 'city'].filter(key => searchParams.has(key)).length + instruments.length + genres.length + objectives.length;
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
                <MultiSelectBadges label="Instrumentos" options={instrumentOptions} selected={instruments} onToggle={handleToggle('instruments')} />
                <MultiSelectBadges label="Gêneros Musicais" options={genreOptions} selected={genres} onToggle={handleToggle('genres')} />
                <MultiSelectBadges label="Objetivos" options={objectiveOptions} selected={objectives} onToggle={handleToggle('objectives')} />
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