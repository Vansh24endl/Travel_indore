import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Play, Users, MessageSquare, Calendar, Star, Zap } from "lucide-react";

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Smart Study Chats */}
      <Card className="p-6 bg-slate-900 text-white border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Smart AI study chats</h3>
            <Badge className="bg-blue-500/20 text-blue-400 border-0">
              <Zap className="h-3 w-3 mr-1" />
              AI
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-blue-500 text-xs">AI</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Study Assistant</span>
              </div>
              <p className="text-sm text-slate-300">
                "Based on your learning style, I recommend focusing on visual diagrams for this topic."
              </p>
            </div>
            
            <div className="bg-blue-500/20 rounded-lg p-3">
              <p className="text-sm">
                "Can you explain photosynthesis in simple terms?"
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MessageSquare className="h-3 w-3" />
            <span>Smart responses • Learning optimization</span>
          </div>
        </div>
      </Card>

      {/* Contract Gamification */}
      <Card className="p-6 bg-slate-900 text-white border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Contract gamification</h3>
            <Badge className="bg-green-500/20 text-green-400 border-0">
              Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Study Streak</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">7 days</span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-yellow-400">🏆</div>
                <div className="text-xs text-slate-400">Top Student</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-blue-400">⚡</div>
                <div className="text-xs text-slate-400">Quick Learner</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap className="h-3 w-3" />
            <span>Motivation • Progress tracking</span>
          </div>
        </div>
      </Card>

      {/* Learning Modes */}
      <Card className="p-6 bg-slate-900 text-white border-slate-700">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Learning Modes</h3>
            <Badge className="bg-purple-500/20 text-purple-400 border-0">
              <Play className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Users className="h-3 w-3 mr-1" />
                Group
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Play className="h-3 w-3 mr-1" />
                Video
              </Button>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Session</span>
              </div>
              <p className="text-xs text-slate-400">Mathematics Study Group • 12 participants</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>Scheduled • Interactive</span>
          </div>
        </div>
      </Card>
    </div>
  );
}