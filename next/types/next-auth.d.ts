declare module "@auth/core/types" {
  interface User {
    idToken?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    idToken?: string;
  }
}

//need an export statement so that typescript recognizes this file as a module
export {};
