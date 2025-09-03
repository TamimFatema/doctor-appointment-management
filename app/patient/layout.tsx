import PatientNavigation from "../components/PatientNavigation";
import ProtectedRoute from "../components/ProtectedRoute";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="PATIENT">
      <div className="min-h-screen bg-gray-100">
        <PatientNavigation />
        <div className="p-4 md:ml-64">
          <div className="p-4 mt-14">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}