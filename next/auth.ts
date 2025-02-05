import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import {
  findUniqueMappedUser,
  findUniqueUnmappedUser,
  mapUser,
} from "./lib/data/user";
import { Idp } from "./prisma/generated/client";
import { getIdpEnum } from "./lib/utils/getEnums";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (trigger === "signIn") {
        token.idToken = account?.id_token;
        const idpSub = profile?.sub;
        const idp = getIdpEnum(profile?.identity_provider);
        let user;
        if (idpSub) {
          user = await findUniqueMappedUser(idpSub);
        }
        if (!user && idp) {
          const idpEmail = profile?.email;
          let idpUsername;
          if (idp === Idp.BCEID_BUSINESS) {
            idpUsername = profile?.bceid_username;
          } else if (idp === Idp.IDIR) {
            idpUsername = profile?.idir_username;
          }
          if (idpUsername && idpEmail) {
            user = await findUniqueUnmappedUser(idp, idpUsername, idpEmail);
            if (user) {
              await mapUser(user.id, idpSub ?? null);
            }
          }
        }
        if (user && user.isActive) {
          token.roles = user.roles;
          token.isGovernment = user.organization.isGovernment;
          return token;
        }
        if (!user) {
          console.log("Failed to map user: ", profile);
        }
        return null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.idToken = token.idToken;
      session.user.roles = token.roles;
      session.user.isGovernment = token.isGovernment;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const authenticated = !!auth?.user;
      if (pathname === "/") {
        if (authenticated) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      if (!authenticated) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
});
