// import axios from "axios";
// import type { BaseQueryFn } from "@reduxjs/toolkit/query";
// import type { AxiosRequestConfig, AxiosError } from "axios";

// // الـ axios instance الأساسي
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor - بيحط الـ token في كل request تلقائياً
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor - لو جه 401 يعمل redirect للـ login
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// // axiosBaseQuery - عشان RTK Query يستخدم axios
// export const axiosBaseQuery = (): BaseQueryFn
//   {
//     url: string;
//     method?: AxiosRequestConfig["method"];
//     data?: unknown;
//     params?: unknown;
//   },
//   unknown,
//   unknown
// > =>
//   async ({ url, method = "GET", data, params }) => {
//     try {
//       const result = await axiosInstance({
//         url,
//         method,
//         data,
//         params,
//       });
//       return { data: result.data };
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       return {
//         error: {
//           status: axiosError.response?.status,
//           data: axiosError.response?.data,
//         },
//       };
//     }
//   };

// export default axiosInstance;
// ```

// ---

// ## شرح الـ interceptors

// **Request interceptor:**
// ```
// أنا → request → interceptor يحط التوكن → السيرفر
// ```

// **Response interceptor:**
// ```
// السيرفر → response → interceptor يشيك على الـ status → أنا
//                       لو 401 → يروح لـ /login