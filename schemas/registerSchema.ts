import { z } from "zod";

export const patientRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  photo_url: z.string().url("Invalid URL").optional().or(z.literal("")), 
});

export const doctorRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  specialization: z.string().min(2, "Specialization is required"),
  photo_url: z.string().url("Invalid URL").optional().or(z.literal("")), 
});

export type PatientRegisterForm = z.infer<typeof patientRegisterSchema>;
export type DoctorRegisterForm = z.infer<typeof doctorRegisterSchema>;
