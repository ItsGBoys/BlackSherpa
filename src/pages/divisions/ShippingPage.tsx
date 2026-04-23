import DivisionPage from "@/components/dashboard/DivisionPage";
import { Truck } from "lucide-react";
const ShippingPage = () => <DivisionPage phase="pengiriman" title="Pengiriman" icon={<Truck className="h-6 w-6 text-primary" />} />;
export default ShippingPage;
