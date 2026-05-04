import "server-only";

import { createClientFromServer } from "@/lib/supabase/server";

const AVATAR_BUCKET = "product-images";
const AVATAR_FOLDER = "avatars";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadedAvatarResult = {
  path: string;
  fullPath: string;
  id: string;
  publicUrl: string;
};

export async function uploadAvatarService(
  avatar: File,
): Promise<UploadedAvatarResult> {
  const supabase = await createClientFromServer();

  if (!ALLOWED_AVATAR_TYPES.includes(avatar.type)) {
    throw new Error("Avatar must be JPG, PNG, or WEBP");
  }

  if (avatar.size > MAX_AVATAR_SIZE) {
    throw new Error("Avatar size must be less than 2MB");
  }

  const fileExt =
    avatar.type === "image/png"
      ? "png"
      : avatar.type === "image/webp"
        ? "webp"
        : "jpg";

  const fileName = `${AVATAR_FOLDER}/${crypto.randomUUID()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(fileName, avatar, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError || !uploadData) {
    throw new Error(uploadError?.message || "Avatar upload failed");
  }

  const { data: urlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(uploadData.path);

  return {
    path: uploadData.path,
    fullPath: uploadData.fullPath,
    id: uploadData.id,
    publicUrl: urlData.publicUrl,
  };
}

export async function removeAvatarService(path: string) {
  const supabase = await createClientFromServer();

  await supabase.storage.from(AVATAR_BUCKET).remove([path]);
}
