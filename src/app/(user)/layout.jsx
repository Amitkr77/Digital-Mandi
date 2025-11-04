import DashboardLayout from "@/components/layout/DashboardLayout";

export default function RootLayout({ children }) {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
