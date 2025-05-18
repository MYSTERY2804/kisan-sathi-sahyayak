import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Send, LogOut, HelpCircle } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import ThinkingAnimation from '@/components/ThinkingAnimation';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
}

interface Source {
  url: string;
  title: string;
  content: string;
}

const Index = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Namaste! 🙏 I'm Krish Mitra, your agricultural assistant. I can help with farming techniques, crop diseases, government schemes, weather adaptation, and more. How may I assist you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [sources, setSources] = useState<Source[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const history: Message[] = [];
          
          // Keep the welcome message
          history.push(messages[0]);
          
          data.forEach(chat => {
            // Add user question
            history.push({
              content: chat.question,
              isUser: true,
              timestamp: new Date(chat.created_at).toLocaleTimeString()
            });
            
            // Add AI response
            history.push({
              content: chat.answer,
              isUser: false,
              timestamp: new Date(chat.created_at).toLocaleTimeString()
            });
          });
          
          setMessages(history);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      }
    };
    
    fetchChatHistory();
  }, [user]);

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage = {
      content: input,
      isUser: true,
      timestamp: formatTimestamp()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
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
      
      setMessages(prev => [...prev, botMessage]);
      setSources(data.sources || []);
      
      // Save to Supabase
      if (user) {
        const { error } = await supabase.from('chat_history').insert({
          user_id: user.id,
          question: input,
          answer: data.answer,
          sources: data.sources
        });
        
        if (error) {
          console.error('Error saving chat:', error);
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please check if the API server is running.",
        variant: "destructive",
      });
      
      setMessages(prev => [...prev, {
        content: "I'm having trouble connecting to my knowledge base. Please check if the server is running and try again.",
        isUser: false,
        timestamp: formatTimestamp()
      }]);
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

  const suggestedQuestions = [
    "What government schemes are available for organic farming?",
    "How to identify and treat rice blast disease?",
    "What are the best practices for water conservation in farming?",
    "Which crops are suitable for drought-prone areas?"
  ];

  return (
    <div className="min-h-screen bg-gradient-farm flex flex-col">
      {/* Header */}
      <header className="border-b border-leaf-100 bg-white/80 backdrop-blur-sm py-4 px-6">
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
            
            <a 
              href="#"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-leaf-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                toast({
                  title: "About Krish Mitra",
                  description: "Agricultural assistant powered by LLaMA 3 and SearxNG, designed to help farmers with expert knowledge.",
                });
              }}
            >
              <HelpCircle size={16} />
              <span>About</span>
            </a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 gap-4">
        <div className="flex-1 flex flex-col max-h-[calc(100vh-8rem)]">
          {/* Chat container */}
          <Card className="flex-1 flex flex-col p-4 overflow-hidden border-leaf-100 bg-white/80 backdrop-blur-sm mb-4">
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {messages.map((message, i) => (
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
          <SourcesPanel sources={sources} />
        )}
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
