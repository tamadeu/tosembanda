import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, FileText, User } from "lucide-react";

interface ChatContextProps {
  type: 'announcement' | 'profile';
  data: {
    title?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
  onClose: () => void;
}

export const ChatContext = ({ type, data, onClose }: ChatContextProps) => {
  const isAnnouncement = type === 'announcement';
  const title = isAnnouncement ? "Respondendo ao anúncio:" : "Iniciando conversa com:";
  const content = isAnnouncement ? data.title : [data.first_name, data.last_name].filter(Boolean).join(' ');

  return (
    <Card className="bg-muted/50 shadow-none border-dashed">
      <CardContent className="p-3 flex items-center gap-3">
        {isAnnouncement ? <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
        <div className="flex-1 overflow-hidden">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-sm font-medium truncate">{content}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};