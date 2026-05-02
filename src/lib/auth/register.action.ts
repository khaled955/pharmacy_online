// "use server";
// import { OTP_TYPES } from "@/lib/constants/auth.constant";
// import { sendOtpService } from "./send-otp.service";
// import { RegisterFormValues } from "../schemas/auth/register.schema";
// import { createClientFromServer } from "../supabase/server";
// import { supabaseAdmin } from "../supabase/admin";

// export async function registerAction(input: RegisterFormValues) {
//   const supabase = await createClientFromServer();
//   let avatar_url: string | null = null;

//   try {
//     // // Upload avatar to Supabase Storage when a file was selected
//     // if (input.avatar) {
//     //   const fileExt = input.avatar.name.split(".").pop();
//     //   // create photo name
//     //   const fileName = `avatars/${crypto.randomUUID()}.${fileExt}`;

//     //   const { data: uploadData, error: uploadError } = await supabase.storage
//     //     .from("product-images")
//     //     .upload(fileName, input.avatar);

//     //   if (uploadError) throw new Error(uploadError.message);

//     //   const { data: urlData } = supabase.storage
//     //     .from("product-images")
//     //     .getPublicUrl(uploadData.path);

//     //   avatar_url = urlData.publicUrl;
//     // }

//     // // Check email availability before sending OTP
//     // const { data } = await supabaseAdmin.auth.admin.listUsers();
//     // const existingUser = data.users.find((user) => user.email === input.email);

//     // if (existingUser) {
//     //   return {
//     //     status: false,
//     //     message: "Email already registered",
//     //     data: null,
//     //   };
//     // }

//     // Check email availability before uploading avatar
//     const { data, error } = await supabaseAdmin.auth.admin.listUsers();

//     if (error) {
//       throw new Error(error.message);
//     }

//     const existingUser = data.users.find(
//       (user) => user.email?.toLowerCase() === input.email.toLowerCase(),
//     );

//     if (existingUser) {
//       return {
//         status: false,
//         message: "Email already registered",
//         data: null,
//       };
//     }

//     // Send verification OTP to the user's email
//     const otpData = await sendOtpService(input.email, OTP_TYPES.REGISTER);
//     if (!otpData.status) throw new Error(otpData.message);

//     return {
//       status: true,
//       message: "OTP sent to your email",
//       data: {
//         email: input.email,
//         avatar_url,
//         otp: otpData.data?.otp ?? null,
//       },
//     };
//   } catch (err: unknown) {
//     return {
//       status: false,
//       message: err instanceof Error ? err.message : "Registration failed",
//       data: null,
//     };
//   }
// }

"use server";

import { OTP_TYPES } from "@/lib/constants/auth.constant";
import { sendOtpService } from "./send-otp.service";
import type { RegisterFormValues } from "../schemas/auth/register.schema";
import { createClientFromServer } from "../supabase/server";
import { supabaseAdmin } from "../supabase/admin";

const AVATAR_BUCKET = "product-images";
const AVATAR_FOLDER = "avatars";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function registerAction(input: RegisterFormValues) {
  // Variables
  const supabase = await createClientFromServer();
  let avatar_url: string | null = null;
  let uploadedAvatarPath: string | null = null;

  try {
    // Check email availability before uploading avatar
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      throw new Error(error.message);
    }

    const existingUser = data.users.find(
      (user) => user.email?.toLowerCase() === input.email.toLowerCase(),
    );

    if (existingUser) {
      return {
        status: false,
        message: "Email already registered",
        data: null,
      };
    }

    // Upload avatar to Supabase Storage when a file was selected
    if (input.avatar) {
      // validation for photo types
      if (!ALLOWED_AVATAR_TYPES.includes(input.avatar.type)) {
        throw new Error("Avatar must be JPG, PNG, or WEBP");
      }
      // validation for photo size
      if (input.avatar.size > MAX_AVATAR_SIZE) {
        throw new Error("Avatar size must be less than 2MB");
      }

      const fileExt = input.avatar.name.split(".").pop() ?? "webp";
      const fileName = `${AVATAR_FOLDER}/${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(fileName, input.avatar, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      uploadedAvatarPath = uploadData.path;

      const { data: urlData } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(uploadData.path);

      avatar_url = urlData.publicUrl;
    }

    // Send verification OTP to the user's email
    const otpData = await sendOtpService(input.email, OTP_TYPES.REGISTER);

    if (!otpData.status) {
      throw new Error(otpData.message);
    }

    return {
      status: true,
      message: "OTP sent to your email",
      data: {
        email: input.email,
        avatar_url,
        otp:
          process.env.NODE_ENV === "development"
            ? (otpData.data?.otp ?? null)
            : null,
      },
    };
  } catch (err: unknown) {
    if (uploadedAvatarPath) {
      await supabase.storage.from(AVATAR_BUCKET).remove([uploadedAvatarPath]);
    }

    return {
      status: false,
      message: err instanceof Error ? err.message : "Registration failed",
      data: null,
    };
  }
}
