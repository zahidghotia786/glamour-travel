// src/app/forgot-password/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success("Password reset email sent if account exists");
      } else {
        toast.error(data.error || "Failed to send reset email");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {emailSent 
              ? "Check your email for reset instructions" 
              : "Enter your email to reset your password"
            }
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-gray-600 mb-6">
              If an account exists with {email} password reset instructions have been sent.
            </p>

            <button
              onClick={() => setEmailSent(false)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}