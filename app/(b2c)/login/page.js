"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Globe, ArrowRight, Key } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");


  const handleLogin = async () => {
  setLoading(true);
  setError("");

  try {
    const response = await fetchFromAPI("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    console.log("API Response:", response); // Debugging ke liye

    // Check if response exists
    if (!response) {
      throw new Error("No response received from server");
    }

    // Handle successful login
    if (response.success) {
      // Save to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Show success message
      toast.success(response.message || "Login successful!");

      // Redirect based on role
      const role = response.role?.toLowerCase();
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "b2b") {
        router.push("/b2b/dashboard");
      } else {
        router.push("/");
      }
      return;
    }

    // Handle specific error cases
    if (response.needsVerification) {
      // Unverified email case
      setError(response.error || "Please verify your email first");
      toast.error(response.error || "Please check your email for verification link");
      return;
    }

    // Handle other API errors
    if (response.error) {
      setError(response.error);
      toast.error(response.error);
      return;
    }

    // Fallback for unexpected response format
    throw new Error("Unexpected response format from server");

  } catch (err) {
    console.error("Login error:", err);
    
    // Extract actual error message from different error formats
    let errorMessage = "Login failed. Please try again.";
    
    if (err.message) {
      errorMessage = err.message;
    }
    
    // Handle fetchFromAPI specific errors
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.error) {
      errorMessage = err.error;
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    
    // Show user-friendly messages
    const errorMap = {
      "Invalid email or password": "Invalid email or password",
      "verify your email": "Please verify your email first. Check your inbox.",
      "Account has been deactivated": "Your account has been deactivated. Contact support.",
      "Network Error": "Network connection failed. Please check your internet.",
      "Request failed": "Server is not responding. Please try again later."
    };
    
    // Find matching error message
    const finalErrorMessage = Object.keys(errorMap).find(key => 
      errorMessage.includes(key)
    ) ? errorMap[Object.keys(errorMap).find(key => errorMessage.includes(key))] : errorMessage;
    
    setError(finalErrorMessage);
    toast.error(finalErrorMessage);
  } finally {
    setLoading(false);
  }
};

  const handlePasswordReset = async () => {
    setResetLoading(true);
    setResetMessage("");

    try {
      // Call your password reset API here
      const res = await fetchFromAPI("auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail }),
      });

      setResetMessage("Password reset link has been sent to your email!");
      setResetEmail("");
      
      // Auto switch back to login after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage("");
      }, 3000);
      
    } catch (err) {
      setResetMessage("Error sending reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showForgotPassword) {
        handlePasswordReset();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto relative z-10"
      >
        {/* Logo/Brand Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4 shadow-2xl">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Welcome to Glamour Tours
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4"></div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Discover the magic of UAE with exclusive access to world class theme parks and luxury experiences.
          </motion.p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20"
        >
          {!showForgotPassword ? (
            <>
              {/* Login Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In to Your Account</h2>
                <p className="text-gray-600 text-sm">Enter your credentials to access exclusive deals and experiences</p>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      required
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      required
                      className="w-full px-4 py-3 pl-10 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Sign In
                    </>
                  )}
                </motion.button>

                {/* Forgot Password Link */}
                {/* <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors flex items-center gap-1 mx-auto font-medium"
                  >
                    <Key className="w-4 h-4" />
                    Forgot Password?
                  </button>
                </div> */}
              </div>

              {/* Register Link */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Don not have an account?{" "}
                  <button 
                    onClick={() => router.push("/register")}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>

              {/* Trust indicators */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span className="text-green-500">🔒</span>
                    <span>Secure Login</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-500">✓</span>
                    <span>Instant Access</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-500">🎫</span>
                    <span>Digital Tickets</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>Premium Support</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Forgot Password Form */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
                <p className="text-gray-600 text-sm">Enter your email address and we shall send you a link to reset your password</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      required
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {resetMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-xl p-3 text-sm ${
                      resetMessage.includes("Error")
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}
                  >
                    {resetMessage}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePasswordReset}
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700"
                >
                  {resetLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </motion.button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetMessage("");
                      setResetEmail("");
                    }}
                    className="text-gray-600 hover:text-blue-600 text-sm transition-colors font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}