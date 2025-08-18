import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { showError, showSuccess } from "@/utils/toast";
import { Loader2, Plus, X } from "lucide-react";
import { AvatarUpload } from "@/components/AvatarUpload";

const profileSchema = z.object({
  first_name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  last_name: z.string().min(2, { message: "O sobrenome deve ter pelo menos 2 caracteres." }),
  state: z.string().optional(),
  city: z.string().optional(),
  neighborhood: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dbStates, setDbStates] = useState<{ id: number; sigla: string; nome: string }[]>([]);
  const [dbCities, setDbCities] = useState<{ nome: string; capital: number }[]>([]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      state: "",
      city: "",
      neighborhood: "",
      bio: "",
      skills: [],
    },
  });

  const selectedState = form.watch('state');

  useEffect(() => {
    const fetchStates = async () => {
      const { data, error } = await supabase.from('estados').select('id, sigla, nome').order('nome');
      if (data) {
        setDbStates(data);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState && dbStates.length > 0) {
        const stateData = dbStates.find(s => s.sigla === selectedState);
        if (stateData) {
          const { data, error } = await supabase
            .from('municipios')
            .select('nome, capital')
            .eq('ufid', stateData.id)
            .order('capital', { ascending: false })
            .order('nome', { ascending: true });
          if (data) {
            setDbCities(data);
          }
        }
      } else {
        setDbCities([]);
      }
    };
    fetchCities();
  }, [selectedState, dbStates]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        showError("Erro ao carregar o perfil.");
        navigate('/profile');
      } else if (data) {
        form.reset({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          state: data.location?.state || '',
          city: data.location?.city || '',
          neighborhood: data.location?.neighborhood || '',
          bio: data.bio || '',
          skills: data.skills || [],
        });
        setAvatarUrl(data.avatar_url);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate, form]);

  const handleAddTag = () => {
    const currentSkills = form.getValues('skills') || [];
    if (tagInput.trim() && !currentSkills.find(t => t.toLowerCase() === tagInput.trim().toLowerCase())) {
      form.setValue('skills', [...currentSkills, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentSkills = form.getValues('skills') || [];
    form.setValue('skills', currentSkills.filter(tag => tag !== tagToRemove));
  };

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        location: {
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
        },
        bio: data.bio,
        skills: data.skills,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setIsSubmitting(false);

    if (error) {
      showError("Ocorreu um erro ao atualizar o perfil.");
    } else {
      showSuccess("Perfil atualizado com sucesso!");
      navigate('/profile');
    }
  };

  if (loading) {
    return (
      <Layout title="Editar Perfil">
        <div className="space-y-6">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-10 w-32 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Editar Perfil">
      <AvatarUpload initialUrl={avatarUrl} onUpload={handleAvatarUpload} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dbStates.map(s => <SelectItem key={s.sigla} value={s.sigla}>{s.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dbCities.map(c => <SelectItem key={c.nome} value={c.nome}>{c.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Seu bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Fale um pouco sobre você..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="skills"
            render={() => (
              <FormItem>
                <FormLabel>Habilidades e Interesses</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicione uma tag (ex: Guitarra, Rock)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('skills')?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-background/50">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/profile')} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </Layout>
  );
};

export default EditProfile;