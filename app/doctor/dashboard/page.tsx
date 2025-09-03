// app/doctor/dashboard/page.tsx
"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDoctorAppointments } from "../../../hooks/useAppointments";
import { api } from "../../../utils/api";

interface Appointment {
  id: string;
  patient: {
    id: string;
    name: string;
    photo_url?: string;
  };
  date: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

export default function DoctorDashboard() {
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: appointmentsData, refetch } = useDoctorAppointments(
    user?.id || "",
    selectedDate,
    statusFilter === "ALL" ? undefined : statusFilter,
    currentPage
  );

  const handleStatusUpdate = async (appointmentId: string, status: "COMPLETED" | "CANCELLED") => {
    if (!confirm(`Are you sure you want to mark this appointment as ${status.toLowerCase()}?`)) {
      return;
    }

    try {
      await api.patch("/appointments/update-status", {
        appointment_id: appointmentId,
        status,
      });
      refetch();
      alert(`Appointment marked as ${status.toLowerCase()} successfully!`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update appointment status");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome, Dr. {user?.name}</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Appointments</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        
        {appointmentsData?.appointments?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointmentsData?.appointments?.map((appointment: Appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={appointment.patient.photo_url || "https://via.placeholder.com/50x50.png?text=Patient"}
                    alt={appointment.patient.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{appointment.patient.name}</p>
                    <p className="text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      appointment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      appointment.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {appointment.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, "COMPLETED")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, "CANCELLED")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
    </div>
  );
}