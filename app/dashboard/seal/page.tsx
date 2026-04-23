import { getJobsByPhase } from "@/app/actions/job-actions";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Stamp } from "lucide-react";

export default async function SealPage() {
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
