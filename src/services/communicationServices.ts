import api from "../api/axiosInstance";

export const communicationService = {
  getMessages: async () => {
    const res = await api.get("/api/communication/contacts/");
    return res.data;
  },

  deleteMessage: async (id: number) => {
    const res = await api.delete(`/api/communication/contacts/${id}/`);
    return res.data;
  }
};