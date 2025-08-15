import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Music } from "lucide-react";

export type Announcement = {
  id: number;
  user: {
    name: string;
    avatarUrl: string;
  };
  title: string;
  location: string;
  description: string;
  tags: string[];
};

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={announcement.user.avatarUrl} alt={announcement.user.name} />
          <AvatarFallback>{announcement.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base font-bold">{announcement.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{announcement.user.name}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{announcement.location}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-sm text-foreground/80">{announcement.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 p-4">
        <div className="flex flex-wrap gap-2">
          {announcement.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full">Entrar em contato</Button>
      </CardFooter>
    </Card>
  );
};