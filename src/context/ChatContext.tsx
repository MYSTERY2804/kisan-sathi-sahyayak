
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat, Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextProps {
  chats: Chat[];
  currentChat: Chat | null;
  isLoadingChats: boolean;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  addMessageToChat: (message: Message) => Promise<void>;
  setCurrentChatMessages: (messages: Message[]) => void;
}

const ChatContext = createContext<ChatContextProps>({
  chats: [],
  currentChat: null,
  isLoadingChats: true,
  createNewChat: () => {},
  selectChat: () => {},
  addMessageToChat: async () => {},
  setCurrentChatMessages: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const { user } = useAuth();

  // Load user's chats
  useEffect(() => {
    const loadChats = async () => {
      if (!user) {
        setChats([]);
        setCurrentChat(null);
        setIsLoadingChats(false);
        return;
      }

      try {
        setIsLoadingChats(true);
        
        // Get all chat histories for this user
        const { data: chatHistories, error: chatError } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (chatError) throw chatError;
        
        // Group chat histories by conversation_id and create chat objects
        const chatMap: Record<string, Chat> = {};
        
        if (chatHistories && chatHistories.length > 0) {
          chatHistories.forEach(item => {
            const conversationId = item.conversation_id || item.id;
            
            if (!chatMap[conversationId]) {
              chatMap[conversationId] = {
                id: conversationId,
                title: `Chat ${Object.keys(chatMap).length + 1}`,
                messages: [],
                created_at: item.created_at
              };
            }
            
            // Add user question
            chatMap[conversationId].messages.push({
              content: item.question,
              isUser: true,
              timestamp: new Date(item.created_at).toLocaleTimeString()
            });
            
            // Add AI response
            chatMap[conversationId].messages.push({
              content: item.answer,
              isUser: false,
              timestamp: new Date(item.created_at).toLocaleTimeString()
            });
          });
          
          const chatList = Object.values(chatMap);
          
          // Sort messages in each chat by timestamp
          chatList.forEach(chat => {
            chat.messages.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            
            // Set the title to the first few words of the first question
            const firstQuestion = chat.messages.find(m => m.isUser)?.content;
            if (firstQuestion) {
              chat.title = firstQuestion.substring(0, 30) + (firstQuestion.length > 30 ? '...' : '');
            }
          });
          
          setChats(chatList);
          
          // Set current chat to the most recent one if not already set
          if (!currentChat && chatList.length > 0) {
            setCurrentChat(chatList[0]);
          }
        } else {
          // Create an initial chat if there are no existing chats
          createInitialChat();
        }
      } catch (error) {
        console.error('Error loading chats:', error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
        createInitialChat();
      } finally {
        setIsLoadingChats(false);
      }
    };
    
    loadChats();
  }, [user]);

  const createInitialChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [{
        content: "Namaste! 🙏 I'm Krish Mitra, your agricultural assistant. I can help with farming techniques, crop diseases, government schemes, weather adaptation, and more. How may I assist you today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }],
      created_at: new Date().toISOString()
    };
    
    setChats([newChat]);
    setCurrentChat(newChat);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [{
        content: "Namaste! 🙏 I'm Krish Mitra, your agricultural assistant. I can help with farming techniques, crop diseases, government schemes, weather adaptation, and more. How may I assist you today?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      }],
      created_at: new Date().toISOString()
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
  };

  const selectChat = (chatId: string) => {
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
    }
  };

  const addMessageToChat = async (message: Message) => {
    if (!currentChat || !user) return;
    
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, message]
    };
    
    setCurrentChat(updatedChat);
    
    // Update chats list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );
    
    // If this is an AI response, save the Q&A pair to the database
    if (!message.isUser) {
      try {
        // Find the most recent user message
        const userMessages = currentChat.messages.filter(m => m.isUser);
        if (userMessages.length > 0) {
          const userQuestion = userMessages[userMessages.length - 1].content;
          
          await supabase.from('chat_history').insert({
            conversation_id: currentChat.id,
            user_id: user.id,
            question: userQuestion,
            answer: message.content,
            created_at: new Date().toISOString(),
            sources: null
          });
        }
      } catch (error) {
        console.error('Error saving message to database:', error);
        toast({
          title: "Error",
          description: "Failed to save message to chat history",
          variant: "destructive",
        });
      }
    }
  };

  const setCurrentChatMessages = (messages: Message[]) => {
    if (!currentChat) return;
    
    const updatedChat = {
      ...currentChat,
      messages
    };
    
    setCurrentChat(updatedChat);
    
    // Update chats list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoadingChats,
        createNewChat,
        selectChat,
        addMessageToChat,
        setCurrentChatMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
