import { useState, useEffect } from 'react';
import { User, Star, Package, Briefcase, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { profileService } from '../services/profile.service';
import { useAuth } from '../context/AuthContext';

interface ProfileStats {
  total_service_bookings: number;
  completed_service_bookings: number;
  total_resource_transactions: number;
  completed_resource_transactions: number;
  items_listed: number;
  services_offered: number;
  average_rating: number;
  total_reviews: number;
}

interface ProfileData {
  id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
  phone?: string;
  bio?: string;
  trust_score: number;
  college?: { name: string; location: string };
  stats: ProfileStats;
}

interface Booking {
  id: string;
  status: string;
  created_at: string;
  agreed_price?: number;
  service?: { title: string; category: string };
  provider?: { full_name: string; avatar_url?: string };
  item?: { title: string; category: string };
  owner?: { full_name: string; avatar_url?: string };
}

export const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [serviceBookings, setServiceBookings] = useState<Booking[]>([]);
  const [resourceBookings, setResourceBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'resources'>('services');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, serviceRes, resourceRes] = await Promise.all([
          profileService.getMyProfile(),
          profileService.getMyServiceBookings(),
          profileService.getMyResourceBookings(),
        ]);

        if (profileRes.success) setProfile(profileRes.data);
        if (serviceRes.success) setServiceBookings(serviceRes.data);
        if (resourceRes.success) setResourceBookings(resourceRes.data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || 'Anonymous User'}</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.college && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.college.name}</span>
                </div>
              )}
            </div>
            {profile.bio && (
              <p className="mt-3 text-gray-700">{profile.bio}</p>
            )}
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{profile.stats.average_rating.toFixed(1)}</span>
                <span className="text-gray-500">({profile.stats.total_reviews} reviews)</span>
              </div>
              <div className="text-sm text-gray-600">
                Trust Score: <span className="font-medium">{profile.trust_score}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.stats.items_listed}</p>
              <p className="text-sm text-gray-600">Items Listed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.stats.services_offered}</p>
              <p className="text-sm text-gray-600">Services Offered</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.stats.completed_service_bookings}</p>
              <p className="text-sm text-gray-600">Services Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile.stats.completed_resource_transactions}</p>
              <p className="text-sm text-gray-600">Resources Borrowed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking History */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Service Bookings ({serviceBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resources'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Resource Bookings ({resourceBookings.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'services' ? (
            <div className="space-y-4">
              {serviceBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No service bookings yet</p>
              ) : (
                serviceBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{booking.service?.title}</h3>
                        <p className="text-sm text-gray-600">Provider: {booking.provider?.full_name}</p>
                        <p className="text-sm text-gray-500">Category: {booking.service?.category}</p>
                        <p className="text-sm text-gray-500">
                          Booked: {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        {booking.agreed_price && (
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ${booking.agreed_price}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {resourceBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No resource bookings yet</p>
              ) : (
                resourceBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{booking.item?.title}</h3>
                        <p className="text-sm text-gray-600">Owner: {booking.owner?.full_name}</p>
                        <p className="text-sm text-gray-500">Category: {booking.item?.category}</p>
                        <p className="text-sm text-gray-500">
                          Borrowed: {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};