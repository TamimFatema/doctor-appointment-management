"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientRegisterSchema,
  doctorRegisterSchema,
  PatientRegisterForm,
  DoctorRegisterForm,
} from "../../../schemas/registerSchema";
import { usePatientRegister, useDoctorRegister } from "../../../hooks/useRegister";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const patientMutation = usePatientRegister();
  const doctorMutation = useDoctorRegister();

  const {
    register: patientRegister,
    handleSubmit: handlePatientSubmit,
    formState: { errors: patientErrors },
  } = useForm<PatientRegisterForm>({
    resolver: zodResolver(patientRegisterSchema),
  });

  const {
    register: doctorRegister,
    handleSubmit: handleDoctorSubmit,
    formState: { errors: doctorErrors },
  } = useForm<DoctorRegisterForm>({
    resolver: zodResolver(doctorRegisterSchema),
  });

  const onPatientSubmit = (data: PatientRegisterForm) => {
    patientMutation.mutate(data, {
      onSuccess: (res) => alert(res.message),
      onError: (err: any) => alert(err.response?.data?.message || "Registration failed"),
    });
  };

  const onDoctorSubmit = (data: DoctorRegisterForm) => {
    doctorMutation.mutate(data, {
      onSuccess: (res) => alert(res.message),
      onError: (err: any) => alert(err.response?.data?.message || "Registration failed"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("PATIENT")}
            className={`flex-1 py-2 ${
              activeTab === "PATIENT" ? "border-b-2 border-blue-600 font-bold" : "text-gray-500"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setActiveTab("DOCTOR")}
            className={`flex-1 py-2 ${
              activeTab === "DOCTOR" ? "border-b-2 border-blue-600 font-bold" : "text-gray-500"
            }`}
          >
            Doctor
          </button>
        </div>

        {/* Patient Form */}
        {activeTab === "PATIENT" && (
          <form onSubmit={handlePatientSubmit(onPatientSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              {...patientRegister("name")}
              className="w-full border px-3 py-2 rounded"
            />
            {patientErrors.name && <p className="text-red-500 text-sm">{patientErrors.name.message}</p>}

            <input
              type="email"
              placeholder="Email"
              {...patientRegister("email")}
              className="w-full border px-3 py-2 rounded"
            />
            {patientErrors.email && <p className="text-red-500 text-sm">{patientErrors.email.message}</p>}

            <input
              type="password"
              placeholder="Password"
              {...patientRegister("password")}
              className="w-full border px-3 py-2 rounded"
            />
            {patientErrors.password && <p className="text-red-500 text-sm">{patientErrors.password.message}</p>}

            <input
              type="text"
              placeholder="Photo URL (optional)"
              {...patientRegister("photo_url")}
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              disabled={patientMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {patientMutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {/* Doctor Form */}
        {activeTab === "DOCTOR" && (
          <form onSubmit={handleDoctorSubmit(onDoctorSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              {...doctorRegister("name")}
              className="w-full border px-3 py-2 rounded"
            />
            {doctorErrors.name && <p className="text-red-500 text-sm">{doctorErrors.name.message}</p>}

            <input
              type="email"
              placeholder="Email"
              {...doctorRegister("email")}
              className="w-full border px-3 py-2 rounded"
            />
            {doctorErrors.email && <p className="text-red-500 text-sm">{doctorErrors.email.message}</p>}

            <input
              type="password"
              placeholder="Password"
              {...doctorRegister("password")}
              className="w-full border px-3 py-2 rounded"
            />
            {doctorErrors.password && <p className="text-red-500 text-sm">{doctorErrors.password.message}</p>}

            <input
              type="text"
              placeholder="Specialization"
              {...doctorRegister("specialization")}
              className="w-full border px-3 py-2 rounded"
            />
            {doctorErrors.specialization && (
              <p className="text-red-500 text-sm">{doctorErrors.specialization.message}</p>
            )}

            <input
              type="text"
              placeholder="Photo URL (optional)"
              {...doctorRegister("photo_url")}
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              disabled={doctorMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {doctorMutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
