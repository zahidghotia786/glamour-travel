"use client";
import { Suspense, useState, useEffect } from "react"; // Added Suspense import
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  UserPlus,
  XCircle,
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Shield,
  Save,
  Percent,
  DollarSign
} from "lucide-react";
import { adminApi, handleApiError } from "@/lib/api";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

// Renamed this function to AddB2BUserContent
function AddB2BUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [creatingUser, setCreatingUser] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [accountManagers, setAccountManagers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    businessLicense: "",
    accountManagerId: "",
    markupType: "percentage",
    markupValue: 0
  });

  // Check if we're in edit mode and fetch user data if needed
  useEffect(() => {
    const edit = searchParams.get('edit');
    const id = searchParams.get('id');
    
    if (edit === 'true' && id) {
      setIsEditMode(true);
      setUserId(id);
      fetchUserData(id);
    }

    fetchAccountManagers();
  }, [searchParams]);

  const fetchAccountManagers = async () => {
    try {
      setLoadingManagers(true);
      const response = await adminApi.getUsers();
      setAccountManagers(response.users || response.data || []);
    } catch (error) {
      console.error('Failed to fetch account managers:', error);
      toast.error('Failed to load account managers');
    } finally {
      setLoadingManagers(false);
    }
  };

  const fetchUserData = async (id) => {
    try {
      setLoadingUserData(true);
      const response = await adminApi.getUserDetails(id);
      const user = response.user || response;
      
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        companyName: user.companyName || "",
        businessLicense: user.businessLicense || "",
        creditLimit: user.creditLimit || 50000,
        accountManagerId: user.accountManagerId || "",
        markupType: user.markupType || "percentage",
        markupValue: user.markupValue || 0
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingUser(true);

    try {
      if (isEditMode) {
        // Update existing user
        const response = await adminApi.updateB2BUser(userId, formData);
        toast.success("B2B user updated successfully!");
      } else {
        // Create new user
        const response = await adminApi.createB2BUser(formData);
        toast.success("B2B user created successfully!");
      }
      
      // Redirect back to users management
      router.push("/admin/b2b");
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkupTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      markupType: type,
      markupValue: 0 // Reset value when changing type
    }));
  };

  if (loadingUserData) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isEditMode ? 'Edit B2B User' : 'Add New B2B User'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode 
                ? 'Update B2B partner account information'
                : 'Create a new B2B partner account with special pricing and features'
              }
            </p>
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                {isEditMode ? <Save className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <h2 className="text-xl font-semibold">
                {isEditMode ? 'Edit User Information' : 'B2B User Information'}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter email address"
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter company name"
                />
              </div>

              {/* Business License */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Business License Number
                </label>
                <input
                  type="text"
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter business license number"
                />
              </div>

              {/* Markup Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Markup Type *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="markupType"
                      value="percentage"
                      checked={formData.markupType === "percentage"}
                      onChange={() => handleMarkupTypeChange("percentage")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Percent className="w-4 h-4" />
                    Percentage (%)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="markupType"
                      value="fixed"
                      checked={formData.markupType === "fixed"}
                      onChange={() => handleMarkupTypeChange("fixed")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <DollarSign className="w-4 h-4" />
                    Fixed Amount (AED)
                  </label>
                </div>
              </div>

              {/* Markup Value */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  {formData.markupType === "percentage" ? (
                    <Percent className="w-4 h-4" />
                  ) : (
                    <DollarSign className="w-4 h-4" />
                  )}
                  Markup Value *
                </label>
                <input
                  type="number"
                  name="markupValue"
                  required
                  min="0"
                  step={formData.markupType === "percentage" ? "0.1" : "1"}
                  value={formData.markupValue}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={formData.markupType === "percentage" ? "Enter percentage" : "Enter fixed amount"}
                />
                {formData.markupType === "percentage" && (
                  <p className="text-sm text-gray-500 mt-1">
                    This percentage will be added to the base price
                  </p>
                )}
                {formData.markupType === "fixed" && (
                  <p className="text-sm text-gray-500 mt-1">
                    This fixed amount will be added to the base price
                  </p>
                )}
              </div>

              {/* Account Manager */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Assign Account Manager
                </label>
                {loadingManagers ? (
                  <div className="flex items-center justify-center p-3 border border-gray-300 rounded-lg bg-gray-50">
                    Loading account managers...
                  </div>
                ) : (
                  <select
                    name="accountManagerId"
                    value={formData.accountManagerId}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Account Manager (Optional)</option>
                    {accountManagers.map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.firstName} {manager.lastName} - {manager.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={creatingUser || loadingManagers}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creatingUser ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {isEditMode ? 'Update B2B User' : 'Create B2B User'}
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-2xl p-6 mt-6 border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-2">ℹ️ About B2B Users</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• B2B users get special pricing and markup options</li>
            <li>• They can manage their own bookings and customers</li>
            <li>• Credit limit determines their purchasing power</li>
            <li>• Account manager provides dedicated support</li>
            <li>• Markup can be set as percentage or fixed amount</li>
            {!isEditMode && <li>• Temporary password will be emailed to the user</li>}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

// This is the default export that wraps the content in Suspense
export default function AddB2BUserPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AddB2BUserContent />
    </Suspense>
  );
}