import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dockline — Marine Business Lead Platform",
  description:
    "AI-powered lead capture and SMS engagement for coastal marine businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} style={{ backgroundColor: "#F8F9FA" }}>
      <body className="flex h-screen overflow-hidden bg-[#F8F9FA]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
          {children}
        </main>
      </body>
    </html>
  );
}
