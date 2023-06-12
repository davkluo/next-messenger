"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";

import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";

import Avatar from "@/app/components/Avatar";
import ConversationDrawer from "./ConversationDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationHeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
}) => {
  const otherUser = useOtherUser(conversation);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active";
  }, [conversation]);

  return (
    <>
      <ConversationDrawer
        conversation={conversation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <div
        className="
        bg-white
        w-full
        flex
        border-b-[1px]
        sm:px-4
        py-3
        px-4
        lg:px-6
        justify-between
        items-center
        shadow-sm
      "
      >
        <div className="flex gap-3 item-center">
          <Link
            className="
              lg:hidden
              block
              text-sky-500
              hover:text-sky-600
              transition
              cursor-pointer
            "
            href="/conversations"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>
              {conversation.name ||
                `${otherUser.firstName} ${otherUser.lastName}`}
            </div>
            <div
              className="
                text-sm
                font-light
                text-neutral-500
              "
            >
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setIsDrawerOpen(true)}
          className="
            text-sky-500
            cursor-pointer
            hover:text-sky-600
            transition
          "
        />
      </div>
    </>
  );
};

export default ConversationHeader;
