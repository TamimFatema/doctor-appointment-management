import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const usePatientAppointments = (
  userId: string,
  status?: string,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["appointments", "patient", userId, status, page],
    queryFn: async () => {
      const res = await api.get("/appointments/patient", {
        params: { status, page },
      });
      return res.data.data;
    },
    enabled: !!userId,
  });
};

export const useDoctorAppointments = (
  userId: string,
  date?: string,
  status?: string,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["appointments", "doctor", userId, date, status, page],
    queryFn: async () => {
      const res = await api.get("/appointments/doctor", {
        params: { date, status, page },
      });
      return res.data.data;
    },
    enabled: !!userId,
  });
};
