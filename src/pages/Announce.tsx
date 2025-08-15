import { useState } from "react";
import { Layout } from "@/components/Layout";
import AnnounceStep1 from "@/components/announce/AnnounceStep1";
import AnnounceStep2 from "@/components/announce/AnnounceStep2";
import AnnounceStep3 from "@/components/announce/AnnounceStep3";

const Announce = () => {
  const [step, setStep] = useState(1);
  const [announcementType, setAnnouncementType] = useState<'musician' | 'band'>('musician');

  const handleSelectType = (type: 'musician' | 'band') => {
    setAnnouncementType(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    // Aqui iria a lógica para salvar os dados do formulário
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AnnounceStep1 onSelectType={handleSelectType} />;
      case 2:
        return <AnnounceStep2 type={announcementType} onBack={handleBack} onSubmit={handleSubmit} />;
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