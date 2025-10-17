import "../globals.css";
import { Toaster } from "react-hot-toast";

export default function B2CLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
          <Toaster position="top-right" reverseOrder={false}             
          toastOptions={{
              duration: 4000, // ⏱ Auto close after 4 seconds
            }}/>
        </main>
      </body>
    </html>
  );
}
