"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email"); // Optional: Get email from URL if provided

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    if (token) {
      // Basic token validation
      if (token.length < 10) {
        setStatus("error");
        setMessage("Invalid token format.");
        toast.error("Invalid token format.");
        return;
      }
      verifyEmailToken(token);
    } else {
      setStatus("error");
      setMessage("Invalid verification link. No token found.");
      toast.error("Invalid verification link.");
    }
  }, [token]);

  const verifyEmailToken = async (token) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/email/verify-email?token=${encodeURIComponent(token)}`,
        {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email verified successfully! You can now login.");
        toast.success("Email verified successfully!");
        
        setTimeout(() => {
          router.push("/login");
        }, 3000);
        
      } else {
        setStatus("error");
        setMessage(data.error || "Email verification failed.");
        toast.error(data.error || "Email verification failed.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      
      if (error.name === 'AbortError') {
        setStatus("error");
        setMessage("Request timeout. Please try again.");
        toast.error("Request timeout. Please try again.");
      } else {
        setStatus("error");
        setMessage("Network error. Please try again.");
        toast.error("Network error. Please try again.");
      }
    }
  };

  const handleResendClick = () => {
    setShowEmailInput(true);
  };

  const handleResendVerification = async () => {
    if (!emailInput.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setResendLoading(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/email/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailInput.trim() }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Verification email sent! Please check your inbox.");
        setShowEmailInput(false);
        setEmailInput("");
      } else {
        toast.error(data.error || "Failed to send verification email.");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const cancelResend = () => {
    setShowEmailInput(false);
    setEmailInput("");
  };

  if (!token && status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

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
            <div className="space-y-3">
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block w-full"
              >
                Go to Login
              </Link>
              <p className="text-sm text-gray-500">Redirecting in 3 seconds...</p>
            </div>
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

              {/* Email Input Section with Animation */}
              <AnimatePresence>
                {showEmailInput ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex space-x-2"
                      >
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Enter your email address"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          autoFocus
                        />
                        <button
                          onClick={handleResendVerification}
                          disabled={resendLoading}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
                        >
                          {resendLoading ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Sending
                            </div>
                          ) : (
                            "Send"
                          )}
                        </button>
                      </motion.div>
                      
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={cancelResend}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-300"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleResendClick}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 w-full"
                  >
                    Request New Verification Email
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Optional help link */}
              <Link
                href="/resend-verification"
                className="text-blue-600 hover:text-blue-800 text-sm inline-block mt-2"
              >
                Need help? Visit resend verification page
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}