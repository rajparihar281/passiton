import { useState, useEffect, useRef } from 'react';
import { Send, DollarSign, Crown, Clock, X, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Card, Badge, Avatar } from './index';
import { biddingService } from '../services/bidding.service';
import { useAuth } from '../context/AuthContext';

interface BiddingChatRoomProps {
  listingId: string;
  listingType: 'item' | 'service';
  listing: any;
  onClose: () => void;
}

export const BiddingChatRoom = ({ listingId, listingType, listing, onClose }: BiddingChatRoomProps) => {
  const { user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [counterOfferAmount, setCounterOfferAmount] = useState('');
  const [selectedBidder, setSelectedBidder] = useState<string | null>(null);
  const [showTimeSetup, setShowTimeSetup] = useState(false);
  const [biddingEndTime, setBiddingEndTime] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<any>(null);

  const isOwner = user?.id === listing.owner_id || user?.id === listing.provider_id;
  const highestBid = session?.bids?.filter((b: any) => b.status === 'active')
    .sort((a: any, b: any) => b.amount - a.amount)[0];

  useEffect(() => {
    loadSession();
    pollInterval.current = setInterval(loadSession, 3000);
    return () => clearInterval(pollInterval.current);
  }, [listingId, listingType]);

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSession = async () => {
    try {
      const response = await biddingService.getSession(listingId, listingType);
      if (response.success) {
        setSession(response.data);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!biddingEndTime) {
      toast.error('Please select bidding end time');
      return;
    }
    
    const endTime = new Date(biddingEndTime);
    if (endTime <= new Date()) {
      toast.error('End time must be in the future');
      return;
    }

    try {
      const response = await biddingService.createSession(listingId, listingType, biddingEndTime);
      if (response.success) {
        setSession(response.data);
        setShowTimeSetup(false);
        toast.success('Bidding session created!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create session');
    }
  };

  const handlePlaceBid = async (customAmount?: string) => {
    const amount = parseFloat(customAmount || bidAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (highestBid && amount <= highestBid.amount) {
      toast.error('Bid must be higher than current highest bid');
      return;
    }

    try {
      await biddingService.placeBid(session.id, amount);
      setBidAmount('');
      loadSession();
      toast.success('Bid placed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await biddingService.acceptBid(session.id, bidId);
      loadSession();
      toast.success('Bid accepted! Booking created.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      await biddingService.rejectBid(session.id, bidId);
      loadSession();
      toast.success('Bid rejected');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject bid');
    }
  };

  const handleWithdrawBid = async (bidId: string) => {
    try {
      await biddingService.withdrawBid(session.id, bidId);
      loadSession();
      toast.success('Bid withdrawn');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to withdraw bid');
    }
  };

  const handleCounterOffer = async () => {
    if (!counterOfferAmount || !selectedBidder) return;
    try {
      await biddingService.counterOffer(session.id, selectedBidder, parseFloat(counterOfferAmount));
      setCounterOfferAmount('');
      setSelectedBidder(null);
      loadSession();
      toast.success('Counter offer sent');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send counter offer');
    }
  };

  const handleCloseSession = async () => {
    console.log('Close session clicked', { sessionId: session?.id, isOwner });
    
    if (!session?.id) {
      toast.error('Session not found');
      return;
    }
    
    try {
      console.log('Calling closeSession API...');
      const response = await biddingService.closeSession(session.id);
      console.log('Close session response:', response);
      
      await loadSession();
      toast.success('Bidding session closed');
    } catch (error: any) {
      console.error('Close session error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to close session';
      toast.error(errorMsg);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;

    try {
      await biddingService.sendMessage(session.id, message);
      setMessage('');
      loadSession();
    } catch (error: any) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!session && isOwner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-4">Enable Bidding</h2>
          <p className="text-gray-600 mb-4">
            Allow multiple users to bid on your {listingType}. You can accept the best offer.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Bidding End Time
            </label>
            <input
              type="datetime-local"
              value={biddingEndTime}
              onChange={(e) => setBiddingEndTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Set when bidding should automatically close</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCreateSession}>Enable Bidding</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-xl font-semibold mb-4">Bidding Not Available</h2>
          <p className="text-gray-600 mb-4">
            Bidding is not enabled for this {listingType}.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] mx-4 flex">
        {/* Left Panel - Listing Info */}
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <div className="mb-4">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 mb-2">
              ← Back
            </button>
            <h3 className="font-semibold text-lg">{listing.title}</h3>
            <p className="text-sm text-gray-600">{listing.category}</p>
          </div>

          {listing.images?.[0] && (
            <img 
              src={listing.images[0].image_url} 
              alt={listing.title}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
          )}

          <Card className="mb-4">
            <h4 className="font-medium mb-2">Current Highest Bid</h4>
            {highestBid ? (
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  ₹{highestBid.amount}
                </span>
                <Badge variant="success">
                  <Crown className="w-3 h-3 mr-1" />
                  Leading
                </Badge>
              </div>
            ) : (
              <p className="text-gray-500">No bids yet</p>
            )}
          </Card>

          {session?.ends_at && (
            <Card className="mb-4 bg-blue-50">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Ends at</p>
                  <p className="text-blue-700">{new Date(session.ends_at).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Active Bids ({session.bids?.filter((b: any) => b.status === 'active').length || 0})</h4>
              {isOwner && session.is_active && (
                <Button size="sm" variant="outline" onClick={handleCloseSession}>
                  Close Bidding
                </Button>
              )}
            </div>
            {session.bids?.filter((b: any) => b.status === 'active')
              .sort((a: any, b: any) => b.amount - a.amount)
              .map((bid: any, index: number) => (
                <div key={bid.id} className="p-2 bg-gray-50 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar src={bid.bidder.avatar_url} alt={bid.bidder.full_name} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{bid.bidder.full_name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(bid.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <span className="font-bold text-green-600">₹{bid.amount}</span>
                  </div>
                  {isOwner && session.is_active && (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleAcceptBid(bid.id)} className="flex-1 text-xs">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectBid(bid.id)} className="flex-1 text-xs">
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedBidder(bid.bidder_id);
                          setCounterOfferAmount(bid.amount.toString());
                        }}
                        className="text-xs"
                      >
                        Counter
                      </Button>
                    </div>
                  )}
                  {bid.bidder_id === user?.id && session.is_active && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleWithdrawBid(bid.id)}
                      className="w-full text-xs"
                    >
                      Withdraw Bid
                    </Button>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {session.messages?.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  {msg.message_type === 'system' ? (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {msg.message_text}
                    </div>
                  ) : msg.message_type === 'bid' || msg.message_type === 'counter_offer' ? (
                    <div className={`px-3 py-2 rounded-lg ${
                      msg.message_type === 'counter_offer' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      {msg.message_text}
                    </div>
                  ) : (
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender_id === user?.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-900'
                    }`}>
                      <div className="text-xs opacity-75 mb-1">{msg.sender?.full_name}</div>
                      <div>{msg.message_text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 space-y-3">
            {!session.is_active && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-yellow-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Bidding session is closed
              </div>
            )}
            
            {selectedBidder && isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Send Counter Offer</span>
                  <button onClick={() => setSelectedBidder(null)} className="text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Counter offer amount"
                    value={counterOfferAmount}
                    onChange={(e) => setCounterOfferAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleCounterOffer} size="sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Send
                  </Button>
                </div>
              </div>
            )}
            
            {!isOwner && session.is_active && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Quick Bid Amounts
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[50, 100, 150, 200, 250, 300].map((amount) => {
                    const bidValue = highestBid ? highestBid.amount + amount : amount;
                    return (
                      <Button
                        key={amount}
                        size="sm"
                        variant="outline"
                        onClick={() => handlePlaceBid(bidValue.toString())}
                        className="text-sm font-semibold"
                      >
                        ₹{bidValue}
                      </Button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={highestBid ? `Min: ₹${highestBid.amount + 10}` : 'Custom amount'}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handlePlaceBid}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    Bid
                  </Button>
                </div>
              </div>
            )}
            
            {session.is_active && (
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};