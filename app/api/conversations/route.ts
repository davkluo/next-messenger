import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    // Unauthorized if no current user found
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Bad request if conversation name and members are missing for group chat
    if (isGroup && (!name || !members)) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Create valid group conversation
    if (isGroup) {
      const newGroupConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { id: string }) => ({
                id: member.id,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      return NextResponse.json(newGroupConversation);
    }

    // Check for existing 1 to 1 conversation and create if not found
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create new 1 to 1 conversation
    const newConversation = await prisma.conversation.create({
      data: {
        name,
        isGroup,
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
