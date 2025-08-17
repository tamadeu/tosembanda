import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface MessageContextCardProps {
  announcement: {
    id: string;
    title: string;
  };
}

export const MessageContextCard = ({ announcement }: MessageContextCardProps) => {
  return (
    <div className="w-full flex justify-center my-2">
      <Link to={`/announcement/${announcement.id}`} className="w-full max-w-xs">
        <Card className="bg-muted/50 shadow-none border-dashed hover:border-primary/50 transition-colors">
          <CardContent className="p-3 flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-muted-foreground">Respondendo ao anúncio:</p>
              <p className="text-sm font-medium truncate">{announcement.title}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};