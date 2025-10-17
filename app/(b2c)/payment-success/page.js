"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");

  // ✅ Extract bookingId inside useEffect to avoid build-time issues
  useEffect(() => {
    const id = searchParams.get("bookingId");
    setBookingId(id);
  }, [searchParams]);

  const verifyPayment = async () => {
    if (!bookingId) {
      setStatus("error");
      setMessage("Invalid payment confirmation URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) throw new Error("User not authenticated");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/verify-payment/${bookingId}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to verify payment");
      const data = await res.json();

      if (data.success && data.transaction.status === "PAID") {
        setStatus("success");
        setMessage("🎉 Payment successful! Your booking is confirmed.");
        setTimeout(() => router.push(`/booking/${bookingId}`), 3000);
      } else {
        setStatus("pending");
        setMessage("🕓 Payment received but still processing...");
      }
    } catch (err) {
      console.error("❌ Payment verification error:", err);
      setStatus("error");
      setMessage("❌ Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run verification once bookingId is available
  useEffect(() => {
    if (bookingId) {
      verifyPayment();
    } else {
      setLoading(false);
      setStatus("error");
      setMessage("Invalid payment confirmation URL.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4 p-4">
      {loading && <p className="text-lg">Verifying payment...</p>}

      {!loading && status === "success" && (
        <div>
          <h1 className="text-2xl font-bold text-green-600">
            Payment Successful ✅
          </h1>
          <p>{message}</p>
        </div>
      )}

      {!loading && status === "pending" && (
        <div>
          <h1 className="text-2xl font-bold text-yellow-500">
            Payment Pending ⏳
          </h1>
          <p>{message}</p>
          <button
            onClick={verifyPayment}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            🔄 Refresh Status
          </button>
        </div>
      )}

      {!loading && status === "error" && (
        <div>
          <h1 className="text-2xl font-bold text-red-600">Payment Error ❌</h1>
          <p>{message}</p>
          <button
            onClick={verifyPayment}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}
