import api from "../api/axiosInstance";

export const categoryService = {
  getDetails: async () => {
    const res = await api.get("/api/content/categories/");
    return res.data;
  },

  createDetails: async (data: any) => {
    const res = await api.post("/api/content/categories/", data);
    return res.data;
  },

  updateDetails: async (id: number, data: any) => {
    const res = await api.patch(`/api/content/categories/${id}/`, data);
    return res.data;
  },

  deleteDetails: async (id: number) => {
    const res = await api.delete(`/api/content/categories/${id}/`);
    return res.data;
  }
};