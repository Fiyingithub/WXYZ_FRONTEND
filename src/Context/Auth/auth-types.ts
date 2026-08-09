export interface UserData {
  id: string;
  email: string;
  role: string;
  username: string;
  name?: string
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
  updateUser: (updated: UserData) => void;
}
