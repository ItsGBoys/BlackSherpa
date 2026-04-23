import { getJobsByPhase } from "@/app/actions/job-actions";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Scissors } from "lucide-react";

export default async function CuttingPage() {
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
