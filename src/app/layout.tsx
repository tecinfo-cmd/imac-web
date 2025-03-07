import type { Metadata } from "next";

import "./styles/globals.css";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import HeroSection from "@/app/components/ui/heroSection";

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
      <body className="bg-gray-100 text-gray-900">
        <Header />
        <HeroSection topImage={""} title={""} text={""} />
        <main className="container mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
