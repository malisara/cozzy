import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { GlobalContextProvider } from "@/context/GlobalContext";
import "./globals.css";

const dmSans = DM_Sans({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cozzy",
  description: "E-commerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <GlobalContextProvider>
          <Navbar />
          <ToastContainer position="top-right" theme="light" />
          {children}
          <Footer />
        </GlobalContextProvider>
      </body>
    </html>
  );
}
