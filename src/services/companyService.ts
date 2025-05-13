import axiosInstance from "./axios";
import { CompanyForm } from "../types";

export const fetchCompany = async (companyId: string) => {
  const res = await axiosInstance.get(`/companies/${companyId}`);
  return res.data;
}

export const updateCompany = async (companyId: string, data: Partial<CompanyForm>) => {
  const res = await axiosInstance.patch(`/companies/${companyId}`, data);
  return res.data;
}

export const uploadCompanyLogo = async (companyId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    `/companies/${companyId}/upload-logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
}