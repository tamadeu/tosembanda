import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";

interface AnnounceStep1Props {
  onSelectType: (type: 'musician' | 'band') => void;
}

const AnnounceStep1 = ({ onSelectType }: AnnounceStep1Props) => {
  return (
    <div className="space-y-4 text-center">
      <div>
        <h2 className="text-2xl font-bold">O que você deseja anunciar?</h2>
        <p className="text-muted-foreground">Escolha uma opção para começar.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-4">
        <Card
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelectType('musician')}
        >
          <CardHeader className="flex flex-col items-center justify-center text-center">
            <User className="w-12 h-12 mb-4 text-primary" />
            <CardTitle>Músico Procurando</CardTitle>
            <CardDescription>Você é um músico em busca de uma banda, projeto ou freelancer.</CardDescription>
          </CardHeader>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelectType('band')}
        >
          <CardHeader className="flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 mb-4 text-primary" />
            <CardTitle>Banda Procurando</CardTitle>
            <CardDescription>Sua banda ou projeto está procurando por um novo integrante.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default AnnounceStep1;