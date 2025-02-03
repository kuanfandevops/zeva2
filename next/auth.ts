import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    signIn({ profile }) {
      // use profile.sub to get user from db; if no user returned, use profile.email and if found, set the sub
      // otherwise, return false
      return true;
    },
    jwt({ token, account, trigger }) {
      if (trigger === "signIn") {
        token.idToken = account?.id_token;
        // todo: get user and write stuff from user to token (e.g. is_gov, roles, etc.)
      }
      return token;
    },
    session({ session, token }) {
      const idToken = token.idToken;
      if (idToken) {
        session.user.idToken = idToken;
      }
      // todo: get other fields from token (e.g. is_gov, roles, etc.) and write to session
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
