"use client";
import { useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetchFromAPI("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      });

      if (res?.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      localStorage.setItem("user", JSON.stringify(res.user));

        // ✅ Redirect according to role
const role = res.user.role?.toLowerCase();

if (role === "admin") {
  router.push("/admin/dashboard");   // URL matches the intended admin dashboard
} else if (role === "b2b") {
  router.push("/b2b/dashboard");     // B2B dashboard URL
} else {
  router.push("/");                  // Customer homepage
}

      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 p-6"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
          {role === "customer"
            ? "Customer Login"
            : role === "b2b"
            ? "B2B Partner Login"
            : "Admin Login"}
        </h1>

        <p className="text-gray-500 text-center mb-4 text-sm">
          Select your role and login with registered email & password.
        </p>

        {/* Role Selector */}
        <div className="flex justify-center mb-6 space-x-3">
          {["customer", "b2b", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                role === r
                  ? "bg-yellow-400 text-blue-900 shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {r === "customer" ? "Customer" : r.toUpperCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {role === "customer" && (
          <p className="text-center mt-4 text-sm">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-700 hover:underline cursor-pointer"
            >
              Register here
            </Link>
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
