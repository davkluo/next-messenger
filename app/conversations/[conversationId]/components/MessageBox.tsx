"use client";

import { useSession } from "next-auth/react";
import clsx from "clsx";
import { format } from "date-fns";

import { FullMessage } from "@/app/types";
import Avatar from "@/app/components/Avatar";
import Image from "next/image";

interface MessageBoxProps {
  data: FullMessage;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();

  const isOwnMessage = session?.data?.user?.email === data.sender.email;
  const seenUsersNames = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => `${user.firstName} ${user.lastName}`)
    .join(", ");

  const containerClasses = clsx(
    "flex gap-3 p-4",
    isOwnMessage && "justify-end"
  );

  const avatarClasses = clsx(isOwnMessage && "order-2");

  const bodyClasses = clsx("flex flex-col gap-2", isOwnMessage && "items-end");

  const messageClasses = clsx(
    "text-sm w-fit overflow-hidden",
    isOwnMessage ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={containerClasses}>
      <div className={avatarClasses}>
        <Avatar user={data.sender} />
      </div>
      <div className={bodyClasses}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender.firstName} {data.sender.lastName}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={messageClasses}>
          {data.image ? (
            <Image
              alt={`Image sent by ${data.sender.firstName} ${data.sender.lastName}`}
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover
                cursor-pointer
                hover:scale-105
                transition
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwnMessage && seenUsersNames.length > 0 && (
          <div
            className="
                text-xs
                font-light
                text-gray-500
              "
          >
            {`Seen by ${seenUsersNames}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
