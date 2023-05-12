import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // TODO: Create work factor environment variable
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log("REGISTRATION_ERROR", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
