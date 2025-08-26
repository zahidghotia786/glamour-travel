import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function B2CLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </main>
        <Footer />
      </body>
    </html>
  );
}
