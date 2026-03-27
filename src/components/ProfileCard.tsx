import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MessageCircle, UserPlus, Star, MapPin } from "lucide-react";

interface ProfileCardProps {
  name: string;
  avatar?: string;
  university: string;
  major: string;
  year: string;
  rating: number;
  studyGroups: number;
  location: string;
  tags: string[];
  isOnline?: boolean;
}

export function ProfileCard({ 
  name, 
  avatar, 
  university, 
  major, 
  year, 
  rating, 
  studyGroups, 
  location, 
  tags,
  isOnline = false 
}: ProfileCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-green-400 to-teal-500 text-white border-0 relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-white">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-white/80">{year} • {major}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="text-sm text-white/80">{location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-white/90">{university}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              <span>{rating}</span>
            </div>
            <div>
              <span>{studyGroups} study groups</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} className="bg-white/20 text-white border-0 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="bg-white text-green-500 hover:bg-white/90 flex-1">
            <MessageCircle className="h-4 w-4 mr-1" />
            Message
          </Button>
          <Button size="sm" variant="outline" className="border-white text-white hover:bg-white/10">
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
    </Card>
  );
}