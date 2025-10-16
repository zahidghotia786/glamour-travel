// app/layout.js
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Glamour Adventures Tours | UAE Tourism & Ticket Booking",
  description:
    "Book theme park tickets, tours, and attractions across the UAE with Glamour Adventures Tours. Easy booking, instant confirmation, multilingual support, and secure payments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
