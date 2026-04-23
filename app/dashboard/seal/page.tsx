import { getJobsByPhase } from "@/app/actions/job-actions";
import { auth } from "@/auth";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Stamp } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SealPage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_SEAL"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const jobs = await getJobsByPhase("SEAL");
  
  return (
    <DivisionPage 
      phase="SEAL" 
      title="Divisi Seal & Finishing" 
      icon={<Stamp className="h-6 w-6 text-primary" />} 
      jobs={jobs}
    />
  );
}
