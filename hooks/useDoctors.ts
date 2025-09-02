import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const useDoctors = (search: string, specialization: string) => {
  return useQuery({
    queryKey: ["doctors", search, specialization],
    queryFn: async () => {
      const res = await api.get("/doctors", {
        params: { search, specialization, page: 1, limit: 20 },
      });
      return res.data.data;
    },
  });
};
