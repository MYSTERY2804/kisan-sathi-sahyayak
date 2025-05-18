
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Send, Sprout, Tractor, Leaf, HelpCircle } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import SourcesPanel from '@/components/SourcesPanel';
import ThinkingAnimation from '@/components/ThinkingAnimation';
import Logo from '@/components/Logo';

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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row max-w-6xl w-full mx-auto p-4 gap-4">
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
        
        <div className="md:w-[340px] space-y-4">
          {/* Sources panel */}
          <SourcesPanel sources={sources} />
          
          {/* Suggested questions */}
          <Card className="border-leaf-100 bg-white/80 backdrop-blur-sm">
            <div className="p-4 pb-2">
              <h3 className="font-medium text-leaf-800 flex items-center gap-1.5">
                <Leaf size={16} className="text-leaf-600" />
                Suggested Questions
              </h3>
            </div>
            <div className="p-2">
              {suggestedQuestions.map((question, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start text-left text-sm py-2 px-3 h-auto mb-1 hover:bg-leaf-50 font-normal"
                  onClick={() => {
                    setInput(question);
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          </Card>
          
          {/* Agricultural tips */}
          <Card className="border-leaf-100 bg-white/80 backdrop-blur-sm p-4">
            <div className="flex gap-2 items-start">
              <div className="bg-leaf-50 p-1.5 rounded-full">
                <Tractor size={20} className="text-leaf-600" />
              </div>
              <div>
                <h3 className="font-medium text-leaf-800">Farming Tip</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Did you know? Intercropping legumes with cereals can improve soil nitrogen levels and reduce the need for chemical fertilizers.
                </p>
              </div>
            </div>
          </Card>
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
