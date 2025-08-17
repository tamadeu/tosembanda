import { Card, CardContent } from "@/components/ui/card";
import { FileText, User } from "lucide-react";
import { Link } from "react-router-dom";

interface MessageContextCardProps {
  announcement?: {
    id: string;
    title: string;
  } | null;
  profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

export const MessageContextCard = ({ announcement, profile }: MessageContextCardProps) => {
  if (!announcement && !profile) {
    return null;
  }

  const isAnnouncement = !!announcement;
  const link = isAnnouncement ? `/announcement/${announcement.id}` : `/user/${profile!.id}`;
  const title = isAnnouncement ? "Respondendo ao anúncio:" : "Iniciando conversa com:";
  const content = isAnnouncement ? announcement.title : [profile!.first_name, profile!.last_name].filter(Boolean).join(' ');

  return (
    <div className="w-full flex justify-center my-2">
      <Link to={link} className="w-full max-w-xs">
        <Card className="bg-muted/50 shadow-none border-dashed hover:border-primary/50 transition-colors">
          <CardContent className="p-3 flex items-center gap-3">
            {isAnnouncement ? <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-muted-foreground">{title}</p>
              <p className="text-sm font-medium truncate">{content}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};