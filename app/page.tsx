"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 to-purple-500 p-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Doctor Appointment System</h1>
        <p className="text-gray-600 mb-8">
          Book appointments with your favorite doctors easily and manage your schedule.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-600 text-white py-3 rounded-md text-lg font-medium hover:bg-green-700 transition"
          >
            Register
          </Link>
        </div>
      </div>

      <footer className="mt-10 text-gray-200 text-sm">
        &copy; {new Date().getFullYear()} Doctor Appointment System
      </footer>
    </div>
  );
}
