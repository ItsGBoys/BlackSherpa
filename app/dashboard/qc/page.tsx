import { getJobsByPhase } from "@/app/actions/job-actions";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { ShieldCheck } from "lucide-react";

export default async function QCPage() {
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
