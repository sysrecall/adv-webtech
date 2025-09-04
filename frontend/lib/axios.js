import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // NestJS base URL
  withCredentials: true, // allow cookies (important for JWT cookies)
});

export default api;
