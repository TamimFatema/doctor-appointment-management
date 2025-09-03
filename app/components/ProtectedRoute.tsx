"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: "PATIENT" | "DOCTOR" 
}) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      router.push(user.role === "PATIENT" ? "/patient/dashboard" : "/doctor/dashboard");
      return;
    }

    setIsChecking(false);
  }, [user, token, requiredRole, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}