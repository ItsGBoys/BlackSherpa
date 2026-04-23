import { getJobsByPhase } from "@/app/actions/job-actions";
import { auth } from "@/auth";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function QCPage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_QC"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const jobs = await getJobsByPhase("QC");
  
  return (
    <DivisionPage 
      phase="QC" 
      title="Divisi Quality Control" 
      icon={<ShieldCheck className="h-6 w-6 text-primary" />} 
      jobs={jobs}
    />
  );
}
