import { MainLayout } from '../layouts/MainLayout';
import { Card, EmptyState } from '../components';
import { FileText, Package } from 'lucide-react';

export const MyRequestsPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">My Borrow Requests</h1>
    <EmptyState message="Your borrow requests will appear here" icon={<FileText className="w-16 h-16" />} />
  </MainLayout>
);

export const ReceivedRequestsPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">Received Requests</h1>
    <EmptyState message="Requests for your items will appear here" icon={<FileText className="w-16 h-16" />} />
  </MainLayout>
);

export const ItemDetailPage = () => (
  <MainLayout>
    <h1 className="text-3xl font-bold mb-6">Item Details</h1>
    <EmptyState message="Item details will appear here" icon={<Package className="w-16 h-16" />} />
  </MainLayout>
);

export const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <Card className="max-w-md w-full">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-gray-600">Password reset functionality will be implemented here</p>
    </Card>
  </div>
);
