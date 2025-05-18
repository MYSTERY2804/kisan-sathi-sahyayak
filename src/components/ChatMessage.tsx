
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <div className={cn("flex flex-col mb-4", isUser ? "items-end" : "items-start")}>
      <div className={isUser ? "chat-message-user" : "chat-message-ai"}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      {timestamp && (
        <span className="text-xs text-muted-foreground mt-1 px-2">
          {timestamp}
        </span>
      )}
    </div>
  );
};

export default ChatMessage;
