import axiosInstance from "./axios";

export const fetchRides = async () => {
  const res = await axiosInstance.get("/rides");
  return res.data;
} 

export const updateRideStatus = async (rideId: string, status: string) => {
  const res = await axiosInstance.patch(`/rides/${rideId}/status`, { status });
  return res.data;
}

export const assignDriverToRide = async (rideId: string, driverId: string) => {
  const res = await axiosInstance.patch(`/rides/${rideId}/assign`, { driver_id: driverId });
  return res.data;
}