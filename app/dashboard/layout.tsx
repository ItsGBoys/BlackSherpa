import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex fabric-texture bg-background">
      <Sidebar user={session.user} />
      <main className="flex-1 ml-[260px] p-8">
        {children}
      </main>
    </div>
  );
}
