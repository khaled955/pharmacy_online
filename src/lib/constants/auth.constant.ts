import { Pill, HeartPulse, BadgeCheck, Truck } from "lucide-react";
import { AuthFeature } from "../types/auth";

//Route paths
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const;


// auth router end point
export const AUTH_API = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  SEND_OTP: "/api/auth/send-otp",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
} as const;


// OTP configuration
export const OTP_CONFIG = {
  /*Digit length of every OTP  */
  LENGTH: 5,
  /** Minutes until OTP record expires in the DB */
  EXPIRY_MINUTES: 10,
} as const;

//Password policy
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
} as const;

// OTP types
export const OTP_TYPES = {
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot_password",
} as const;



/** Steps for the register flow (form → otp) */
export const REGISTER_STEPS = {
  FORM: "register",
  OTP: "otp",
} as const;


/** Steps for the forgot-password flow (email → otp → new_password) */
export const FORGOT_PASSWORD_STEPS = {
  EMAIL: "email",
  OTP: "otp",
  NEW_PASSWORD: "new_password",
} as const;


//Cookie names
export const AUTH_COOKIES = {
  /** Set after OTP is verified for forgot-password; authorises the reset-password call */
  PW_RESET_VERIFIED: "pw_reset_verified",
} as const;

/** Minutes the pw_reset_verified cookie stays alive */
export const RESET_COOKIE_EXPIRY_MINUTES = 15;

// seconds to redirected after success
export const AUTH_REDIRECT_DURATION = 2000   // 2seconds
//Supabase table names
export const DB_TABLES = {
  PROFILES: "profiles",
  OTP_RECORDS: "password_reset_otps",
} as const;

//OTP resend cooldown
/** localStorage key that stores the cooldown expiry ISO string */
export const OTP_COOL_DOWN_KEY = "otp_cooldown";
/** localStorage key that stores the email an OTP was last sent to */
export const OTP_EMAIL_KEY = "otp_email";
/** Cooldown duration in milliseconds before the user can resend */
export const COOL_DOWN_TIME = 60 * 1000; // 60 s


export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const FIRST_LAST_NAME_PATTERN = /^[a-zA-Zأ-ي]+$/;
export const SAUDI_PHONE_PATTERN = /^(\+9665|05)[0-9]{8}$/;
export const OTP_PATTERN = /^\d+$/;
// REMOVE THIS LATER — FOR DEV PURPOSES ONLY
// ToDo

export const AUTH_FEATURES: AuthFeature[] = [
  {
    icon: Pill,
    title: "10,000+ medications",
    desc: "Genuine products from licensed suppliers",
  },
  {
    icon: HeartPulse,
    title: "24 / 7 pharmacist support",
    desc: "Chat with a certified pharmacist anytime",
  },
  {
    icon: BadgeCheck,
    title: "Verified & licensed",
    desc: "Fully regulated online pharmacy",
  },
  {
    icon: Truck,
    title: "Fast home delivery",
    desc: "Same-day delivery in most cities",
  },
];
