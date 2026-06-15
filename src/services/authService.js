import api from "./api";

export const loginUser = async (email, password) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
};