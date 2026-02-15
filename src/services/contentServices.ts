import api from "../api/axiosInstance";

export const contentService = {
  getAbout: async () => {
    const res = await api.get("/api/content/about/");
    return res.data;
  },

  createAbout: async (data: FormData) => {
    const res = await api.post("/api/content/about/", data);
    return res.data;
  },

  updateAbout: async (id: number, data: FormData) => {
 return await api.patch(`/api/content/about/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  },

  deleteAbout: async (id: number) => {
    const res = await api.delete(`/api/content/about/${id}/`);
    return res.data;
  },


// services/contentServices.ts

getPostById: async (id: number | string) => {
  const res = await api.get(`/api/content/posts/${id}/`);
  return res.data;
},

 //---------Post Blog------------------

getPosts: async () => {
  const res = await api.get("/api/content/posts/");
  return res.data;
},


createPost: async (data: FormData) => {
  const res = await api.post("/api/content/posts/", data);
  return res.data;
},
updatePost: async (id: number, data: FormData) => {
  return await api.patch(`/api/content/posts/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
},


deletePost: async (id: number) => {
  const res = await api.delete(`/api/content/posts/${id}/`);
  return res.data;
},

getCategories: async () => {
  const res = await api.get("/api/content/categories/");
  return res.data;
}
};