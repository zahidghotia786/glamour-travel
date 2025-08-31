"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Crown,
  Shield,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Settings,
  Ban,
  UserPlus,
} from "lucide-react";
import { adminApi, handleApiError, toastConfig } from "@/lib/api";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import Link from "next/link";

const UsersManagement = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("registeredDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Add b2b mnanager assignment modal state
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");

  // Bulk action loading states
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  console.log(users);
  // Fetch users from backend
  const fetchUsers = useCallback(
    async (page = 1, showLoading = true) => {
      if (showLoading) setLoading(true);

      try {
        const params = {
          page,
          limit: 20,
          search: searchTerm,
          role: roleFilter !== "all" ? roleFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortBy,
          sortOrder,
        };

        // Remove undefined params
        Object.keys(params).forEach(
          (key) => params[key] === undefined && delete params[key]
        );

        const response = await adminApi.getUsers(params);

        setUsers(response.data || response.users || []);
        setCurrentPage(
          response.pagination?.currentPage || response.pagination?.page || 1
        );
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || response.totalCount || 0);
      } catch (error) {
        handleApiError(error, toast);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [searchTerm, roleFilter, statusFilter, sortBy, sortOrder]
  );

  // Initial load and refresh on filter changes
  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  // Handle user actions
  const handleUserAction = async (userId, action, newValue = null) => {
    try {
      let response;

      switch (action) {
        case "toggleStatus":
          const user = users.find((u) => u.id === userId);
          const newStatus = user.status === "active" ? "inactive" : "active";
          response = await adminApi.updateUserStatus(
            userId,
            newStatus === "active"
          );
          toast.success(
            `User ${
              newStatus === "active" ? "activated" : "blocked"
            } successfully`
          );
          break;

        case "updateRole":
          response = await adminApi.updateUserRole(userId, newValue);
          toast.success("User role updated successfully");
          break;

        case "delete":
          if (window.confirm("Are you sure you want to delete this user?")) {
            response = await adminApi.deleteUser(userId);
            toast.success("User deleted successfully");
          } else {
            return;
          }
          break;

        default:
          break;
      }

      // Refresh the user list
      await fetchUsers(currentPage, false);
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select users first");
      return;
    }

    setBulkActionLoading(true);

    try {
      let successCount = 0;
      const promises = selectedUsers.map(async (userId) => {
        try {
          switch (action) {
            case "activate":
              await adminApi.updateUserStatus(userId, true);
              break;
            case "block":
              await adminApi.updateUserStatus(userId, false);
              break;
            case "delete":
              await adminApi.deleteUser(userId);
              break;
            default:
              break;
          }
          successCount++;
        } catch (error) {
          console.error(`Failed to ${action} user ${userId}:`, error);
        }
      });

      await Promise.all(promises);

      toast.success(`${successCount} users ${action}ed successfully`);
      setSelectedUsers([]);
      setShowBulkActions(false);
      await fetchUsers(currentPage, false);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // fetch account managers for assignment
  const fetchAccountManagers = useCallback(async () => {
    try {
      const response = await adminApi.getUsers({ role: "ADMIN", limit: 50 });
      setManagers(response.data || response.users || []);
    } catch (error) {
      console.error("Failed to fetch managers:", error);
      toast.error("Failed to load account managers");
    }
  }, []);

  // Handle assigning account manager
  const handleAssignManager = async (userId) => {
    if (!selectedManager) {
      toast.error("Please select an account manager");
      return;
    }

    try {
      await adminApi.assignAccountManager(userId, selectedManager);
      toast.success("Account manager assigned successfully");
      setShowAssignManagerModal(false);
      setSelectedManager("");
      await fetchUsers(currentPage, false);
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  // Call this in useEffect
  useEffect(() => {
    fetchUsers(1);
    fetchAccountManagers(); // Add this line
  }, [fetchUsers]);

  // Load user details
  const loadUserDetails = async (userId) => {
    try {
      const userDetails = await adminApi.getUserDetails(userId);
      setSelectedUser(userDetails);
      setShowUserModal(true);
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(currentPage, false);
    setRefreshing(false);
    toast.success("Data refreshed successfully");
  };

  // Export users
  const handleExport = async () => {
    try {
      // This would be a real API call in production
      const csvData = users.map((user) => ({
        Name: user.name || `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Role: user.role,
        Status: user.status,
        "Total Bookings": user.totalBookings || 0,
        "Total Revenue": user.totalRevenue || 0,
        "Registered Date": user.registeredDate || user.registeredDate,
      }));

      // Convert to CSV and download
      const csvString = [
        Object.keys(csvData[0]).join(","),
        ...csvData.map((row) => Object.values(row).join(",")),
      ].join("\n");

      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
    }
  };

  // Utility functions
  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "B2B":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      ADMIN: "bg-yellow-100 text-yellow-800 border-yellow-200",
      B2B: "bg-blue-100 text-blue-800 border-blue-200",
      CUSTOMER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[role] || colors.CUSTOMER;
  };

  const getStatusColor = (active) => {
    return active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
      <Icon className="w-4 h-4 text-blue-500" />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium">{value ?? "N/A"}</p>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Users Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage all platform users and their permissions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 border border-gray-200 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>

                <Link href="/admin/b2b/add">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add B2B User
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCount}
                  </p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.status === "active").length}
                  </p>
                </div>
                <div className="bg-green-500 p-3 rounded-xl">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">B2B Partners</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.role === "B2B").length}
                  </p>
                </div>
                <div className="bg-purple-500 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    AED{" "}
                    {users
                      .reduce((sum, u) => sum + (u.totalRevenue || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-500 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Table */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="overflow-hidden grid grid-cols-1"
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              {/* Table Header (kept functions) */}
              <div className="p-4 md:p-6 border-b border-gray-200/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedUsers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {selectedUsers.length} selected
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setShowBulkActions(!showBulkActions)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                        >
                          Actions
                        </motion.button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px] md:min-w-[260px]"
                      />
                    </div>

                    {/* Role Filter */}
                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Roles</option>
                      <option value="ADMIN">Admin</option>
                      <option value="B2B">B2B Partner</option>
                      <option value="CUSTOMER">Customer</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Blocked</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Actions */}
                <AnimatePresence>
                  {showBulkActions && selectedUsers.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-200"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium text-gray-700">
                          Bulk Actions:
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBulkAction("activate")}
                          disabled={bulkActionLoading}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          Activate All
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBulkAction("block")}
                          disabled={bulkActionLoading}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          Block All
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBulkAction("delete")}
                          disabled={bulkActionLoading}
                          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                          Delete All
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="py-3 px-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={
                            selectedUsers.length === users.length &&
                            users.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(users.map((u) => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-3 px-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                        User
                      </th>
                      <th className="py-3 px-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="py-3 px-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="py-3 px-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Statistics
                      </th>
                      <th className="py-3 px-3 text-left text-xs md:text-sm font-semibold text-gray-700">
                        Joined
                      </th>
                      <th className="py-3 px-3 text-center text-xs md:text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all duration-300"
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(
                                  selectedUsers.filter((id) => id !== user.id)
                                );
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.name ||
                                  `${user.firstName} ${user.lastName}` ||
                                  user.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              user.status === "active"
                            )}`}
                          >
                            {user.status === "active" ? "Active" : "Blocked"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {user.totalBookings || 0} bookings
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              AED {(user.totalRevenue || 0).toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.registeredDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => loadUserDetails(user.id)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleUserAction(user.id, "toggleStatus")
                              }
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                              title={
                                user.isActive ? "Block User" : "Activate User"
                              }
                            >
                              {user.isActive ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <UserCheck className="w-4 h-4" />
                              )}
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                handleUserAction(user.id, "delete")
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedUser(user);
                                setShowAssignManagerModal(true);
                              }}
                              className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Assign Account Manager"
                            >
                              <UserPlus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {!users.length && (
                      <tr>
                        <td colSpan="7" className="py-8 md:py-12 text-center">
                          <div className="text-gray-500">
                            <div className="text-4xl md:text-6xl mb-2 md:mb-4">
                              👥
                            </div>
                            <div className="text-base md:text-lg">
                              No users found
                            </div>
                            <div className="text-xs md:text-sm">
                              Try adjusting your search or filters
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination (untouched, just padding/fonts) */}
              {users.length > 0 && (
                <div className="p-4 md:p-6 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {users.length} of {totalCount} users
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchUsers(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </motion.button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchUsers(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* User Detail Modal */}
        <AnimatePresence>
          {showUserModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setShowUserModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl border border-blue-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <User className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold">User Profile</h3>
                    </div>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                      {selectedUser.user.firstName?.charAt(0) ||
                        selectedUser.user.email?.charAt(0) ||
                        "U"}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {`${selectedUser.user.firstName} ${selectedUser.user.lastName}` ||
                          selectedUser.user.email ||
                          "Unknown User"}
                      </h2>
                      <p className="text-blue-100 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedUser.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-600 font-medium">
                        Total Bookings
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        {selectedUser.statistics.totalBookings ?? 0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <p className="text-sm text-green-600 font-medium">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-green-800">
                        AED{" "}
                        {(
                          selectedUser.statistics.totalRevenue ?? 0
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium">
                        User Role
                      </p>
                      <p className="text-lg font-bold text-purple-800 capitalize">
                        {selectedUser.user.role?.toLowerCase()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                      <p className="text-sm text-amber-600 font-medium">
                        Status
                      </p>
                      <p className="text-lg font-bold text-amber-800 capitalize">
                        {selectedUser.user.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {/* Account Manager */}
                  {selectedUser.user.accountManager?.name && (
                    <div className="mb-6">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-indigo-600 font-medium">
                              Account Manager
                            </p>
                            <p className="text-lg font-bold text-indigo-800">
                              {selectedUser.user.accountManager.name}
                            </p>
                            <p className="text-sm text-indigo-500">
                              {selectedUser.user.accountManager.email}
                            </p>
                          </div>
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <UserCheck className="w-5 h-5 text-indigo-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" /> Personal
                        Information
                      </h4>
                      <div className="space-y-3">
                        <InfoRow
                          icon={Mail}
                          label="Email"
                          value={selectedUser.user.email}
                        />
                        <InfoRow
                          icon={Phone}
                          label="Phone"
                          value={selectedUser.user.phoneNumber}
                        />
                        <InfoRow
                          icon={MapPin}
                          label="Country"
                          value={selectedUser.user.nationality}
                        />
                        <InfoRow
                          icon={Calendar}
                          label="Registered Date"
                          value={new Date(
                            selectedUser.user.createdAt
                          ).toLocaleDateString()}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-600" /> Account
                        Information
                      </h4>
                      <div className="space-y-3">
                        <InfoRow
                          icon={Shield}
                          label="Role"
                          value={selectedUser.user.role}
                        />
                        <InfoRow
                          icon={
                            selectedUser.user.isActive ? CheckCircle : XCircle
                          }
                          label="Status"
                          value={
                            selectedUser.user.isActive ? "Active" : "Inactive"
                          }
                        />
                                                <InfoRow
                          icon={Shield}
                          label="User ID"
                          value={selectedUser.user.id}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      onClick={() => setShowUserModal(false)}
                    >
                      <XCircle className="w-4 h-4" /> Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assign Manager Modal */}
        <AnimatePresence>
          {showAssignManagerModal && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setShowAssignManagerModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Assign Account Manager
                  </h3>
                  <button
                    onClick={() => setShowAssignManagerModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Assigning manager for:{" "}
                    <strong>{selectedUser.name || selectedUser.email}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Account Manager
                  </label>
                  <select
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a manager</option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name} - {manager.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAssignManager(selectedUser.id)}
                    disabled={!selectedManager}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Manager
                  </button>
                  <button
                    onClick={() => setShowAssignManagerModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersManagement;
