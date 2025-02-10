"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const updateEmail = async (
  id: number,
  organizationId: number,
  redirectTo?: string,
  email?: string,
) => {
  const session = await auth();
  const sessionUser = session?.user;
  if (
    email &&
    (sessionUser?.isGovernment ||
      sessionUser?.organizationId === organizationId)
  ) {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        contactEmail: email,
      },
    });
    if (redirectTo) {
      redirect(redirectTo);
    }
  }
};
