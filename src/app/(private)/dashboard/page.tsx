"use client";
import { AbattoirLayout } from "@/layouts/Abattoir-Industry";
import { DashboardLayout } from "@/layouts/Dashboard";
import { DashboardUserLayout } from "@/layouts/DashboardUser";
import { useUserRoleStore } from "@/store/useUserRoleStore";

export default function Dashboard() {
  const { role } = useUserRoleStore();

  if (role === "PRODUTOR") {
    return <DashboardLayout />;
  }

  if (role === "ADMINISTRATIVO" || role === "ANALISTA") {
    return <DashboardUserLayout />;
  }

  if (role === "FRIGORIFICO") {
    return <AbattoirLayout />;
  }
}
