import DoctorNavigation from "../components/DoctorNavigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="DOCTOR">
      <div className="min-h-screen bg-gray-100">
        <DoctorNavigation />
        <div className="p-4 md:ml-64">
          <div className="p-4 mt-14">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}