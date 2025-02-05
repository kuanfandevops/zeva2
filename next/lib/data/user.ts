import { prisma } from "@/lib/prisma";
import { Idp } from "@/prisma/generated/client";

export const findUniqueMappedUser = async (idpSub: string) => {
  const users = await prisma.user.findMany({
    where: {
      idpSub: idpSub,
    },
    include: {
      organization: true,
    },
  });
  if (users.length === 0 || users.length > 1) {
    return null;
  }
  return users[0];
};

export const findUniqueUnmappedUser = async (
  idp: Idp,
  idpUsername: string,
  idpEmail: string,
) => {
  const users = await prisma.user.findMany({
    where: {
      idp: idp,
      idpUsername: idpUsername,
      idpEmail: idpEmail,
      idpSub: null,
    },
    include: {
      organization: true,
    },
  });
  if (users.length === 0 || users.length > 1) {
    return null;
  }
  return users[0];
};

export const mapUser = async (id: number, idpSub: string | null) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      idpSub: idpSub,
    },
  });
};
