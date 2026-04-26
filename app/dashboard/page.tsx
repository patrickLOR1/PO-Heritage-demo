import type { Metadata } from "next";
import LeadsDashboard from "@/components/dashboard/LeadsDashboard";
import Navbar from "@/components/marketing/Navbar";

export const metadata: Metadata = {
  title: "Dashboard · PO Heritage",
  description:
    "Pipeline de prospectos en tiempo real. Gestiona y convierte con IA.",
};

export default function DashboardPage() {
  return (
    <>
      <LeadsDashboard />
    </>
  );
}
