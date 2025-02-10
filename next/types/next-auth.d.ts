declare module "@auth/core/types" {
  interface User {
    idToken?: string;
    roles?: $Enums.Role[];
    isGovernment?: Boolean;
    organizationId?: number;
  }
}

declare module "@auth/core/types" {
  interface Profile {
    identity_provider?: string;
    bceid_username?: string;
    idir_username?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    idToken?: string;
    roles?: $Enums.Role[];
    isGovernment?: Boolean;
    organizationId?: number;
  }
}

//need an export statement so that typescript recognizes this file as a module
export {};
