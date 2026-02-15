import api from "../api/axiosInstance";

export const companyService = {
  getDetails: async () => {
    const res = await api.get("/api/company/company-details/");
    return res.data;
  },

  createDetails: async (data: FormData) => {
    const res = await api.post("/api/company/company-details/", data);
    return res.data;
  },

  updateDetails: async (id: number, data: FormData) => {
    const res = await api.patch(`/api/company/company-details/${id}/`, data);
    return res.data;
  },

  deleteDetails: async (id: number) => {
    const res = await api.delete(`/api/company/company-details/${id}/`);
    return res.data;
  }
};