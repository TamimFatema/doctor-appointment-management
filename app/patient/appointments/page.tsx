// app/patient/appointments/page.tsx
"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { usePatientAppointments } from "../../../hooks/useAppointments";
import { api } from "../../../utils/api";
import { AppointmentCard } from "../../components/AppointmentCard";

interface Appointment {
  id: string;
  doctor: {
    id: string;
    name: string;
    specialization: string;
    photo_url?: string;
  };
  date: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

export default function PatientAppointments() {
  const user = useAuthStore((state) => state.user);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: appointmentsData, refetch } = usePatientAppointments(
    user?.id || "",
    statusFilter === "ALL" ? undefined : statusFilter,
    currentPage
  );

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.patch("/appointments/update-status", {
        appointment_id: appointmentId,
        status: "CANCELLED",
      });
      refetch();
      alert("Appointment cancelled successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {/* Status Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <label className="block text-gray-700 mb-2">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/3 border px-3 py-2 rounded"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointmentsData?.appointments?.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        ) : (
          appointmentsData?.appointments?.map((appointment: Appointment) => (
            <div key={appointment.id} className="bg-white p-4 rounded-lg shadow-md">
              <AppointmentCard appointment={appointment} />
              
              {appointment.status === "PENDING" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {appointmentsData?.totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: appointmentsData.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, appointmentsData.totalPages))}
            disabled={currentPage === appointmentsData.totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}