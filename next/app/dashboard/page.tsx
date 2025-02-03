import { auth } from "@/auth";
import { keycloakSignOut } from "@/app/lib/actions/keycloak";
import { Button } from "@/app/lib/components/Button";

export default async function Dashboard() {
  const session = await auth();
  return (
    <div>
      <h1>Hello {session?.user?.name}, you are logged in!</h1>
      <Button onClick={keycloakSignOut}>Sign Out</Button>
    </div>
  );
}
