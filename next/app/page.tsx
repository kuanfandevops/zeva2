"use client";
import { keycloakSignIn } from "./actions/keycloak";

export default function Home() {
  return (
    <div>
      <button onClick={() => keycloakSignIn("bceidbusiness")}>
        Sign in with BCeID
      </button>
      <br />
      <button onClick={() => keycloakSignIn("idir")}>Sign in with IDIR</button>
    </div>
  );
}
