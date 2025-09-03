"use client";

import Link from "next/link";
import { useState } from "react";
import { usePatientAppointments } from "../../../hooks/useAppointments";
import { useDoctors } from "../../../hooks/useDoctors";
import { useSpecializations } from "../../../hooks/useSpecializations";
import { useAuthStore } from "../../../store/useAuthStore";
import { BookAppointmentModal } from "../../components/BookAppointmentModal";
import { DoctorList } from "../../components/DoctorList";

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("ALL");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: doctorsData = [], refetch: refetchDoctors } = useDoctors(
    search,
    specialization === "ALL" ? "" : specialization
  );

  const { data: specializationsData = [] } = useSpecializations();

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments,
  } = usePatientAppointments(
    statusFilter,
    currentPage,
    true
  );
  const upcomingAppointments = appointmentsData?.data ?? [];
  const handleBookClick = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    refetchAppointments(); // Refresh appointments after booking
    refetchDoctors(); // Optional refresh doctors list
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-600 mt-2">How are you feeling today?</p>
          </div>
          <Link
            href="/patient/appointments"
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            View All Appointments
          </Link>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Upcoming Appointments
              </h2>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-500 w-6 h-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {appointmentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading appointments...</p>
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="border border-blue-50 rounded-xl p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">
                          Dr. {appointment.doctor.name}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {appointment.doctor.specialization}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          {new Date(appointment.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : appointment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No upcoming appointments</p>
                <p className="text-sm text-slate-400 mt-1">
                  Book your first appointment today
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Search Card */}


          {/* Doctors List */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Doctors
              </h2>
      
            </div>

            <DoctorList
              doctors={doctorsData}
              onBook={handleBookClick}
              itemsPerPage={6}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookAppointmentModal
          doctor={selectedDoctor}
          onClose={handleCloseModal}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
