export interface LoginBodyDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  login: {
    data: {
      session: {
        access_token: string;
      };
    };
  };
}

export interface UserState {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
  accessToken?: string;
}
