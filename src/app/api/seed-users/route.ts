import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
// 
type SeedUser = {
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  email: string;
};

const users: SeedUser[] = [
  {
    first_name: "Ahmed",
    last_name: "Alharbi",
    full_name: "Ahmed Alharbi",
    phone: "966501234101",
    avatar_url: "https://i.pravatar.cc/300?img=11",
    email: "ahmed.alharbi.101@example.com",
  },
  {
    first_name: "Faisal",
    last_name: "Alqahtani",
    full_name: "Faisal Alqahtani",
    phone: "966501234102",
    avatar_url: "https://i.pravatar.cc/300?img=12",
    email: "faisal.alqahtani.102@example.com",
  },
  {
    first_name: "Mohammed",
    last_name: "Alshehri",
    full_name: "Mohammed Alshehri",
    phone: "966501234103",
    avatar_url: "https://i.pravatar.cc/300?img=13",
    email: "mohammed.alshehri.103@example.com",
  },
  {
    first_name: "Abdullah",
    last_name: "Aldosari",
    full_name: "Abdullah Aldosari",
    phone: "966501234104",
    avatar_url: "https://i.pravatar.cc/300?img=14",
    email: "abdullah.aldosari.104@example.com",
  },
  {
    first_name: "Saad",
    last_name: "Alenezi",
    full_name: "Saad Alenezi",
    phone: "966501234105",
    avatar_url: "https://i.pravatar.cc/300?img=15",
    email: "saad.alenezi.105@example.com",
  },
];

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`listUsers failed: ${error.message}`);
    }

    const matchedUser = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );

    if (matchedUser) {
      return matchedUser.id;
    }

    if (data.users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

export async function POST() {
  const results: Array<{
    email: string;
    success?: boolean;
    source?: "created" | "existing";
    error?: string;
  }> = [];

  for (const user of users) {
    let authUserId: string | null = null;
    let source: "created" | "existing" = "created";

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: "TestUser123!",
      email_confirm: true,
      user_metadata: {
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        phone: user.phone,
        avatar_url: user.avatar_url,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already been registered")) {
        source = "existing";

        try {
          authUserId = await findAuthUserIdByEmail(user.email);
        } catch (findError) {
          results.push({
            email: user.email,
            error:
              findError instanceof Error
                ? findError.message
                : "Failed to find existing auth user",
          });
          continue;
        }

        if (!authUserId) {
          results.push({
            email: user.email,
            error: "User exists in auth but could not resolve user id",
          });
          continue;
        }
      } else {
        results.push({
          email: user.email,
          error: error.message,
        });
        continue;
      }
    } else {
      authUserId = data.user?.id ?? null;
    }

    if (!authUserId) {
      results.push({
        email: user.email,
        error: "Missing auth user id",
      });
      continue;
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: authUserId,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.full_name,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: "customer",
      });

    if (profileError) {
      results.push({
        email: user.email,
        error: profileError.message,
      });
      continue;
    }

    results.push({
      email: user.email,
      success: true,
      source,
    });
  }

  return NextResponse.json({ results });
}
