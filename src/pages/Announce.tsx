import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import AnnounceStep1 from "@/components/announce/AnnounceStep1";
import AnnounceStep2 from "@/components/announce/AnnounceStep2";
import AnnounceStep3 from "@/components/announce/AnnounceStep3";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

const Announce = () => {
  const [step, setStep] = useState(1);
  const [announcementType, setAnnouncementType] = useState<'musician' | 'band'>('musician');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectType = (type: 'musician' | 'band') => {
    setAnnouncementType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (formData: any) => {
    if (!user) {
      showError("Você precisa estar logado para criar um anúncio.");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    const announcementData = {
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      type: announcementType,
      location: {
        state: formData.state,
        city: formData.city,
        neighborhood: formData.neighborhood || null,
      },
      instruments: formData.instruments,
      genres: formData.genres,
      objectives: formData.objectives,
      tags: formData.tags,
      band_name: announcementType === 'band' ? formData.bandName : null,
      experience: announcementType === 'musician' ? formData.experience : null,
    };

    const { error } = await supabase.from('announcements').insert([announcementData]);

    setIsSubmitting(false);

    if (error) {
      showError("Ocorreu um erro ao publicar seu anúncio. Tente novamente.");
      console.error("Supabase error:", error);
    } else {
      showSuccess("Anúncio publicado com sucesso!");
      setStep(3);
    }
  };

  const handleReset = () => {
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AnnounceStep1 onSelectType={handleSelectType} />;
      case 2:
        return <AnnounceStep2 type={announcementType} onBack={handleBack} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case 3:
        return <AnnounceStep3 onReset={handleReset} />;
      default:
        return <AnnounceStep1 onSelectType={handleSelectType} />;
    }
  };

  return (
    <Layout title="Criar Anúncio">
      {renderStep()}
    </Layout>
  );
};

export default Announce;