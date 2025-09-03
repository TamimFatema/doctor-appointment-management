// app/(authenticated)/layout.tsx

import Navigation from "../components/Navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}