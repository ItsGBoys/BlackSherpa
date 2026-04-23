import DivisionPage from "@/components/dashboard/DivisionPage";
import { Factory } from "lucide-react";
const ProductionPage = () => <DivisionPage phase="produksi" title="Divisi Produksi" icon={<Factory className="h-6 w-6 text-primary" />} />;
export default ProductionPage;
