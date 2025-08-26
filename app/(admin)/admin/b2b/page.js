"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter, Download, Upload, Users, Shield, Building2, UserCheck, Mail, Phone, Globe, Calendar, Settings, Crown, Key, CheckCircle, XCircle, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { fetchFromAPI } from "@/lib/api";

const B2BPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // B2B users data from backend
  const [b2bUsers, setB2bUsers] = useState([]);
  // Fetch users data from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchFromAPI("admin/users", {
          method: "GET",
        });
        
        if (response) {
          const usersData = await response;
          setB2bUsers(usersData);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sample roles data (you might want to fetch this from backend too)
  const [roles, setRoles] = useState([
    {
      id: 'premium-partner',
      name: 'Premium Partner',
      description: 'Top-tier partners with full access and highest commission rates',
      permissions: ['view_all_products', 'bulk_booking', 'api_access', 'priority_support', 'custom_pricing', 'white_label'],
      commission: 15,
      creditLimit: 50000,
      userCount: 2,
      color: 'purple'
    },
    {
      id: 'standard-partner',
      name: 'Standard Partner',
      description: 'Regular partners with standard access and commission rates',
      permissions: ['view_products', 'booking', 'api_access', 'standard_support'],
      commission: 12,
      creditLimit: 25000,
      userCount: 2,
      color: 'blue'
    },
    {
      id: 'basic-partner',
      name: 'Basic Partner',
      description: 'Entry-level partners with limited access',
      permissions: ['view_products', 'booking', 'email_support'],
      commission: 10,
      creditLimit: 10000,
      userCount: 1,
      color: 'green'
    }
  ]);

  const allPermissions = [
    { id: 'view_all_products', name: 'View All Products', category: 'Products' },
    { id: 'view_products', name: 'View Products', category: 'Products' },
    { id: 'booking', name: 'Make Bookings', category: 'Booking' },
    { id: 'bulk_booking', name: 'Bulk Bookings', category: 'Booking' },
    { id: 'api_access', name: 'API Access', category: 'Technical' },
    { id: 'priority_support', name: 'Priority Support', category: 'Support' },
    { id: 'standard_support', name: 'Standard Support', category: 'Support' },
    { id: 'email_support', name: 'Email Support', category: 'Support' },
    { id: 'custom_pricing', name: 'Custom Pricing', category: 'Pricing' },
    { id: 'white_label', name: 'White Label Access', category: 'Branding' }
  ];

  const filteredUsers = b2bUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || 'gray';
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.name || roleId;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

   const UserModal = ({ show, onClose, user, title }) => {
    const [formData, setFormData] = useState(user || {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      role: 'basic-partner',
      status: 'pending',
      country: '',
      commission: 10,
      apiAccess: false,
      creditLimit: 10000,
      accountManager: ''
    });

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 text-sm md:text-base">Manage B2B partner details</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 md:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <XCircle className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter contact person name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Manager</label>
                  <input
                    type="text"
                    value={formData.accountManager}
                    onChange={(e) => setFormData({...formData, accountManager: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter account manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
                  <input
                    type="number"
                    value={formData.commission}
                    onChange={(e) => setFormData({...formData, commission: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit (AED)</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({...formData, creditLimit: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="apiAccess"
                  checked={formData.apiAccess}
                  onChange={(e) => setFormData({...formData, apiAccess: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="apiAccess" className="text-gray-700 font-medium">API Access Enabled</label>
              </div>

              <div className="flex gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                  onClick={() => onClose()}
                >
                  {user ? 'Update User' : 'Create User'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const RoleModal = ({ show, onClose, role, title }) => {
    const [formData, setFormData] = useState(role || {
      id: '',
      name: '',
      description: '',
      permissions: [],
      commission: 10,
      creditLimit: 10000,
      color: 'blue'
    });

    if (!show) return null;

    const togglePermission = (permissionId) => {
      const permissions = formData.permissions.includes(permissionId)
        ? formData.permissions.filter(p => p !== permissionId)
        : [...formData.permissions, permissionId];
      setFormData({...formData, permissions});
    };

    const permissionsByCategory = allPermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) acc[permission.category] = [];
      acc[permission.category].push(permission);
      return acc;
    }, {});

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600 text-sm md:text-base">Define role permissions and settings</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 md:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <XCircle className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter role name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Commission (%)</label>
                  <input
                    type="number"
                    value={formData.commission}
                    onChange={(e) => setFormData({...formData, commission: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Credit Limit (AED)</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({...formData, creditLimit: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows="3"
                  placeholder="Enter role description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Permissions</label>
                <div className="space-y-4">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                    <div key={category} className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map(permission => (
                          <label key={permission.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
                  onClick={() => onClose()}
                >
                  {role ? 'Update Role' : 'Create Role'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">B2B Users & Roles</h1>
              <p className="text-sm md:text-lg text-gray-600">Manage B2B accounts, permissions, and partner relationships</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto mt-4 lg:mt-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRoleModal(true)}
                className="bg-white text-gray-700 px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 text-sm md:text-base"
              >
                <Shield className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Manage Roles</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add B2B User
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs md:text-sm font-medium">Total B2B Users</p>
                  <p className="text-xl md:text-2xl font-bold">{b2bUsers.length}</p>
                </div>
                <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs md:text-sm font-medium">Active Partners</p>
                  <p className="text-xl md:text-2xl font-bold">{b2bUsers.filter(u => u.status === 'active').length}</p>
                </div>
                <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-green-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs md:text-sm font-medium">Premium Partners</p>
                  <p className="text-xl md:text-2xl font-bold">{b2bUsers.filter(u => u.role === 'premium-partner').length}</p>
                </div>
                <Crown className="w-6 h-6 md:w-8 md:h-8 text-purple-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 md:p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs md:text-sm font-medium">API Enabled</p>
                  <p className="text-xl md:text-2xl font-bold">{b2bUsers.filter(u => u.apiAccess).length}</p>
                </div>
                <Key className="w-6 h-6 md:w-8 md:h-8 text-indigo-200" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-4 md:p-6 mb-6 md:mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'users', name: 'B2B Users', icon: Users },
                { id: 'roles', name: 'Roles & Permissions', icon: Shield }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 text-sm md:text-base ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Search and Filters */}
            {activeTab === 'users' && (
              <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                <div className="relative flex-1 lg:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search B2B users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 md:py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 text-gray-700 p-2 md:p-3 rounded-2xl hover:bg-gray-200 transition-all duration-300"
                >
                  <Filter className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 text-gray-700 p-2 md:p-3 rounded-2xl hover:bg-gray-200 transition-all duration-300"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 md:px-4 md:py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  
                  <select className="px-3 py-2 md:px-4 md:py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                    <option>All Roles</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  
                  <select className="px-3 py-2 md:px-4 md:py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                    <option>All Countries</option>
                    <option>UAE</option>
                    <option>UK</option>
                    <option>India</option>
                    <option>Germany</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden  "
          >
            {loading ? (
              <div className="p-8 text-center">
                <p>Loading users...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600">
                <p>Error: {error}</p>
              </div>
            ) : (
              <>
                {/* Table wrapper with horizontal scrolling */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full  overflow-hidden">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Company</th>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Contact</th>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Role</th>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Performance</th>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Commission</th>
                        <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="hover:bg-gray-50 transition-all duration-200"
                          >
                            {/* Company */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Building2 className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-gray-900 text-sm md:text-base truncate">{user.name}</div>
                                  <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                    <Globe className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">{user.country}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm md:text-base truncate">{user.contactPerson}</div>
                                <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                  <Mail className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                                <div className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{user.phone}</span>
                                </div>
                              </div>
                            </td>

                            {/* Role */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                getRoleColor(user.role) === 'purple'
                                  ? 'bg-purple-100 text-purple-800'
                                  : getRoleColor(user.role) === 'blue'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {getRoleName(user.role)}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {getStatusIcon(user.status)}
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </td>

                            {/* Performance */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm md:text-base">{formatNumber(user.totalBookings)} bookings</div>
                                <div className="text-xs md:text-sm text-gray-600">{formatNumber(user.totalRevenue)} AED</div>
                              </div>
                            </td>

                            {/* Commission */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <div className="font-semibold text-gray-900 text-sm md:text-base">{user.commission}%</div>
                              <div className="text-xs text-gray-500 truncate">Manager: {user.accountManager}</div>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                              <div className="flex gap-1 md:gap-2">
                                <button className="p-1 md:p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                  <Edit className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <button className="p-1 md:p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <button className="p-1 md:p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 md:py-10 text-center text-gray-500">
                            <p className="font-medium text-sm md:text-base">No users available</p>
                            <p className="text-xs md:text-sm text-gray-400">Start adding users to see them here.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > usersPerPage && (
                  <div className="px-4 py-3 md:px-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastUser, filteredUsers.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredUsers.length}</span> results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'roles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-4 md:p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
              <h3 className="text-xl font-bold text-gray-900">Role Management</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedRole(null);
                  setShowRoleModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add Role
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                        role.color === 'purple' ? 'bg-purple-100' :
                        role.color === 'blue' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        <Shield className={`w-4 h-4 md:w-6 md:h-6 ${
                          role.color === 'purple' ? 'text-purple-600' :
                          role.color === 'blue' ? 'text-blue-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">{role.name}</h4>
                        <p className="text-xs md:text-sm text-gray-500">{role.userCount} users</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedRole(role);
                        setShowRoleModal(true);
                      }}
                      className="p-1 md:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                    >
                      <Settings className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.button>
                  </div>

                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{role.description}</p>

                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-500">Commission</span>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">{role.commission}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-500">Credit Limit</span>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">{formatNumber(role.creditLimit)} AED</span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 md:pt-3">
                      <p className="text-xs text-gray-500 mb-1 md:mb-2">Permissions ({role.permissions.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permissionId) => {
                          const permission = allPermissions.find(p => p.id === permissionId);
                          return (
                            <span key={permissionId} className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {permission?.name}
                            </span>
                          );
                        })}
                        {role.permissions.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{role.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Modals */}
        <UserModal
          show={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          title={selectedUser ? 'Edit B2B User' : 'Add New B2B User'}
        />
        
        <RoleModal
          show={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedRole(null);
          }}
          role={selectedRole}
          title={selectedRole ? 'Edit Role' : 'Create New Role'}
        />
      </div>
    </div>
  );
};

export default B2BPage;