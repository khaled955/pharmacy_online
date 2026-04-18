import { LucideIcon } from "lucide-react";

export type UserRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
};

export type SuccessResponse<T = null> = {
  status: true;
  message: string;
  data: T;
};

export type ErrorResponse = {
  status: false;
  message: string;
  data: null;
};

export type AuthResponse<T = null> = SuccessResponse<T> | ErrorResponse;

export type LoginResponseData = {
  user: AuthUser;
  access_token?: string;
};

export type RegisterResponseData = {
  email: string;
  avatar_url: string | null;
  otp?: string | null;
};

export type SendOtpResponseData = {
  email: string;
  otp?: string | null;
};

export type VerifyOtpResponseData = {
  email: string;
};

export type ResetPasswordResponseData = null;

export type AuthFeature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};


