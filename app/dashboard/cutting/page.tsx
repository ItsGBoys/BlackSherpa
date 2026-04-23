import { getJobsByPhase } from "@/app/actions/job-actions";
import { auth } from "@/auth";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Scissors } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CuttingPage() {
  const session = await auth();
  if (!session) redirect("/");
  if (!["SUPER_ADMIN", "ADMIN_PRODUKSI", "PIC_POTONG_GUDANG"].includes(session.user.role || "")) {
    redirect("/dashboard");
  }

  const jobs = await getJobsByPhase("POTONG");
  
  return (
    <DivisionPage 
      phase="POTONG" 
      title="Divisi Potong" 
      icon={<Scissors className="h-6 w-6 text-primary" />} 
      jobs={jobs}
    />
  );
}
