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
  <div className="relative flex flex-col bg-white border border-slate-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full max-w-sm p-4">
    {/* Doctor Photo */}
    <div className="flex justify-center mb-4">
      <img
        src={
          doctor.photo_url ||
          "https://via.placeholder.com/150x150.png?text=Doctor"
        }
        alt={doctor.name}
        className="w-24 h-24 object-cover rounded-full border border-gray-300 shadow-sm"
      />
    </div>

    {/* Doctor Info */}
    <h2 className="text-lg font-semibold text-center text-slate-800">
      {doctor.name}
    </h2>
    <p className="text-sm text-gray-600 text-center mb-4">
      {doctor.specialization}
    </p>

    {/* Book Button */}
    <button
      onClick={() => onBook(doctor)}
      className="w-full rounded-lg bg-blue-600 py-2 px-4 text-sm text-white font-medium shadow-md
                 hover:bg-blue-700 hover:shadow-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 active:bg-blue-800 transition-colors duration-200"
    >
      Book Appointment
    </button>
  </div>
);
