"use client";

import { useState, useMemo } from "react";
import { DoctorCard } from "./DoctorCard";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url?: string | null;
}

interface DoctorListProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
  itemsPerPage?: number;
}

export const DoctorList = ({
  doctors,
  onBook,
  itemsPerPage = 6,
}: DoctorListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpec, setFilterSpec] = useState("ALL");

  // Get unique specializations
  const specializations = useMemo(() => {
    const specs = Array.from(new Set(doctors.map((d) => d.specialization)));
    return ["ALL", ...specs];
  }, [doctors]);

  // Filter + search
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSpec =
        filterSpec === "ALL" || doctor.specialization === filterSpec;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, searchQuery, filterSpec]);

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="w-full space-y-6">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400 w-5 h-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </span>
          </div>
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-xl transition-all duration-200 bg-white"
          />
        </div>

        <div className="relative md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400 w-5 h-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4a2 2 0 012-2h14a2 2 0 012 2v4M12 3v12m-4-4h8"
                />
              </svg>
            </span>
          </div>
          <select
            value={filterSpec}
            onChange={(e) => {
              setFilterSpec(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-10 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200 bg-white"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        {(searchQuery || filterSpec !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterSpec("ALL");
              setCurrentPage(1);
            }}
            className="ml-3 text-blue-600 hover:text-blue-700 underline text-xs"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {currentDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-blue-100">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <span className="text-2xl text-blue-500">👨‍⚕️</span>
          </div>
          <p className="text-slate-600 font-medium">No doctors found</p>
          <p className="text-slate-400 text-sm mt-1">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all duration-200 flex items-center"
          >
            <span className="mr-1">←</span> Previous
          </button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrent = currentPage === page;
              const showEllipsis = totalPages > 7 &&
                (page > currentPage + 1 || page < currentPage - 1) &&
                page !== 1 && page !== totalPages;

              if (showEllipsis && (page === currentPage + 2 || page === currentPage - 2)) {
                return <span key={page} className="px-3 py-2 text-slate-400">...</span>;
              }

              if (showEllipsis) return null;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl transition-all duration-200 ${isCurrent
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-all duration-200 flex items-center"
          >
            Next <span className="ml-1">→</span>
          </button>
        </div>
      )}
    </div>
  );
};