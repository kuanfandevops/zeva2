import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import {
  findUniqueMappedUser,
  findUniqueUnmappedUser,
  mapUser,
} from "./lib/data/user";
import { Idp } from "./prisma/generated/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (trigger === "signIn") {
        token.idToken = account?.id_token;
        const keycloakId = profile?.sub;
        const idp = Idp[profile?.identity_provider as keyof typeof Idp];
        let user;
        if (keycloakId) {
          user = await findUniqueMappedUser(keycloakId);
        }
        if (!user && idp) {
          let idpUsername;
          if (idp === Idp.BCEID_BUSINESS) {
            idpUsername = profile?.bceid_username;
          } else if (idp === Idp.IDIR) {
            idpUsername = profile?.idir_username;
          }
          if (idpUsername) {
            user = await findUniqueUnmappedUser(idp, idpUsername);
            if (user) {
              await mapUser(user.id, keycloakId ?? null);
            }
          }
        }
        if (user && user.isActive) {
          token.roles = user.roles;
          token.isGovernment = user.organization.isGovernment;
          return token;
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
