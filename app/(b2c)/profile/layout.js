import DashboardLayout from '@/components/dashboard/DashboardLayout.js';

export const metadata = {
  title: 'My Profile - Zahid Ghotia',
  description: 'Manage your bookings, payments, and favorites',
};

export default function ProfileLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}