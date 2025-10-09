"use client";

import { DashboardLayout } from "@/layouts/Dashboard";
import { DashboardUserLayout } from "@/layouts/DashboardUser";
import { ElegibilityAbattoirLayout } from "@/layouts/ElegibilityAbattoir";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";

export default function Dashboard() {
  const { role } = useUserRoleStore();
  const userData = useAuthStore((s) => s.userData);
  const cargo = userData?.cargo;
  if (role === "PRODUTOR") {
    return <DashboardLayout />;
  }

  if (role === "ADMINISTRATIVO" || role === "ANALISTA") {
    return <DashboardUserLayout />;
  }

  if (cargo === "FRIGORIFICO" || role === "FRIGORIFICO") {
    return <ElegibilityAbattoirLayout />;
  }
}
