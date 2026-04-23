import DivisionPage from "@/components/dashboard/DivisionPage";
import { Scissors } from "lucide-react";
const CuttingPage = () => <DivisionPage phase="potong" title="Divisi Potong" icon={<Scissors className="h-6 w-6 text-primary" />} />;
export default CuttingPage;
