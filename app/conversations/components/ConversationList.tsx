"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useSession } from "next-auth/react";
import { find } from "lodash";

import { FullConversation } from "@/app/types";
import useConversation from "@/app/hooks/useConversation";
import { User } from "@prisma/client";
import { pusherClient } from "@/app/libs/pusher";

import ConversationListItem from "./ConversationListItem";
import GroupChatModal from "./GroupChatModal";

interface ConversationListProps {
  users: User[];
  initialConversations: FullConversation[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  users,
  initialConversations,
}) => {
  const session = useSession();
  const router = useRouter();

  const [conversations, setConversations] = useState(initialConversations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isOpen, conversationId } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newConversationHandler = (conversationToAdd: FullConversation) => {
      setConversations((prevConversations) => {
        if (find(prevConversations, { id: conversationToAdd.id })) {
          return prevConversations;
        }
        return [conversationToAdd, ...prevConversations];
      });
    };

    const updateConversationHandler = (
      conversationToUpdate: FullConversation
    ) => {
      setConversations((prevConversations) =>
        prevConversations.map((prevConversation) =>
          prevConversation.id === conversationToUpdate.id
            ? { ...prevConversation, messages: conversationToUpdate.messages }
            : prevConversation
        )
      );
    };

    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("conversation:update", updateConversationHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newConversationHandler);
      pusherClient.unbind("conversation:update", updateConversationHandler);
    };
  }, [pusherKey]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
          fixed
          fixed-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-gray-200
          `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              className="
                rounded-full
                p-2
                bg-gray-100
                text-gray-600
                cursor-pointer
                hover:opacity-75
                transition
              "
              onClick={() => setIsModalOpen(true)}
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              selected={conversationId === conversation.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
