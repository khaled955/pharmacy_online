// ─────────────────────────────────────────────────────────────────────────────
// AUTH TYPES
// Shared TypeScript types for the entire authentication domain.
// ─────────────────────────────────────────────────────────────────────────────

// ── Domain model ──────────────────────────────────────────────────────────────

export type UserRole = "customer" | "admin"

export type AuthUser = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
}

// ── Generic API response envelope ─────────────────────────────────────────────

export type SuccessResponse<T = null> = {
  status: true
  message: string
  data: T
}

export type ErrorResponse = {
  status: false
  message: string
  data: null
}

export type AuthResponse<T = null> = SuccessResponse<T> | ErrorResponse

// ── Per-action response data shapes ──────────────────────────────────────────

/** Data returned after a successful login */
export type LoginResponseData = {
  user: AuthUser
  access_token: string
}

/** Data returned after a successful register (otp visible only in dev) */
export type RegisterResponseData = {
  user: AuthUser
  /** OTP value — only present in NODE_ENV=development */
  otp?: string | null
}

/** Data returned after sending an OTP email */
export type SendOtpResponseData = {
  email: string
  /** OTP value — only present in NODE_ENV=development */
  otp?: string | null
}

/** Data returned after a successful OTP verification */
export type VerifyOtpResponseData = {
  email: string
}

/** Data returned after a successful password reset (no payload needed) */
export type ResetPasswordResponseData = null
