import api from "./api";

export const generateInvitationLink = async (payload) => {
  const { data } = await api.post("/api/invitations", payload);
  return data;
};

export const getInvitationByToken = async (token) => {
  const { data } = await api.get(`/api/invitations/${token}`);
  return data.invitation;
};

export const respondToInvitation = async (token, response) => {
  const { data } = await api.patch(`/api/invitations/${token}/respond`, { response });
  return data;
};