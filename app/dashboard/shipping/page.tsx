import { getJobsByPhase } from "@/app/actions/job-actions";
import { auth } from "@/auth";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Truck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ShippingPage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_PENGIRIMAN"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const jobs = await getJobsByPhase("PACKING");
  
  return (
    <DivisionPage 
      phase="PACKING" 
      title="Divisi Pengiriman" 
      icon={<Truck className="h-6 w-6 text-primary" />} 
      jobs={jobs}
    />
  );
}
