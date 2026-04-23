import { getJobsByPhase } from "@/app/actions/job-actions";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Factory } from "lucide-react";

export default async function ProductionPage() {
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
