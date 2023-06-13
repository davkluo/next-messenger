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
    bottomRef?.current?.scrollIntoView();

    const newMessageHandler = (messageToAdd: FullMessage) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((prevMessages) => {
        if (find(prevMessages, { id: messageToAdd.id })) {
          return prevMessages;
        }

        return [...prevMessages, messageToAdd];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (messageToUpdate: FullMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((prevMessage) =>
          prevMessage.id === messageToUpdate.id ? messageToUpdate : prevMessage
        )
      );
    };

    // Listen for and handle events
    pusherClient.bind("messages:new", newMessageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", newMessageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
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
