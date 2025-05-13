import axiosInstance from "./axios";

export const verifyLogin = async () => {
  const res = await axiosInstance.get("/auth/login");
  return res.data;
};