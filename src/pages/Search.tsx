import { useState, useEffect } from "react";
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
import { AnnouncementWithProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const instruments = ["Guitarra", "Baixo", "Bateria", "Vocal", "Teclado", "Violino", "Saxofone"];
const genres = ["Rock", "Pop", "MPB", "Jazz", "Metal", "Samba", "Funk", "Sertanejo"];
const goals = ["Entrar em uma banda", "Show/Evento", "Gravação", "Freelancer"];
const suggestions = ["Vocalista", "Guitarra Rock", "Bateria Metal", "Baixo MPB", "Freelancer"];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [instrument, setInstrument] = useState("");
  const [genre, setGenre] = useState("");
  const [goal, setGoal] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  
  const [activeFilters, setActiveFilters] = useState({ instrument: "", genre: "", goal: "", type: "", state: "", city: "" });
  const [results, setResults] = useState<AnnouncementWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;

  useEffect(() => {
    if (state) {
      const stateData = states.find(s => s.sigla === state);
      setCities(stateData ? stateData.cidades : []);
      setCity("");
    } else {
      setCities([]);
      setCity("");
    }
  }, [state]);

  const handleApplyFilters = () => {
    setActiveFilters({ instrument, genre, goal, type, state, city });
  };

  const clearFilters = () => {
    setInstrument("");
    setGenre("");
    setGoal("");
    setType("");
    setState("");
    setCity("");
    setActiveFilters({ instrument: "", genre: "", goal: "", type: "", state: "", city: "" });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm === "" && activeFiltersCount === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      
      const tagsToFilter = [activeFilters.instrument, activeFilters.genre, activeFilters.goal].filter(Boolean);

      const { data, error } = await supabase.rpc('search_announcements', {
        p_search_term: searchTerm || null,
        p_type: activeFilters.type || null,
        p_state: activeFilters.state || null,
        p_city: activeFilters.city || null,
        p_tags: tagsToFilter.length > 0 ? tagsToFilter : null,
      });

      if (error) {
        console.error("Error searching announcements:", error);
        setResults([]);
      } else {
        setResults((data as any[] as AnnouncementWithProfile[]) || []);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, activeFilters, activeFiltersCount]);

  const showSuggestions = searchTerm === "" && activeFiltersCount === 0;

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

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </>
        ) : showSuggestions ? (
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
        ) : results.length > 0 ? (
          results.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
            <p className="text-sm text-muted-foreground/80">Tente ajustar sua busca ou filtros.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;