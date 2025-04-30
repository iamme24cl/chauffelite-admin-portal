import axiosInstance from "./axios";

export const fetchDrivers = async () => {
  const res = await axiosInstance.get("/drivers");
  return res.data;
};

export const fetchDriver = async (id: string) => {
  const res = await axiosInstance.get(`/drivers/${id}`);
  return res.data;
};

export const createDriver = async (driver: any) => {
  const res = await axiosInstance.post("/drivers", driver);
  return res.data;
};

export const updateDriver = async (id: string, driver: any) => {
  const res = await axiosInstance.put(`/drivers/${id}, driver`);
  return res.data;
};

export const deleteDriver = async (id: string) => {
  const res = await axiosInstance.delete(`/drivers/${id}`);
  return res.data;
};