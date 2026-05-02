"use server";

import { redirect } from "next/navigation";
import { createClientFromServer } from "../supabase/server";

export async function logoutAction() {
  const supabase = await createClientFromServer();
  await supabase.auth.signOut();
  redirect("/");
}
