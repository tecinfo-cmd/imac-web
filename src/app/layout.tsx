import type { Metadata } from "next";

import "./styles/globals.css";
import { AuthProvider } from "@/context/provider";

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
        </QueryProvider>
      </body>
    </html>
  );
}
