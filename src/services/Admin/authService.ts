// src/Services/Auth/onboarding.js

import api from "../api";

export const authService = {

    create: async (data: { username: string; email: string; password: string; role: string; }) => {
      try {
        const res = await api.post("/user/signup", data);
        // console.log("Create User success:", res.data);
        return res.data;
      } catch (error: any) {
        const msg = (error?.response as any)?.data?.message || error?.message || String(error);
        console.error("Create User error:", msg);
        throw error;
      }
    },
    
    login: async (data: {email: string; password: string;}) => {
      try {
        const res = await api.post("/user/login", data);
        // console.log("Create User success:", res.data);
        return res.data;
      } catch (error: any) {
        
        throw error;
      }
    },
    

    update: async (id: string, data: any) => {
      try {
        const res = await api.patch(`/user/${id}`, data);

        return res.data.data;
      } catch (error) {
        
        throw error;
      }
    },

    getById: async (userId: string) => {
      try {
        const res = await api.get(`/user/${userId}`);
        return res.data.data;
      } catch (error: any) {
        throw error;
      }
    },

  //   getById: async (id) => {
  //     try {
  //       const res = await api.get(`/api/Teacher/GetTeacherById/${id}`);
  //       // console.log("success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },

  // getArrayOfTeachersById: async (ids) => {
  //   try {
  //     const requests = ids.map(i => api.get(`/api/Teacher/GetTeacherById/${i.teacher.teacherId}`));
  //     const responses = await Promise.all(requests);

  //     const data = responses.map(res => res.data.data);
  //     // console.log("success:", data);

  //     return data;
  //   } catch (error) {
  //     console.error("getArrayOfTeachersById error:", error?.response?.data?.message || error.message);
  //     throw error;
  //   }
  // },

  //   getById: async (id) => {
  //     try {
  //       const res = await api.get(`/api/Teacher/GetTeacherById/${id}`);
  //       // console.log("success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },
  //   delete: async (id) => {
  //     try {
  //       const res = await api.delete(`/api/Teacher/${id}`);
  //       console.log("DeleteTeacher success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },
};