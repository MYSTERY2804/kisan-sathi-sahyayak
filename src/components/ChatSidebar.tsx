
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, MessageCircle, Trash2 } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ChatSidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat, deleteChat, isLoadingChats } = useChat();
  
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
                <div
                  key={chat.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors relative group",
                    "flex items-center hover:bg-leaf-50",
                    currentChat?.id === chat.id ? "bg-leaf-100" : ""
                  )}
                >
                  <button
                    className="flex-grow flex items-center outline-none focus-visible:ring-1 focus-visible:ring-leaf-500"
                    onClick={() => selectChat(chat.id)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4 text-leaf-600 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this chat? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteChat(chat.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
