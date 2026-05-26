import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

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
    <html
      lang="en"
      className={inter.variable}
      style={{ backgroundColor: "#F0EDE8" }}
    >
      <body
        className="flex h-screen overflow-hidden"
        style={{ backgroundColor: "#F0EDE8" }}
      >
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main
            className="flex-1 overflow-y-auto"
            style={{ backgroundColor: "#F0EDE8" }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
