import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const Announce = () => {
  const [tags, setTags] = useState<string[]>(["Rock", "Guitarra"]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.find(t => t.toLowerCase() === tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Layout title="Criar Anúncio">
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Anúncio</Label>
          <Input id="title" placeholder="Ex: Baixista para banda de Rock" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Você está anunciando como?</Label>
          <Select>
            <SelectTrigger id="type">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="musician">Músico procurando oportunidade</SelectItem>
              <SelectItem value="band">Banda procurando integrante</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Fale mais sobre o que você procura, influências, disponibilidade, etc."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localização</Label>
          <Input id="location" placeholder="Ex: Curitiba, PR" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Habilidades e Interesses (Tags)</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Adicione uma tag e pressione Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-background/50">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Publicar Anúncio
        </Button>
      </form>
    </Layout>
  );
};

export default Announce;