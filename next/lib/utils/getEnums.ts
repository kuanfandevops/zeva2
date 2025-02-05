import { Idp, Role, ModelYear } from "@/prisma/generated/client";

export const getIdpEnum = (idpName?: string) => {
  if (idpName) {
    return Idp[idpName.toUpperCase().replace("_", "") as keyof typeof Idp];
  }
  return undefined;
};

export const getModelYearEnum = (modelYear?: string | number) => {
  if (modelYear) {
    return ModelYear[("MY_" + modelYear) as keyof typeof ModelYear];
  }
  return undefined;
};

export const getRoleEnum = (role?: string) => {
  if (role) {
    return Role[
      role
        .toUpperCase()
        .replace(" ", "_")
        .replace("/", "_") as keyof typeof Role
    ];
  }
  return undefined;
};
