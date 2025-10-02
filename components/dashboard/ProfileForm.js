'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Globe, Building, FileText, Calendar } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  );
}

export default function ProfileForm({ saving, setSaving }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    companyName: '',
    businessLicense: '',
    dateOfBirth: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched profile:", data);

        if (res.ok && data.user) {
          const user = data.user;
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            nationality: user.nationality || '',
            companyName: user.companyName || '',
            businessLicense: user.businessLicense || '',
            dateOfBirth: formatDate(user.dateOfBirth),
          });
        } else {
          console.error('Profile fetch failed:', data.error || data.message);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = getAuthToken();
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        alert(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ icon: Icon, label, ...props }) => (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-500" />
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none disabled:bg-gradient-to-r disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Profile Information</h1>
                <p className="text-blue-100 text-sm">Manage your personal details and preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={User}
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />

                <InputField
                  icon={User}
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Contact Information
              </h3>

              <div className="space-y-6">
                <InputField
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  disabled
                  placeholder="your.email@example.com"
                />

                <InputField
                  icon={Phone}
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={Globe}
                    label="Nationality"
                    type="text"
                    name="nationality"
                    value={formData.nationality || ''}
                    onChange={handleChange}
                    placeholder="Enter your nationality"
                  />

                  <InputField
                    icon={Calendar}
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 pb-3 border-b-2 border-blue-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                Business Information
              </h3>

              <div className="space-y-6">
                <InputField
                  icon={Building}
                  label="Company Name"
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />

                <InputField
                  icon={FileText}
                  label="Business License"
                  type="text"
                  name="businessLicense"
                  value={formData.businessLicense || ''}
                  onChange={handleChange}
                  placeholder="Enter your business license number"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t-2 border-gray-100">
              <button
                type="button"
                onClick={() => {}}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Your information is secured with end-to-end encryption
          </p>
        </div>
      </div>
    </div>
  );
}