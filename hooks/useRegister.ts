import { useMutation } from "@tanstack/react-query";
import { api } from "../utils/api";
import { PatientRegisterForm, DoctorRegisterForm } from "../schemas/registerSchema";

interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
}

export const usePatientRegister = () =>
  useMutation<RegisterResponse, unknown, PatientRegisterForm>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register/patient", payload);
      return data;
    },
  });

export const useDoctorRegister = () =>
  useMutation<RegisterResponse, unknown, DoctorRegisterForm>({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register/doctor", payload);
      return data;
    },
  });
