import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Users, BookOpen, MessageCircle } from "lucide-react";

export function StudentCommunityHero() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-white text-5xl font-bold">
          Student Community
        </h1>
        <p className="text-white/80 text-xl max-w-md mx-auto">
          Welcome to a Community JAM Packed
        </p>
      </div>

      <div className="flex items-center gap-4 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Quick search..." 
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
        <Button className="bg-white text-primary hover:bg-white/90">
          Login
        </Button>
      </div>

      <div className="flex items-center justify-center gap-8 text-white/60">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Connect</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <span>Study</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span>Chat</span>
        </div>
      </div>
    </div>
  );
}