"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function PatientNavigation() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/patient/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7v6h6v-6z"
          />
        </svg>
      ),
    },
    {
      name: "Appointments",
      href: "/patient/appointments",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];


  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="/patient/dashboard" className="flex ml-2 md:mr-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-blue-600">
                  Patient Portal
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user?.name?.charAt(0)}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-0"
          } bg-white border-r border-gray-200 md:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
          <div className="pt-4 pb-2 px-2">
            <div className="flex items-center space-x-3 px-2 py-3 rounded-lg bg-blue-50">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="font-medium text-blue-900">
                <div>{user?.name}</div>
                <div className="text-xs text-blue-700">Patient</div>
              </div>
            </div>
          </div>
          <ul className="space-y-2 font-medium mt-4">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg hover:bg-gray-100 group ${isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900"
                    }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}