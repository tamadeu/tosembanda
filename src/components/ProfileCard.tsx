import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { ProfileSearchResult } from "@/lib/types";

interface ProfileCardProps {
  profile: ProfileSearchResult;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || "Usuário";
  const userInitial = fullName.charAt(0).toUpperCase();
  const skills = profile.skills || [];
  const locationString = [profile.location?.city, profile.location?.state].filter(Boolean).join(', ');

  return (
    <Link to={`/user/${profile.id}`} className="block rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl hover:bg-card/60">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.avatar_url || undefined} alt={fullName} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-base font-bold text-left">{fullName}</p>
            {locationString && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{locationString}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 text-left">
          <p className="text-sm text-foreground/80 line-clamp-2">{profile.bio || "Nenhuma bio informada."}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="outline">+{skills.length - 4}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};