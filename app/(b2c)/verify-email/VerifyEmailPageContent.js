"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    } else {
      setStatus("error");
      setMessage("Invalid verification link. No token found.");
    }
  }, [token]);

  const verifyEmailToken = async (token) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/email/verify-email?token=${token}`
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully! You can now login.");
        toast.success("Email verified successfully!");
      } else {
        setStatus("error");
        setMessage(data.error || "Email verification failed.");
        toast.error(data.error || "Email verification failed.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block w-full"
              >
                Go to Login
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 w-full"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
