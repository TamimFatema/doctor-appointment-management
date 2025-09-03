"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";

export default function Navigation() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={user?.role === "PATIENT" ? "/patient/dashboard" : "/doctor/dashboard"} className="text-xl font-bold text-blue-600">
          Doctor Appointment System
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}