import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DollarSign, User, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Spinner, Card, Badge, BorrowRequestModal, BiddingChatRoom } from '../components';
import { itemService } from '../services';
import { useAuth } from '../context/AuthContext';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showBiddingRoom, setShowBiddingRoom] = useState(false);
  const [hasBiddingSession, setHasBiddingSession] = useState(false);

  useEffect(() => {
    loadItem();
  }, [id]);

  useEffect(() => {
    if (item) checkBiddingSession();
  }, [item]);

  const loadItem = async () => {
    try {
      const response = await itemService.getItemById(id!);
      if (response.success) {
        setItem(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const checkBiddingSession = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bidding/sessions/item/${id}`);
      if (response.ok) {
        const data = await response.json();
        setHasBiddingSession(!!data.data);
      }
    } catch (error) {
      setHasBiddingSession(false);
    }
  };

  const handleBorrowItem = () => {
    if (!user) {
      toast.error('Please login to borrow this item');
      navigate('/login');
      return;
    }
    setShowBorrowModal(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!item) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Item not found</p>
        </div>
      </MainLayout>
    );
  }

  const isOwnItem = user?.id === item.owner_id;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {item.images?.[0] ? (
              <img
                src={item.images[0].image_url}
                alt={item.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="info">{item.category}</Badge>
                <Badge variant={item.is_available ? 'success' : 'danger'}>
                  {item.is_available ? 'Available' : 'Not Available'}
                </Badge>
                <Badge variant="default">{item.condition}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-600 mr-1" />
                <span className="text-lg font-semibold text-gray-900">
                  ${item.rental_price}/day
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Deposit: ${item.deposit_amount}
              </div>
            </div>

            <Card>
              <div className="flex items-center space-x-3">
                {item.owner?.avatar_url ? (
                  <img
                    src={item.owner.avatar_url}
                    alt={item.owner.full_name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{item.owner?.full_name}</p>
                  <p className="text-sm text-gray-600">Trust Score: {item.owner?.trust_score}</p>
                </div>
              </div>
            </Card>

            {!isOwnItem && item.is_available && (
              <div className="space-y-2">
                <Button onClick={handleBorrowItem} className="w-full">
                  <Package className="w-5 h-5 mr-2" />
                  {user ? 'Borrow Item' : 'Login to Borrow'}
                </Button>
                {hasBiddingSession && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBiddingRoom(true)} 
                    className="w-full"
                  >
                    💰 Join Bidding Room
                  </Button>
                )}
              </div>
            )}
            {isOwnItem && (
              <Button 
                variant="outline" 
                onClick={() => setShowBiddingRoom(true)} 
                className="w-full"
              >
                {hasBiddingSession ? '💰 Manage Bidding' : '💰 Enable Bidding'}
              </Button>
            )}
          </div>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
        </Card>
      </div>

      <BorrowRequestModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        item={item}
        onSuccess={() => {
          toast.success('Request sent! Check your bookings page.');
          setShowBorrowModal(false);
        }}
      />

      {showBiddingRoom && (
        <BiddingChatRoom
          listingId={item.id}
          listingType="item"
          listing={item}
          onClose={() => setShowBiddingRoom(false)}
        />
      )}
    </MainLayout>
  );
};