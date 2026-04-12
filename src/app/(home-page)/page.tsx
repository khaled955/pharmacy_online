import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1>Connected!</h1>
      <p>{user ? `Logged in: ${user.email}` : "Not logged in"}</p>
    </div>
  );
}
