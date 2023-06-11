"use client";

import { Conversation, User } from "@prisma/client";

interface ConversationDrawerProps {
  data: Conversation & { users: User[] };
  isOpen: boolean;
  onClose: () => void;
}

const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  return <div>ConversationDrawer</div>;
};

export default ConversationDrawer;
