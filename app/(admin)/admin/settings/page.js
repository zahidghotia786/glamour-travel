"use client";

import { useState, useEffect } from "react";
import {
  Save,
  User,
  RefreshCw,
  Settings,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { userApi } from "@/lib/api"; 
import Loader from "@/components/common/Loader";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPosition: "",

  });

  useEffect(() => {
    setMounted(true);
    // Simulate loading data
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Load both admin profile and settings
        const [adminProfile, adminSettings] = await Promise.all([
          userApi.getAdminProfile(),
          userApi.getAdminSettings(),
        ]);

        setSettings((prev) => ({
          ...prev,
          adminName:
            `${adminProfile.firstName} ${adminProfile.lastName}`.trim(),
          adminEmail: adminProfile.email,
          adminPhone: adminProfile.phoneNumber,
          adminPosition: adminProfile.role,
        }));
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
        // Update admin profile
        await userApi.updateAdminProfile({
          adminName: settings.adminName,
          adminEmail: settings.adminEmail,
          adminPhone: settings.adminPhone,
          adminPosition: settings.adminPosition,
          metadata: {
            position: settings.adminPosition,
          },
        });
        toast.success("Profile updated successfully!");

      const button = document.querySelector(".save-button");
      button?.classList.add("animate-pulse");
      setTimeout(() => button?.classList.remove("animate-pulse"), 1000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <div
        className={`relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 transition-all duration-1000 ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Admin Settings
                </h1>
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-gray-600 text-lg">
                Manage your profile 
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div
          className={`flex flex-col sm:flex-row bg-white/80 backdrop-blur-lg rounded-2xl p-2 mb-8 shadow-lg border border-white/20 transition-all duration-700 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <button
            className={`flex-1 px-6 py-4 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Admin Profile</span>
            <CheckCircle className="w-4 h-4" />
          </button>

        </div>

          <div
            className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 transition-all duration-700 hover:shadow-2xl ${
              mounted
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                Admin Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full group-focus-within:animate-pulse"></div>
                  Full Name
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={settings.adminName}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-lg"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full group-focus-within:animate-pulse"></div>
                  Email Address
                </label>
                <input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-lg"
                  placeholder="admin@company.com"
                />
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full group-focus-within:animate-pulse"></div>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="adminPhone"
                  value={settings.adminPhone}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-lg"
                  placeholder="+971501234567"
                />
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full group-focus-within:animate-pulse"></div>
                  Position/Role
                </label>
                <input
                  type="text"
                  name="adminPosition"
                  value={settings.adminPosition}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-lg"
                  placeholder="Administrator"
                />
              </div>

            </div>

            <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="save-button group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Saving Magic...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span className="font-medium">Save Changes</span>
                  </>
                )}
              </div>
            </button>
            </div>

            

          </div>

      </div>
    </div>
  );
}
