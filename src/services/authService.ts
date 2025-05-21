import axios from "./axios";
import { User } from "../types";

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post("/auth/login", { email, password });
  const { access_token, refresh_token, user } = res.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("user", JSON.stringify(user));

  return res.data;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthResponse> {
  const res = await axios.post("/auth/register", data);
  const { access_token, refresh_token, user } = res.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("user", JSON.stringify(user));

  return res.data;
}

export async function logoutUser(refresh_token: string) {
  try {
    await axios.post("/auth/logout", { refresh_token });
  } catch (err) {
    console.warn("⚠️ Failed to notify backend about logout.");
  }
}
