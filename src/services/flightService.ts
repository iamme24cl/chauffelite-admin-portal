import axiosInstance from "./axios";

export const getFlightInfo = async (flight: string, date: string) => {
  const response = await axiosInstance.get("/flight", {
    params: { flight, date },
  });
  return response.data;
};