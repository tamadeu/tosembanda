import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Announcement } from "@/lib/mock-data";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  return (
    <Link to={`/announcement/${announcement.id}`} className="block rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl hover:bg-card/60">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarImage src={announcement.user.avatarUrl} alt={announcement.user.name} />
            <AvatarFallback>{announcement.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-base font-bold text-left">{announcement.title}</CardTitle>
            <p className="text-sm text-muted-foreground text-left">{announcement.user.name}</p>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{`${announcement.location.city}, ${announcement.location.state}`}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 text-left">
          <p className="text-sm text-foreground/80 line-clamp-2">{announcement.description}</p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
          {announcement.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {announcement.tags.length > 3 && (
            <Badge variant="outline">+{announcement.tags.length - 3}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};