"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePasswordAction } from "@/lib/profile/change-password.action";
import {
  changePasswordSchema,
  type ChangePasswordFields,
} from "@/lib/schemas/profile/change-password.schema";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isSubmitted },
  } = useForm<ChangePasswordFields>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordFields> = async (values) => {
    setServerError(undefined);
    const result = await changePasswordAction(values);
    if (result.status) {
      toast.success(result.message);
      reset();
    } else {
      setServerError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Current Password"
        type="password"
        placeholder="Enter current password"
        error={errors.current_password?.message}
        {...register("current_password")}
      />
      <Input
        label="New Password"
        type="password"
        mood="create"
        placeholder="Enter new password"
        error={errors.new_password?.message}
        {...register("new_password")}
      />
      <Input
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />
      <Button
        type="submit"
        isLoading={isSubmitting}
        serverError={serverError}
        disabled={!isValid && isSubmitted}
      >
        Change Password
      </Button>
    </form>
  );
}
