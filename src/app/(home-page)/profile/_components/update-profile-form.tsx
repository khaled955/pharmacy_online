"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfileAction } from "@/lib/profile/update-profile.action";
import {
  updateProfileSchema,
  type UpdateProfileFields,
} from "@/lib/schemas/profile/update-profile.schema";

interface UpdateProfileFormProps {
  first_name: string;
  last_name: string;
  phone: string | null;
}

export function UpdateProfileForm({
  first_name,
  last_name,
  phone,
}: UpdateProfileFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isSubmitted },
  } = useForm<UpdateProfileFields>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    defaultValues: {
      first_name,
      last_name,
      phone: phone ?? "",
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileFields> = async (values) => {
    setServerError(undefined);
    const result = await updateProfileAction(values);
    if (result.status) {
      toast.success(result.message);
      router.refresh();
    } else {
      setServerError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          type="text"
          placeholder="First name"
          error={errors.first_name?.message}
          {...register("first_name")}
        />
        <Input
          label="Last Name"
          type="text"
          placeholder="Last name"
          error={errors.last_name?.message}
          {...register("last_name")}
        />
      </div>
      <Input
        label="Phone Number"
        startIcon={<Phone size={16} strokeWidth={1.75} />}
        placeholder="+966512345678"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        serverError={serverError}
        disabled={!isValid && isSubmitted}
      >
        Save Changes
      </Button>
    </form>
  );
}
