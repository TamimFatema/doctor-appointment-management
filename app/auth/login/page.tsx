"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginForm } from "../../../schemas/loginSchema";
import { useLogin } from "../../../hooks/useLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const { mutate, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    setErrorMsg("");
    mutate(data, {
      onSuccess: (res) => {
        if (res.success) {
          if (res.data.user.role === "PATIENT") router.push("/patient/dashboard");
          else router.push("/doctor/dashboard");
        }
      },
      onError: (err: any) => {
        setErrorMsg(err.response?.data?.message || "Login failed");
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image (9/12 width) */}
      <div className="relative w-8/12 hidden md:block">
        <Image
          src="/doctor-patient.jpg"
          alt="Doctor with patient"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Right: Form (3/12 width) */}
      <div className="w-full md:w-4/12 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-9 text-center text-gray-800">Welcome Back</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-500">
            {/* Email */}
            <div className="flex items-center border border-gray-400 rounded gap-2 pl-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
                  stroke="#6B7280"
                  strokeOpacity=".6"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
                  stroke="#6B7280"
                  strokeOpacity=".6"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full outline-none py-2.5"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            {/* Password */}
            <div className="flex items-center border border-gray-400 rounded gap-2 pl-2">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#6B7280"
                />
              </svg>
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full outline-none py-2.5"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

            {/* Role */}
            <div className="flex items-center border border-gray-400 rounded gap-2 pl-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 7.5h13.5m-13.5 4.5h13.5m-13.5 4.5h13.5"
                />
              </svg>
              <select
                {...register("role")}
                className="w-full outline-none bg-transparent py-2.5"
              >
                <option value="">Select User type</option>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}


            {/* Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isPending}
                className="w-1/2 mb-3 bg-indigo-500 hover:bg-indigo-600/90 transition py-2.5 rounded-2xl text-white font-medium"
              >
                {isPending ? "Logging in..." : "Log In"}
              </button>
            </div>


            <p className="text-center">
              Don't have an account?{" "}
              <Link href="/auth/registration" className="text-blue-500 underline font-bold">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
