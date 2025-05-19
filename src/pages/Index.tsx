import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Send, LogOut } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import ThinkingAnimation from '@/components/ThinkingAnimation';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import ChatSidebar from '@/components/ChatSidebar';

interface Source {
  url: string;
  title: string;
  content: string;
}

const Index = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { currentChat, addMessageToChat } = useChat();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading || !currentChat) return;
    
    const userMessage = {
      content: input,
      isUser: true,
      timestamp: formatTimestamp()
    };
    
    await addMessageToChat(userMessage);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare conversation history (excluding system messages)
      const conversationHistory = currentChat.messages
        .filter(msg => !msg.content.includes("Namaste! 🙏 I'm Krish Mitra")) // Filter out intro message
        .map(msg => [msg.content, msg.isUser]);

      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: input,
          conversation_id: currentChat.id,
          conversation_history: conversationHistory
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const botMessage = {
        content: data.answer || "I couldn't find an answer to that. Please try rephrasing your question.",
        isUser: false,
        timestamp: formatTimestamp()
      };
      
      await addMessageToChat(botMessage);
      setSources(data.sources || []);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please check if the API server is running.",
        variant: "destructive",
      });
      
      await addMessageToChat({
        content: "I'm having trouble connecting to my knowledge base. Please check if the server is running and try again.",
        isUser: false,
        timestamp: formatTimestamp()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-farm flex flex-col">
      {/* Header */}
      <header className="border-b border-leaf-100 bg-white/80 backdrop-blur-sm py-4 px-6 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user?.email}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {/* Chat sidebar */}
        <ChatSidebar />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full gap-4">
            {/* Chat container */}
            <Card className="flex-1 flex flex-col p-4 overflow-hidden border-leaf-100 bg-white/80 backdrop-blur-sm mb-4">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {currentChat?.messages.map((message, i) => (
                  <ChatMessage 
                    key={i} 
                    content={message.content} 
                    isUser={message.isUser} 
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && (
                  <ThinkingAnimation className="self-start" />
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card>
            
            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Ask about crops, farming techniques, schemes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="agri-input"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="agri-button"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
          
          {/* Sources panel - Now below the chat instead of on right */}
          {sources.length > 0 && (
            <div className="max-w-4xl mx-auto w-full mt-4">
              <SourcesPanel sources={sources} />
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center py-4 text-sm text-muted-foreground border-t border-leaf-100 bg-white/50">
        <div className="max-w-6xl mx-auto px-4">
          Krish Mitra • Agricultural Knowledge Assistant • Powered by LLaMA 3
        </div>
      </footer>
    </div>
  );
};

export default Index;
