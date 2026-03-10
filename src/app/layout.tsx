import type { Metadata } from "next";

import { AuthProvider } from "@/context/provider";
import { Toaster } from "sonner";
import "./styles/globals.css";

import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "IMAC",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
