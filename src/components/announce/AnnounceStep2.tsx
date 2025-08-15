import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface AnnounceStep2Props {
  type: 'musician' | 'band';
  onBack: () => void;
  onSubmit: () => void;
}

const AnnounceStep2 = ({ type, onBack, onSubmit }: AnnounceStep2Props) => {
  const [tags, setTags] = useState<string[]>([]);
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
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {type === 'band' && (
        <div className="space-y-2">
          <Label htmlFor="bandName">Nome da Banda/Projeto</Label>
          <Input id="bandName" placeholder="Ex: The Garage Band" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título do Anúncio</Label>
        <Input id="title" placeholder={type === 'musician' ? "Ex: Guitarrista de Blues disponível" : "Ex: Procura-se baixista para banda de Rock"} />
      </div>

      {type === 'musician' && (
        <div className="space-y-2">
          <Label htmlFor="experience">Tempo de Experiência</Label>
          <Input id="experience" placeholder="Ex: 5 anos" />
        </div>
      )}

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

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" className="w-full">
          Publicar Anúncio
        </Button>
      </div>
    </form>
  );
};

export default AnnounceStep2;