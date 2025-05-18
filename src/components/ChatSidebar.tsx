
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, MessageCircle } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const ChatSidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat, isLoadingChats } = useChat();
  
  return (
    <div className="h-full flex flex-col border-r border-leaf-100 bg-white/95 w-64">
      <div className="p-4">
        <Button 
          onClick={createNewChat}
          className="w-full bg-leaf-600 hover:bg-leaf-700 text-white"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      <Separator />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 space-y-1">
            {isLoadingChats ? (
              <div className="flex justify-center p-4 text-sm text-muted-foreground">
                Loading chats...
              </div>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    "flex items-center hover:bg-leaf-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-leaf-500",
                    currentChat?.id === chat.id ? "bg-leaf-100" : ""
                  )}
                  onClick={() => selectChat(chat.id)}
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-leaf-600 flex-shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))
            ) : (
              <div className="flex justify-center p-4 text-sm text-muted-foreground">
                No chat history
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatSidebar;
