import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, Users, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StudyGroupCardProps {
  title: string;
  subject: string;
  rating: number;
  members: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  nextSession?: string;
  isOnline?: boolean;
}

export function StudyGroupCard({ 
  title, 
  subject, 
  rating, 
  members, 
  nextSession,
  isOnline = false 
}: StudyGroupCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-orange-400 to-yellow-400 text-white border-0 relative overflow-hidden">
      <div className="absolute top-4 right-4">
        {isOnline && (
          <Badge className="bg-green-500 text-white border-0">
            Live
          </Badge>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < rating ? 'fill-white' : 'fill-white/30'}`} 
                />
              ))}
            </div>
            <span className="text-sm opacity-90">{rating}/5</span>
          </div>
        </div>

        <div className="space-y-3">
          <Badge className="bg-white/20 text-white border-0">
            {subject}
          </Badge>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">{members.length} members</span>
          </div>

          {nextSession && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{nextSession}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center">
                <span className="text-xs">+{members.length - 4}</span>
              </div>
            )}
          </div>
          
          <Button size="sm" className="bg-white text-orange-500 hover:bg-white/90">
            Join
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/10 rounded-full"></div>
    </Card>
  );
}