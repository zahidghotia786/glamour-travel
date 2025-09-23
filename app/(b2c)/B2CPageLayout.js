// app/(b2c)/B2CPageLayout.js
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function B2CPageLayout({ children }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </main>
      <Footer />
    </>
  );
}
