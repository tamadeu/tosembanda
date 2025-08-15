import { useState } from "react";
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

const instruments = ["Guitarra", "Baixo", "Bateria", "Vocal", "Teclado", "Violino", "Saxofone"];
const genres = ["Rock", "Pop", "MPB", "Jazz", "Metal", "Samba", "Funk", "Sertanejo"];
const goals = ["Entrar em uma banda", "Show/Evento", "Gravação", "Freelancer"];

const Search = () => {
  const [instrument, setInstrument] = useState("");
  const [genre, setGenre] = useState("");
  const [goal, setGoal] = useState("");

  const activeFiltersCount = [instrument, genre, goal].filter(Boolean).length;

  const clearFilters = () => {
    setInstrument("");
    setGenre("");
    setGoal("");
  };

  return (
    <Layout title="Buscar">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Busque por músicos, bandas..."
            className="pl-10 w-full"
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
                  <Button className="flex-1">Aplicar</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">Faça uma busca ou use os filtros para encontrar músicos, bandas e oportunidades.</p>
      </div>
    </Layout>
  );
};

export default Search;