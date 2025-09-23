'use client';
import { useState } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview.js';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardOverview activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}