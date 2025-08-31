"use client";

import { useState, useEffect } from "react";
import { Save, Users, User, RefreshCw, Settings, Sparkles, CheckCircle, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { userApi } from "@/lib/api"; // Import your API functions
import Loader from "@/components/common/Loader";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    // Admin Profile Settings
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPosition: "",
    
    // B2B Settings
    defaultB2BDiscount: 15,
    b2bCreditLimit: 50000,
    b2bAutoApprove: true,
    b2bRequireBusinessLicense: true,
    b2bWelcomeEmail: true,
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
          userApi.getAdminSettings()
        ]);

        setSettings(prev => ({
          ...prev,
          adminName: `${adminProfile.firstName} ${adminProfile.lastName}`.trim(),
          adminEmail: adminProfile.email,
          adminPhone: adminProfile.phoneNumber,
          adminPosition: adminProfile.metadata?.position || "Administrator",
          defaultB2BDiscount: adminSettings.defaultB2BDiscount,
          b2bCreditLimit: adminSettings.b2bCreditLimit,
          b2bAutoApprove: adminSettings.b2bAutoApprove,
          b2bRequireBusinessLicense: adminSettings.b2bRequireBusinessLicense,
          b2bWelcomeEmail: adminSettings.b2bWelcomeEmail,
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
      if (activeTab === "general") {
        // Update admin profile
        await userApi.updateAdminProfile({
          adminName: settings.adminName,
          adminEmail: settings.adminEmail,
          adminPhone: settings.adminPhone,
          adminPosition: settings.adminPosition
        });
        toast.success("Profile updated successfully!");
      } else if (activeTab === "b2b") {
        // Update B2B settings
        await userApi.updateAdminSettings({
          defaultB2BDiscount: settings.defaultB2BDiscount,
          b2bCreditLimit: settings.b2bCreditLimit,
          b2bAutoApprove: settings.b2bAutoApprove,
          b2bRequireBusinessLicense: settings.b2bRequireBusinessLicense,
          b2bWelcomeEmail: settings.b2bWelcomeEmail
        });
        toast.success("B2B settings updated successfully!");
      
        
      }
      
         const button = document.querySelector('.save-button');
    button?.classList.add('animate-pulse');
    setTimeout(() => button?.classList.remove('animate-pulse'), 1000);

  } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className={`relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
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
              <p className="text-gray-600 text-lg">Manage your profile and B2B settings with style</p>
            </div>
            
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

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className={`flex flex-col sm:flex-row bg-white/80 backdrop-blur-lg rounded-2xl p-2 mb-8 shadow-lg border border-white/20 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 px-6 py-4 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              activeTab === "general"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Admin Profile</span>
            {activeTab === "general" && <CheckCircle className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setActiveTab("b2b")}
            className={`flex-1 px-6 py-4 font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
              activeTab === "b2b"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>B2B Settings</span>
            {activeTab === "b2b" && <CheckCircle className="w-4 h-4" />}
          </button>
        </div>

        {/* General Settings (Admin Profile) */}
        {activeTab === "general" && (
          <div className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 transition-all duration-700 hover:shadow-2xl ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">Admin Profile</h2>
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

            <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-blue-800 text-xl">Profile Information</h3>
                </div>
                <p className="text-blue-700">
                  This information is used for system notifications and administrative communications.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B2B Settings */}
        {activeTab === "b2b" && (
          <div className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 transition-all duration-700 hover:shadow-2xl ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-900 bg-clip-text text-transparent">B2B Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full group-focus-within:animate-pulse"></div>
                  Default B2B Discount (%)
                </label>
                <input
                  type="number"
                  name="defaultB2BDiscount"
                  value={settings.defaultB2BDiscount}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Default discount percentage for all B2B users
                </p>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full group-focus-within:animate-pulse"></div>
                  Default Credit Limit (AED)
                </label>
                <input
                  type="number"
                  name="b2bCreditLimit"
                  value={settings.b2bCreditLimit}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80 text-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Default credit limit for new B2B accounts
                </p>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 group">
                  <input
                    type="checkbox"
                    name="b2bAutoApprove"
                    checked={settings.b2bAutoApprove}
                    onChange={handleInputChange}
                    className="h-6 w-6 text-green-600 focus:ring-green-500 border-2 border-gray-300 rounded-lg mt-1 transition-all duration-200"
                  />
                  <div className="flex-1">
                    <label className="block text-lg font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
                      Auto-approve new B2B users
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Automatically approve B2B registrations without manual review
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 group">
                  <input
                    type="checkbox"
                    name="b2bRequireBusinessLicense"
                    checked={settings.b2bRequireBusinessLicense}
                    onChange={handleInputChange}
                    className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-lg mt-1 transition-all duration-200"
                  />
                  <div className="flex-1">
                    <label className="block text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                      Require business license
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      B2B users must provide business license during registration
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 group">
                  <input
                    type="checkbox"
                    name="b2bWelcomeEmail"
                    checked={settings.b2bWelcomeEmail}
                    onChange={handleInputChange}
                    className="h-6 w-6 text-purple-600 focus:ring-purple-500 border-2 border-gray-300 rounded-lg mt-1 transition-all duration-200"
                  />
                  <div className="flex-1">
                    <label className="block text-lg font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                      Send welcome emails
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Send welcome email with login credentials to new B2B users
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-blue-400/5"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-green-600 animate-pulse" />
                  <h3 className="font-bold text-green-800 text-xl">B2B Features</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>Special discounted pricing on all products</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>Credit-based purchasing system</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>Dedicated account management support</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>Bulk booking capabilities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}