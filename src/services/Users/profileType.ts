export interface UpdateProfileInput {
  // Fields left flexible since the real endpoint hasn't been confirmed yet —
  // adjust once you paste the actual request/response shape.
  username?: string;
  name?: string;
  email?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}