"use client";
import { DashboardLayout } from "@/layouts/Dashboard";
import { DashboardUserLayout } from "@/layouts/DashboardUser";
import { useUserRoleStore } from "@/store/useUserRoleStore";

export default function Dashboard() {
    const { role } = useUserRoleStore();

      if (role === "ANALISTA") {
        return <DashboardUserLayout />;
      }

      if (role === "ADMINISTRATIVO") {
        return <DashboardLayout />;
      }
}
