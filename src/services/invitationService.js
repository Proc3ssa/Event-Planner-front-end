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

export const getEventInvitations = async (event_id) => {
  const { data } = await api.get(`/api/invitations/event/${event_id}`);
  return data.invitations;
};

export const setAttendance = async (id, attendance) => {
  const { data } = await api.patch(`/api/invitations/${id}/attendance`, { attendance });
  return data;
};

export const setTableNumber = async (id, table_number) => {
  const { data } = await api.patch(`/api/invitations/${id}/table`, { table_number });
  return data;
};

export const removeInvitation = async (id) => {
  const { data } = await api.delete(`/api/invitations/${id}`);
  return data;
};