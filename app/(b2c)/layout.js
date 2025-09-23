import "../globals.css";
import { Toaster } from "react-hot-toast";

export default function B2CLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </main>
      </body>
    </html>
  );
}
