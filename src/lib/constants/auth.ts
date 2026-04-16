
//Route paths 
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
} as const

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES]

// Internal API endpoints
export const AUTH_API = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  SEND_OTP: "/api/auth/send-otp",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
} as const

export type AuthApiEndpoint = (typeof AUTH_API)[keyof typeof AUTH_API]

// OTP configuration
export const OTP_CONFIG = {
  /** Digit length of every OTP generated in this app */
  LENGTH: 5,
  /** Minutes until OTP record expires in the DB */
  EXPIRY_MINUTES: 10,
} as const

//Password policy 
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
} as const

// OTP types
export const OTP_TYPES = {
  REGISTER: "register",
  FORGOT_PASSWORD: "forgot_password",
} as const

export type OtpType = (typeof OTP_TYPES)[keyof typeof OTP_TYPES]

// Multi-step form step names 

/** Steps for the register flow (form → otp) */
export const REGISTER_STEPS = {
  FORM: "register",
  OTP: "otp",
} as const

export type RegisterStep = (typeof REGISTER_STEPS)[keyof typeof REGISTER_STEPS]

/** Steps for the forgot-password flow (email → otp → new_password) */
export const FORGOT_PASSWORD_STEPS = {
  EMAIL: "email",
  OTP: "otp",
  NEW_PASSWORD: "new_password",
} as const

export type ForgotPasswordStep =
  (typeof FORGOT_PASSWORD_STEPS)[keyof typeof FORGOT_PASSWORD_STEPS]

//Cookie names 
export const AUTH_COOKIES = {
  /** Set after OTP is verified for forgot-password; authorises the reset-password call */
  PW_RESET_VERIFIED: "pw_reset_verified",
} as const

/** Minutes the pw_reset_verified cookie stays alive */
export const RESET_COOKIE_EXPIRY_MINUTES = 15

//Supabase table names
export const DB_TABLES = {
  PROFILES: "profiles",
  OTP_RECORDS: "password_reset_otps",
} as const

//OTP resend cooldown
/** localStorage key that stores the cooldown expiry ISO string */
export const OTP_COOL_DOWN_KEY = "otp_cooldown"
/** localStorage key that stores the email an OTP was last sent to */
export const OTP_EMAIL_KEY = "otp_email"
/** Cooldown duration in milliseconds before the user can resend */
export const COOL_DOWN_TIME = 60 * 1000 // 60 s

//TanStack Query mutation keys
export const MUTATION_KEYS = {
  LOGIN: ["auth", "login"] as const,
  REGISTER: ["auth", "register"] as const,
  SEND_OTP: ["auth", "send-otp"] as const,
  VERIFY_OTP: ["auth", "verify-otp"] as const,
  RESET_PASSWORD: ["auth", "reset-password"] as const,
  RESEND_OTP: ["auth", "resend-otp"] as const,
} as const

 export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/