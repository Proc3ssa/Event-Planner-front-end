import api from "./api";

export const getUsersByRole = async (role) => {
  const { data } = await api.get(`/api/users/${role}`);
  return data.users;
};

export const updateUserStatus = async (id, status) => {
  const { data } = await api.patch(`/api/users/${id}/status`, { status });
  return data;
};