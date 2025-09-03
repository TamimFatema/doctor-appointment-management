interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    specialization: string;
    photo_url?: string | null;
  };
  onBook: (doctor: any) => void;
}

export const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => (
  <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
    {/* Doctor Photo */}
    <div className="flex justify-center mb-5">
      <div className="relative">
        <img
          src={
            doctor.photo_url ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
          }
          alt={doctor.name}
          className="w-20 h-20 object-cover rounded-full border-4 border-blue-50 shadow-sm"
        />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">👨‍⚕️</span>
        </div>
      </div>
    </div>

    {/* Doctor Info */}
    <div className="text-center mb-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        Dr. {doctor.name}
      </h3>
      <p className="text-sm text-slate-600 bg-blue-50 rounded-full px-3 py-1 inline-block">
        {doctor.specialization}
      </p>
    </div>

    {/* Rating and Experience (placeholder) */}
    <div className="flex justify-center items-center gap-4 mb-5 text-xs text-slate-500">
      <div className="flex items-center">
        <svg
          className="w-4 h-4 text-amber-400 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.957a1 1 0 00-.364-1.118L2.075 9.384c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.951-.69l1.285-3.957z" />
        </svg>
        <span>4.8 (126 reviews)</span>
      </div>
      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
      <div>12 years experience</div>
    </div>


    {/* Book Button */}
    <button
      onClick={() => onBook(doctor)}
      className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      Book Appointment
    </button>

    {/* Availability Indicator (placeholder) */}
    <div className="flex items-center justify-center mt-4 text-xs text-slate-500">
      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
      Available today
    </div>
  </div>
);