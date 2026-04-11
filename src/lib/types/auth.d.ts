export type AuthUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: "customer" | "admin";
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

// Login data shape
export type LoginResponseData = {
  user: AuthUser;
  access_token: string;
};

// Register response data shape
export type RegisterResponseData = {
  user: AuthUser;
  otp?: string | null; // only present in dev
};
