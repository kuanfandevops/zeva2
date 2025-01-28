import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    jwt({ token, user, account, trigger }) {
      if (trigger === "signIn") {
        //todo: from db, get user U associated with token's sub, and write some of U's properties into token
        token.idToken = account?.id_token;
      }
      return token;
    },
    session({ session, token }) {
      const idToken = token.idToken;
      if (idToken) {
        session.user.idToken = idToken;
      }
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
