import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states, City } from "@/lib/location-data";
import { instruments, genres, objectives } from "@/lib/music-data";
import { MultiSelectBadges } from "../MultiSelectBadges";

interface AnnounceStep2Props {
  type: 'musician' | 'band';
  onBack: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialData?: any;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const AnnounceStep2 = ({ 
  type, 
  onBack, 
  onSubmit, 
  isSubmitting, 
  initialData, 
  submitButtonText = "Publicar Anúncio",
  cancelButtonText = "Voltar"
}: AnnounceStep2Props) => {
  const [formData, setFormData] = useState({
    bandName: initialData?.band_name || "",
    title: initialData?.title || "",
    experience: initialData?.experience || "",
    description: initialData?.description || "",
    state: initialData?.location?.state || "",
    city: initialData?.location?.city || "",
    neighborhood: initialData?.location?.neighborhood || "",
    instruments: initialData?.instruments || [],
    genres: initialData?.genres || [],
    objectives: initialData?.objectives || [],
    tags: initialData?.tags || [],
  });
  const [tagInput, setTagInput] = useState("");
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    if (formData.state) {
      const stateData = states.find(s => s.sigla === formData.state);
      setCities(stateData ? stateData.cidades : []);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'state') {
      setFormData(prev => ({ ...prev, city: "" }));
    }
  };

  const handleToggle = (field: 'instruments' | 'genres' | 'objectives') => (option: string) => {
    setFormData(prev => {
        const currentSelection = prev[field] as string[];
        const newSelection = currentSelection.includes(option)
            ? currentSelection.filter(item => item !== option)
            : [...currentSelection, option];
        return { ...prev, [field]: newSelection };
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.find(t => t.toLowerCase() === tagInput.trim().toLowerCase())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {type === 'band' && (
        <div className="space-y-2">
          <Label htmlFor="bandName">Nome da Banda/Projeto</Label>
          <Input id="bandName" placeholder="Ex: The Garage Band" value={formData.bandName} onChange={handleChange} required />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título do Anúncio</Label>
        <Input id="title" placeholder={type === 'musician' ? "Ex: Guitarrista de Blues disponível" : "Ex: Procura-se baixista para banda de Rock"} value={formData.title} onChange={handleChange} required />
      </div>

      {type === 'musician' && (
        <div className="space-y-2">
          <Label htmlFor="experience">Tempo de Experiência</Label>
          <Input id="experience" placeholder="Ex: 5 anos" value={formData.experience} onChange={handleChange} />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Fale mais sobre o que você procura, influências, disponibilidade, etc."
          rows={5}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-4">
        <MultiSelectBadges
          label="Instrumentos"
          options={instruments}
          selected={formData.instruments}
          onToggle={handleToggle('instruments')}
        />
        <MultiSelectBadges
          label="Gêneros Musicais"
          options={genres}
          selected={formData.genres}
          onToggle={handleToggle('genres')}
        />
        <MultiSelectBadges
          label="Objetivos"
          options={objectives}
          selected={formData.objectives}
          onToggle={handleToggle('objectives')}
        />
      </div>

      <div className="space-y-2">
        <Label>Localização</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state" className="text-xs text-muted-foreground">Estado</Label>
            <Select value={formData.state} onValueChange={handleSelectChange('state')} required>
              <SelectTrigger id="state">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.sigla} value={state.sigla}>
                    {state.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-xs text-muted-foreground">Cidade</Label>
            <Select value={formData.city} onValueChange={handleSelectChange('city')} disabled={!formData.state} required>
              <SelectTrigger id="city">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.nome} value={city.nome}>
                    {city.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <Label htmlFor="neighborhood" className="text-xs text-muted-foreground">Bairro (Opcional)</Label>
          <Input id="neighborhood" placeholder="Ex: Centro" value={formData.neighborhood} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Outras Tags (Opcional)</Label>
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
          {formData.tags.map((tag) => (
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
        <Button type="button" variant="outline" className="w-full" onClick={onBack} disabled={isSubmitting}>
          {cancelButtonText}
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default AnnounceStep2;