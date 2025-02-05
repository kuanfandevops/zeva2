import { prisma } from "@/lib/prisma";
import { prismaOld } from "@/lib/prismaOld";
import { ModelYear, Role, Idp } from "./generated/client";
import { getModelYearEnum, getRoleEnum } from "@/lib/utils/getEnums";

// prismaOld to interact with old zeva db; prisma to interact with new zeva db
const main = async () => {
  const mapOfModelYearIdsToModelYearEnum: {
    [id: number]: ModelYear | undefined;
  } = {};
  const mapOfRoleIdsToRoleEnum: { [id: number]: Role | undefined } = {};
  const mapOfOldOrgIdsToNewOrgIds: { [id: number]: number } = {};
  const mapOfOldUserIdsToNewUserIds: { [id: number]: number } = {};

  const modelYearsOld = await prismaOld.model_year.findMany();
  for (const modelYearOld of modelYearsOld) {
    mapOfModelYearIdsToModelYearEnum[modelYearOld.id] = getModelYearEnum(
      modelYearOld.description,
    );
  }

  const rolesOld = await prismaOld.role.findMany();
  for (const roleOld of rolesOld) {
    mapOfRoleIdsToRoleEnum[roleOld.id] = getRoleEnum(roleOld.role_code);
  }

  // add orgs:
  const orgsOld = await prismaOld.organization.findMany();
  for (const orgOld of orgsOld) {
    const orgNew = await prisma.organization.create({
      data: {
        name: orgOld.organization_name,
        firstModelYear:
          mapOfModelYearIdsToModelYearEnum[orgOld.first_model_year_id ?? -1] ??
          ModelYear.MY_2019,
        isGovernment: orgOld.is_government,
      },
    });
    mapOfOldOrgIdsToNewOrgIds[orgOld.id] = orgNew.id;
  }

  // add users:
  const usersOld = await prismaOld.user_profile.findMany({
    include: {
      organization: true,
    },
  });
  for (const [index, userOld] of usersOld.entries()) {
    const userNew = await prisma.user.create({
      data: {
        contactEmail: userOld.email,
        idpEmail:
          userOld.keycloak_email ?? "noSuchEmail" + index + "@email.com",
        idpSub: userOld.keycloak_user_id,
        idp: userOld.organization?.is_government
          ? Idp.IDIR
          : Idp.BCEID_BUSINESS,
        idpUsername: userOld.username,
        isActive: userOld.is_active,
        organizationId: mapOfOldOrgIdsToNewOrgIds[userOld.organization_id!],
      },
    });
    mapOfOldUserIdsToNewUserIds[userOld.id] = userNew.id;
  }

  // update each user with their roles:
  const usersRolesOld = await prismaOld.user_role.findMany();
  for (const userRoleOld of usersRolesOld) {
    await prisma.user.update({
      where: {
        id: mapOfOldUserIdsToNewUserIds[userRoleOld.user_profile_id],
      },
      data: {
        roles: {
          push: mapOfRoleIdsToRoleEnum[userRoleOld.role_id],
        },
      },
    });
  }
};

main()
  .then(async () => {
    console.log("seed successful");
    await prisma.$disconnect();
    await prismaOld.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    await prismaOld.$disconnect();
    process.exit(1);
  });
