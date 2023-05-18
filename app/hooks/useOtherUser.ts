import { useSession } from "next-auth/react";
import { useMemo } from "react";

import { FullConversation } from "../types";
import { User } from "@prisma/client";

// TODO: argument may need this type union | { users: User[] }
const useOtherUser = (conversation: FullConversation | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUsers = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUsers[0];
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser as User;
};

export default useOtherUser;
