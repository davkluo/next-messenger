"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { find } from "lodash";

import { FullMessage } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import { pusherClient } from "@/app/libs/pusher";

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

  useEffect(() => {
    // Now listening to this channel
    pusherClient.subscribe(conversationId);

    // Scroll down to newest message
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessage) => {
      // Mark new message as seen
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prevMessages) => {
        // Check that we don't already have the message
        if (find(prevMessages, { id: message.id })) {
          return prevMessages;
        }

        return [...prevMessages, message];
      });

      // Scroll down to new message
      bottomRef?.current?.scrollIntoView();
    };

    // Handle event
    pusherClient.bind("messages:new", messageHandler);

    // Unsubscribe and unbind on dismount
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
    };
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
