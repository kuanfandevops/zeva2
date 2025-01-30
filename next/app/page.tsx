import { keycloakSignIn } from "./lib/actions/keycloak";

export default function Home() {
  return (
    <div>
      <button
        onClick={async () => {
          "use server";
          await keycloakSignIn("bceidbusiness");
        }}
      >
        Sign in with BCeID
      </button>
      <br />
      <button
        onClick={async () => {
          "use server";
          await keycloakSignIn("idir");
        }}
      >
        Sign in with IDIR
      </button>
    </div>
  );
}
