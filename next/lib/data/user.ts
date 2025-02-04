import { prisma } from "@/lib/prisma";
import { Idp } from "@/prisma/generated/client";

export const findUniqueMappedUser = async (keycloakId: string) => {
  const users = await prisma.user.findMany({
    where: {
      keycloakId: keycloakId,
    },
    include: {
      organization: true
    }
  });
  if (users.length === 0 || users.length > 1) {
    return null;
  }
  return users[0];
};

export const findUniqueUnmappedUser = async (idp: Idp, idpUsername: string) => {
  const users = await prisma.user.findMany({
    where: {
      idp: idp,
      idpUsername: idpUsername,
      keycloakId: null,
    },
    include: {
      organization: true
    }
  });
  if (users.length === 0 || users.length > 1) {
    return null;
  }
  return users[0];
};

export const mapUser = async (id: number, keycloakId: string | null) => {
  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      keycloakId: keycloakId,
    },
  });
};
