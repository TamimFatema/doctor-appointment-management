"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

enum Role {
    PATIENT = "PATIENT",
    DOCTOR = "DOCTOR",
}

const patientSchema = z.object({
    role: z.literal(Role.PATIENT),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    photo_url: z.string().url().optional().or(z.literal("")),
});

const doctorSchema = z.object({
    role: z.literal(Role.DOCTOR),
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    specialization: z.string().min(2, "Specialization is required"),
    photo_url: z.string().url().optional().or(z.literal("")),
});

const registerSchema = z.discriminatedUnion("role", [
    patientSchema,
    doctorSchema,
]);

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: Role.PATIENT },
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true);
            setErrorMessage("");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
                data
            );

            alert("Registration successful!");
            router.push("/login");
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full h-screen flex flex-col items-center justify-center px-4 bg-white">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-gray-600">
                <h3 className="text-gray-800 text-2xl font-bold mb-6 text-center">
                    Create an Account
                </h3>

                {/* Role Tabs */}
                <div className="flex mb-6 border-b">
                    <button
                        type="button"
                        className={`w-1/2 py-2 font-medium ${selectedRole === Role.PATIENT
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-500"
                            }`}
                        onClick={() => setSelectedRole(Role.PATIENT)}
                    >
                        Patient
                    </button>
                    <button
                        type="button"
                        className={`w-1/2 py-2 font-medium ${selectedRole === Role.DOCTOR
                                ? "border-b-2 border-indigo-600 text-indigo-600"
                                : "text-gray-500"
                            }`}
                        onClick={() => setSelectedRole(Role.DOCTOR)}
                    >
                        Doctor
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <input type="hidden" value={selectedRole} {...register("role")} />

                    <div>
                        <label className="font-medium">Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="font-medium">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Extra field for Doctor */}
                    {selectedRole === Role.DOCTOR && (
                        <div>
                            <label className="font-medium">Specialization</label>
                            <select
                                {...register("specialization")}
                                className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                            >
                                <option value="">Select specialization</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="General Physician">General Physician</option>
                            </select>
                            {errors.specialization && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.specialization.message}
                                </p>
                            )}
                        </div>
                    )}


                    <div>
                        <label className="font-medium">Photo URL (optional)</label>
                        <input
                            type="url"
                            {...register("photo_url")}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full mt-2 px-3 py-2 border rounded-lg outline-none focus:border-indigo-600"
                        />
                        {errors.photo_url && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.photo_url.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg duration-150"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    {errorMessage && (
                        <p className="text-red-500 text-center mt-2">{errorMessage}</p>
                    )}
                </form>

                <p className="text-center mt-6">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Login
                    </a>
                </p>
            </div>
        </main>
    );
}
