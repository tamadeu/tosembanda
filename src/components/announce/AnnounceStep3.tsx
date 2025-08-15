import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface AnnounceStep3Props {
  onReset: () => void;
}

const AnnounceStep3 = ({ onReset }: AnnounceStep3Props) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <CheckCircle className="w-20 h-20 text-green-500" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Anúncio Publicado!</h2>
        <p className="text-muted-foreground">Seu anúncio já está visível para outros músicos.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button asChild variant="outline" className="w-full">
          <Link to="/">Ver Anúncios</Link>
        </Button>
        <Button onClick={onReset} className="w-full">
          Criar Outro Anúncio
        </Button>
      </div>
    </div>
  );
};

export default AnnounceStep3;