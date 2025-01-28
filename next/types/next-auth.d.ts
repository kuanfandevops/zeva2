import NextAuth from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    idToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    idToken?: string;
  }
}
