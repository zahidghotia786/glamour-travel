import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function B2CLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
