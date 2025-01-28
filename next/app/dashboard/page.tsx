import { auth } from "@/auth";
import { keycloakSignOut } from "../actions/keycloak";

export default async function Dashboard() {
  const session = await auth();
  return (
    <div>
      <h1>Hello {session?.user?.name}, you are logged in!</h1>
      <button
        onClick={async () => {
          "use server";
          await keycloakSignOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
