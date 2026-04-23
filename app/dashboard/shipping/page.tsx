import { getJobsByPhase } from "@/app/actions/job-actions";
import DivisionPage from "@/components/dashboard/DivisionPage";
import { Truck } from "lucide-react";

export default async function ShippingPage() {
  const jobs = await getJobsByPhase("SHIPPING");
  
  return (
    <DivisionPage 
      phase="SHIPPING" 
      title="Divisi Pengiriman" 
      icon={<Truck className="h-6 w-6 text-primary" />} 
      jobs={jobs}
    />
  );
}
