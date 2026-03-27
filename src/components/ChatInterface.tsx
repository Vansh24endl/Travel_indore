import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Video, Phone, MoreHorizontal, Send, Smile } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  avatar?: string;
}

interface ChatInterfaceProps {
  title: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline';
  }>;
  messages: ChatMessage[];
}

export function ChatInterface({ title, participants, messages }: ChatInterfaceProps) {
  return (
    <Card className="bg-slate-900 text-white border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-1">
                {participants.slice(0, 3).map((participant) => (
                  <Avatar key={participant.id} className="h-6 w-6 border border-slate-600">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="bg-slate-600 text-xs">
                      {participant.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-slate-400">
                {participants.length} participants
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-400/10">
              <Video className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-400/10">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-slate-400 hover:bg-slate-700">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.avatar} />
              <AvatarFallback className="bg-slate-600 text-xs">
                {message.sender.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{message.sender}</span>
                <span className="text-xs text-slate-400">{message.time}</span>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-sm">
                {message.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-700 rounded-lg p-2 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <Button size="sm" variant="ghost" className="text-yellow-400 hover:bg-yellow-400/10">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}