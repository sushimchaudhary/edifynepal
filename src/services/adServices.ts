import api from "../api/axiosInstance";

export const adService = {
getAds: async () => {
    const res = await api.get("/api/ads/ads/"); 
    return res.data;
  },
  createAd: async (data: FormData) => {
    const res = await api.post("/api/ads/ads/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

 
updateAd: async (id: number, data: FormData) => {
  const res = await api.patch(`/api/ads/ads/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
},
  deleteAd: async (id: number) => {
    const res = await api.delete(`/api/ads/ads/${id}/`);
    return res.data;
  }
};