import axiosInstance from "./axios";

export const verifyLogin = async () => {
  await axiosInstance.get("/auth/login");
};