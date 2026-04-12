import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1> hello from home page Connected!</h1>
      <p>{user ? `Logged in: ${user.email}` : "Not logged in"}</p>
    </div>
  );
}
