import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const usePatientAppointments = (userId: string) => {
  return useQuery({
    queryKey: ["appointments", userId],
    queryFn: async () => {
      const res = await api.get("/appointments/patient", { params: { page: 1 } });
      return res.data.data;
    },
  });
};
