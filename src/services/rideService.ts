import axiosInstance from "./axios";

export const fetchRides = async () => {
  const res = await axiosInstance.get("/rides");
  return res.data;
} 