import axiosInstance from "./axios";
import { VehicleFormInput } from "../types";

export const fetchVehicles = async () => {
  const res = await axiosInstance.get("/vehicles/");
  return res.data;
}

export const createVehicle =  async (vehicle: VehicleFormInput) => {
  const res = await axiosInstance.post("/vehicles/", vehicle);
  return res.data;
}

export const updateVehicle = async (id: string, vehicle: VehicleFormInput) => {
  const res = await axiosInstance.patch(`/vehicles/${id}`, vehicle);
  return res.data;
}

export const deleteVehicle = async (id: string) => {
  const res = await axiosInstance.delete(`/vehicles/${id}`);
  return res.data;
}