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
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const handleSuccess = () => setShowSuccessModal(true);

  const onPatientSubmit = (data: PatientRegisterForm) => {
    patientMutation.mutate(data, {
      onSuccess: () => handleSuccess(),
      onError: (err: any) =>
        alert(err.response?.data?.message || "Registration failed"),
    });
  };

  const onDoctorSubmit = (data: DoctorRegisterForm) => {
    doctorMutation.mutate(data, {
      onSuccess: () => handleSuccess(),
      onError: (err: any) =>
        alert(err.response?.data?.message || "Registration failed"),
    });
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left: Form */}
      <div className="md:w-5/12 flex items-center justify-center p-8 bg-white text-gray-600">
        <div className="w-full max-w-md">
          <h1 className="text-2xl xl:text-3xl font-extrabold text-center mb-6">
            Register
          </h1>

          {/* Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab("PATIENT")}
              className={`flex-1 py-2 ${activeTab === "PATIENT"
                ? "border-b-2 border-blue-600 font-bold"
                : "text-gray-500"
                }`}
            >
              Patient
            </button>
            <button
              onClick={() => setActiveTab("DOCTOR")}
              className={`flex-1 py-2 ${activeTab === "DOCTOR"
                ? "border-b-2 border-blue-600 font-bold"
                : "text-gray-500"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {patientErrors.name && (
                <p className="text-red-500 text-sm">{patientErrors.name.message}</p>
              )}

              <input
                type="email"
                placeholder="Email"
                {...patientRegister("email")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {patientErrors.email && (
                <p className="text-red-500 text-sm">{patientErrors.email.message}</p>
              )}

              <input
                type="password"
                placeholder="Password"
                {...patientRegister("password")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {patientErrors.password && (
                <p className="text-red-500 text-sm">{patientErrors.password.message}</p>
              )}

              <input
                type="text"
                placeholder="Photo URL (optional)"
                {...patientRegister("photo_url")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={patientMutation.isPending}
                  className="tracking-wide font-semibold bg-indigo-500 text-white w-1/2 py-3 rounded-2xl hover:bg-indigo-600 transition flex items-center justify-center"
                >
                  {patientMutation.isPending ? "Registering..." : "Sign Up"}
                </button>
              </div>
            </form>
          )}

          {/* Doctor Form */}
          {activeTab === "DOCTOR" && (
            <form onSubmit={handleDoctorSubmit(onDoctorSubmit)} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                {...doctorRegister("name")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {doctorErrors.name && (
                <p className="text-red-500 text-sm">{doctorErrors.name.message}</p>
              )}

              <input
                type="email"
                placeholder="Email"
                {...doctorRegister("email")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {doctorErrors.email && (
                <p className="text-red-500 text-sm">{doctorErrors.email.message}</p>
              )}

              <input
                type="password"
                placeholder="Password"
                {...doctorRegister("password")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {doctorErrors.password && (
                <p className="text-red-500 text-sm">{doctorErrors.password.message}</p>
              )}

              <input
                type="text"
                placeholder="Specialization"
                {...doctorRegister("specialization")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              {doctorErrors.specialization && (
                <p className="text-red-500 text-sm">{doctorErrors.specialization.message}</p>
              )}

              <input
                type="text"
                placeholder="Photo URL (optional)"
                {...doctorRegister("photo_url")}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={doctorMutation.isPending}
                  className="w-1/2 tracking-wide font-semibold bg-indigo-500 text-white py-3 rounded-2xl hover:bg-indigo-600 transition flex items-center justify-center"
                >
                  {doctorMutation.isPending ? "Registering..." : "Sign Up"}
                </button>
              </div>
              <p className="text-center">Already Registered?
                <Link
                  href="/auth/login"
                  className="text-blue-500 underline font-bold"
                >
                   Login
                </Link>
              </p>
            </form>

          )}
        </div>
      </div>

      {/* Right: Image */}
      <div className="w-7/12 relative hidden md:block">
        <Image
          src="/registration.jpg"
          alt="Doctor with patient"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Registration Successful!
            </h3>
            <p className="text-slate-600 mb-6">You can now login to your account.</p>
            <Link
              href="/auth/login"
              className="bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition"
              onClick={() => setShowSuccessModal(false)}
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
