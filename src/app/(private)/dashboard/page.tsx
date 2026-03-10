"use client";

import { DashboardUserLayout } from "@/layouts/DashboardUser";
import { ElegibilityAbattoirLayout } from "@/layouts/ElegibilityAbattoir";
import { FarmLayout } from "@/layouts/Farm";
import { DashboardAdmin } from "@/layouts/Maneger/DashboardAdmin";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";

export default function Dashboard() {
  const { role } = useUserRoleStore();
  const userData = useAuthStore((s) => s.userData);
  const cargo = userData?.cargo;
  if (role === "PRODUTOR") {
    return <FarmLayout />;
  }

  if (role === "ANALISTA" || role === "ANALISTA") {
    return <DashboardUserLayout />;
  }

  if (cargo === "FRIGORIFICO" || role === "FRIGORIFICO") {
    return <ElegibilityAbattoirLayout />;
  }
  if (cargo === "ADMINISTRATIVO" || role === "ADMINISTRATIVO") {
    return <DashboardAdmin />;
  }
}
