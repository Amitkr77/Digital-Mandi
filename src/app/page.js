// src/app/page.tsx   (or .js)
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // optional – ensures fresh render

export default function Home() {

  // No auth logic here – middleware already redirected if needed
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </DashboardLayout>
  );
}