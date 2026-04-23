import DivisionPage from "@/components/dashboard/DivisionPage";
import { ShieldCheck } from "lucide-react";
const QCPage = () => <DivisionPage phase="qc" title="Quality Control" icon={<ShieldCheck className="h-6 w-6 text-primary" />} />;
export default QCPage;
