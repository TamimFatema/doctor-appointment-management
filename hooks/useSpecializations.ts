import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api";

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: async () => {
      const res = await api.get("/specializations");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};