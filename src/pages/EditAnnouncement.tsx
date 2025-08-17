import { Layout } from "@/components/Layout";
import AnnounceStep2 from "@/components/announce/AnnounceStep2";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/utils/toast";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const EditAnnouncement = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [announcement, setAnnouncement] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            if (!id || !user) {
                navigate('/');
                return;
            }

            setLoading(true);
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                showError("Anúncio não encontrado.");
                navigate('/profile');
                return;
            }

            if (data.user_id !== user.id) {
                showError("Você não tem permissão para editar este anúncio.");
                navigate('/profile');
                return;
            }

            setAnnouncement(data);
            setLoading(false);
        };

        if (user) {
            fetchAnnouncement();
        }
    }, [id, user, navigate]);

    const handleUpdate = async (formData: any) => {
        if (!user || !id) return;

        setIsSubmitting(true);
        const updatedData = {
            title: formData.title,
            description: formData.description,
            location: {
                state: formData.state,
                city: formData.city,
                neighborhood: formData.neighborhood || null,
            },
            tags: formData.tags,
            band_name: announcement.type === 'band' ? formData.bandName : null,
            experience: announcement.type === 'musician' ? formData.experience : null,
        };

        const { error } = await supabase
            .from('announcements')
            .update(updatedData)
            .eq('id', id);

        setIsSubmitting(false);

        if (error) {
            showError("Erro ao atualizar o anúncio.");
            console.error(error);
        } else {
            showSuccess("Anúncio atualizado com sucesso!");
            navigate('/profile');
        }
    };

    if (loading || !announcement) {
        return (
            <Layout title="Editar Anúncio">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Editar Anúncio">
            <AnnounceStep2
                type={announcement.type}
                onBack={() => navigate('/profile')}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
                initialData={announcement}
                submitButtonText="Salvar Alterações"
                cancelButtonText="Cancelar"
            />
        </Layout>
    );
};

export default EditAnnouncement;