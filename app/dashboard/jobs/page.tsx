import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientMotionDiv from "@/components/ClientMotionDiv";
import JobOrderList from "./JobOrderList";
import CreateJobDialog from "./CreateJobDialog";

export default async function JobOrdersPage() {
  const session = await auth();
  if (!session) redirect("/");

  const jobs = await prisma.jobOrder.findMany({
    include: {
      tasks: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const products = await prisma.product.findMany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ClientMotionDiv>
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold">Job Orders</h1>
          </div>
          <p className="text-sm text-muted-foreground">{jobs.length} job order terdaftar dalam sistem</p>
        </ClientMotionDiv>
        <CreateJobDialog products={products}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
            <Plus className="mr-2 h-4 w-4" /> Buat Job Order
          </Button>
        </CreateJobDialog>
      </div>

      <JobOrderList initialJobs={jobs} />
    </div>
  );
}
