import Link from "next/link";
import { fetchUsers } from "./lib/data";

export default async function Users() {
  const users = await fetchUsers();
  const items = [];
  for (const user of users) {
    const id = user.id;
    const item = (
      <li key={id}>
        {user.id} - {user.roles.join(", ")} - {user.contactEmail} -
        {<Link href={"/usersExample/" + id}>Inspect</Link>}
      </li>
    );
    items.push(item);
  }
  return <ul>{items}</ul>;
}
