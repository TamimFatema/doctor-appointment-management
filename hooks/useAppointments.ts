// hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../utils/api";

// Types
export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    name: string;
    specialization: string;
    photo_url?: string;
  };
  patient: {
    id: string;
    name: string;
    photo_url?: string;
  };
}

export interface AppointmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Appointment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateAppointmentParams {
  doctorId: string;
  date: string; // ISO string format
}

export interface UpdateAppointmentStatusParams {
  appointment_id: string;
  status: "COMPLETED" | "CANCELLED";
}

// Patient Appointments Hook
export const usePatientAppointments = (
  status?: string,
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery<AppointmentsResponse, Error>({
    queryKey: ["appointments", "patient", status, page],
    queryFn: async () => {
      const params: Record<string, any> = { page };

      if (status && status !== "ALL") {
        params.status = status;
      }
      console.log("Making API request with params:", params);
      const res = await api.get("/appointments/patient", { params });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch appointments");
      }

      return res.data as AppointmentsResponse;
    },
    enabled,
    retry: 2,
    staleTime: 1000 * 60 * 5,
  });
};

// Doctor Appointments Hook
export const useDoctorAppointments = (
  date?: string,
  status?: string,
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery<AppointmentsResponse["data"], Error>({
    queryKey: ["appointments", "doctor", date, status, page],
    queryFn: async () => {
      const params: Record<string, any> = { page };
      
      if (date) {
        params.date = date;
      }
      
      if (status && status !== "ALL") {
        params.status = status;
      }

      const res = await api.get("/appointments/doctor", { params });
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch appointments");
      }
      
      return res.data.data;
    },
    enabled,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create Appointment Hook
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentsResponse, Error, CreateAppointmentParams>({
    mutationFn: async (appointmentData) => {
      const response = await api.post("/appointments", appointmentData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create appointment");
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ["appointments", "patient"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["appointments", "doctor"] 
      });
      
      // Also invalidate doctor-related queries if needed
      queryClient.invalidateQueries({ 
        queryKey: ["doctors"] 
      });
    },
    onError: (error) => {
      console.error("Appointment creation failed:", error.message);
    },
  });
};

// Update Appointment Status Hook
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentsResponse, Error, UpdateAppointmentStatusParams>({
    mutationFn: async (updateData) => {
      const response = await api.patch("/appointments/update-status", updateData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update appointment status");
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch appointment queries
      queryClient.invalidateQueries({ 
        queryKey: ["appointments", "patient"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["appointments", "doctor"] 
      });
    },
    onError: (error) => {
      console.error("Appointment status update failed:", error.message);
    },
  });
};

// Cancel Appointment Hook (convenience function)
export const useCancelAppointment = () => {
  const { mutate: updateStatus, ...rest } = useUpdateAppointmentStatus();
  
  const cancelAppointment = (appointmentId: string) => {
    updateStatus({ appointment_id: appointmentId, status: "CANCELLED" });
  };
  
  return { cancelAppointment, ...rest };
};

// Complete Appointment Hook (convenience function)
export const useCompleteAppointment = () => {
  const { mutate: updateStatus, ...rest } = useUpdateAppointmentStatus();
  
  const completeAppointment = (appointmentId: string) => {
    updateStatus({ appointment_id: appointmentId, status: "COMPLETED" });
  };
  
  return { completeAppointment, ...rest };
};