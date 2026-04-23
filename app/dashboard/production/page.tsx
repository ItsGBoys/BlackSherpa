import { getJobsByPhase } from "@/app/actions/job-actions";
import { auth } from "@/auth";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Factory } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProductionPage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_PRODUKSI"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const jobs = await getJobsByPhase("PRODUKSI");
  
  return (
    <DivisionPage 
      phase="PRODUKSI" 
      title="Divisi Produksi" 
      icon={<Factory className="h-6 w-6 text-primary" />} 
      jobs={jobs}
    />
  );
}
