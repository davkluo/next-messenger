"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { FullMessage } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";

import MessageBox from "./MessageBox";

interface ConversationBodyProps {
  initialMessages: FullMessage[];
}

const ConversationBody: React.FC<ConversationBodyProps> = ({
  initialMessages,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  // Used to jump to bottom of conversation when a new message is sent
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default ConversationBody;
