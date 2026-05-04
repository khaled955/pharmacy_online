import { LucideIcon } from "lucide-react";
import { AUTH_API, AUTH_ROUTES, FORGOT_PASSWORD_STEPS, OTP_TYPES, REGISTER_STEPS } from "../constants/auth.constant";

export type UserRole = "customer" | "admin";

// data returned from database
export type AuthUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  accessToken: string;
};

// data that returned from session next-auth
export type SessionUser = Omit<AuthUser, "accessToken">;

// data returned from Jwt function  in next-auth
export type NextAuthUserPayload = {
  id: string;
  accessToken: string;
  user: SessionUser;
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

export type RegisterResponseData = {
  email: string;
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

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type AuthApiEndpoint = (typeof AUTH_API)[keyof typeof AUTH_API];
export type OtpType = (typeof OTP_TYPES)[keyof typeof OTP_TYPES];
export type RegisterStep = (typeof REGISTER_STEPS)[keyof typeof REGISTER_STEPS];
export type ForgotPasswordStep =
  (typeof FORGOT_PASSWORD_STEPS)[keyof typeof FORGOT_PASSWORD_STEPS];



 export type UploadData = {
  path: string;
  id: string;
  fullPath: string;
};

 export type PublicUrlData = {
  publicUrl: string;
};

