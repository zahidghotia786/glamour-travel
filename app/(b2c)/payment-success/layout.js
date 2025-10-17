export const metadata = {
  title: "Payment Status | Glaymour Adventure Tours",
  description: "Check your payment and booking confirmation",
};

export default function PaymentSuccessLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex items-center justify-center">
        <main className="w-full max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}