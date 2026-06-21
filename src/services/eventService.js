import api from "./api";

export const getEvents = async () => {
  const { data } = await api.get("/api/events");
  return data.events;
};

export const getEventById = async (id) => {
  const { data } = await api.get(`/api/events/${id}`);
  return data.event;
};

export const deleteEvent = async (id) => {
  const { data } = await api.delete(`/api/events/${id}`);
  return data;
};