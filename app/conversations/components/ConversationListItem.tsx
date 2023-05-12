"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { FullConversation } from "@/app/types";
import { User, Conversation, Message } from "@prisma/client";

interface ConversationListItemProps {
  conversation: FullConversation;
  selected: boolean;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  selected,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {}, []);

  return <div>ConversationListItem</div>;
};

export default ConversationListItem;
