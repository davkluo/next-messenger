"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";

import { FullConversation } from "@/app/types";
import { User, Conversation, Message } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";

interface ConversationListItemProps {
  conversation: FullConversation;
  selected?: boolean;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  selected,
}) => {
  const otherUser = useOtherUser(conversation);
  const session = useSession();
  const router = useRouter();
  // TODO: Might want a loading state here?
  // const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [router, conversation.id]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const lastMessage = useMemo(() => {
    return conversation.messages[conversation.messages.length - 1];
  }, [conversation.messages]);

  const lastMessageText = useMemo(() => {
    // TODO: Specify who sent the image
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    // TODO: Specify who else is in the conversation
    return "Started a conversation.";
  }, [lastMessage]);

  const hasSeen = useMemo(() => {
    if (!userEmail) return false;
    if (!lastMessage) return false;

    const seen = lastMessage.seen;
    return seen.find((user) => user.email === userEmail) !== undefined;
  }, [lastMessage, userEmail]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full,
        relative
        flex
        items-center
        space-x-3
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      <Avatar user={otherUser} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
            flex
            justify-between
            items-center
            mb-1
          "
          >
            <p
              className="
                text-md
                font-medium
                text-gray-900
              "
            >
              {conversation.name ||
                `${otherUser.firstName} ${otherUser.lastName}`}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;
