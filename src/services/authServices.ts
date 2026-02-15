// import Cookies from "js-cookie";
// import api from "../api/axiosInstance";


// export const loginUser = async (credentials: any) => {
//   try {
//     const res = await api.post("/api/auth/login/", credentials);
//     const { access, refresh } = res.data;

//    Cookies.set("accessToken", access, { 
//         expires: 30, 
//         path: '/',
//         secure: true, 
//         sameSite: 'strict'
//     });

//     Cookies.set("refreshToken", refresh, { 
//         expires: 30, 
//         path: '/',
//         secure: true,
//         sameSite: 'strict'
//     });

//     return res.data;
//   } catch (error: any) {
//     const errorMsg = error.response?.data?.detail || "Invalid username or password";
//     throw new Error(errorMsg);
//   }
// };

import Cookies from "js-cookie";
import api from "../api/axiosInstance";

export const loginUser = async (credentials: any) => {
  try {
    const res = await api.post("/api/auth/login/", credentials);
    const { access, refresh, is_staff, is_superuser, first_name } = res.data;

    // टोकनहरू
    Cookies.set("accessToken", access, { expires: 30 });
    Cookies.set("refreshToken", refresh, { expires: 30 });

    // रोलहरू (Dashboard मेनु फिल्टर गर्नको लागि)
    Cookies.set("is_staff", String(is_staff), { expires: 30 });
    Cookies.set("is_superuser", String(is_superuser), { expires: 30 });
    Cookies.set("userName", first_name || "Admin", { expires: 30 });

    console.log("Login Success! Roles:", { is_staff, is_superuser });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};