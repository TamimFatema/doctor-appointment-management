import { useMutation } from "@tanstack/react-query";
import { api } from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";
import { LoginForm } from "../schemas/loginSchema";

interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    token: string;
    user: any;
  };
}

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: LoginForm) => 
      api.post<LoginResponse>("/auth/login", payload).then((response) => response.data),
    onSuccess: (data) => {
      if (data.success) {
        setAuth(data.data.user, data.data.token);
      }
    },
  });
};