// Bidding System Test Scenarios
// Run these tests manually or integrate with your test framework

import { biddingService } from '../services/bidding.service';

export const biddingTests = {
  // Test 1: Create Bidding Session
  async testCreateSession() {
    console.log('🧪 Test 1: Create Bidding Session');
    try {
      const session = await biddingService.createSession(
        'test-listing-id',
        'item',
        'owner-user-id'
      );
      console.log('✅ Session created:', session.id);
      return session;
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 2: Place Valid Bid
  async testPlaceBid(sessionId) {
    console.log('🧪 Test 2: Place Valid Bid');
    try {
      const bid = await biddingService.placeBid(
        sessionId,
        'bidder-user-id',
        100
      );
      console.log('✅ Bid placed:', bid.amount);
      return bid;
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 3: Place Bid Below Minimum Increment
  async testInvalidBidIncrement(sessionId) {
    console.log('🧪 Test 3: Bid Below Minimum Increment (Should Fail)');
    try {
      await biddingService.placeBid(sessionId, 'bidder2-id', 105);
      console.error('❌ Should have failed but succeeded');
    } catch (error) {
      console.log('✅ Correctly rejected:', error.message);
    }
  },

  // Test 4: Owner Attempts to Bid
  async testOwnerBidding(sessionId, ownerId) {
    console.log('🧪 Test 4: Owner Attempts to Bid (Should Fail)');
    try {
      await biddingService.placeBid(sessionId, ownerId, 200);
      console.error('❌ Should have failed but succeeded');
    } catch (error) {
      console.log('✅ Correctly rejected:', error.message);
    }
  },

  // Test 5: Bid Cooldown
  async testBidCooldown(sessionId, bidderId) {
    console.log('🧪 Test 5: Bid Cooldown (Should Fail)');
    try {
      await biddingService.placeBid(sessionId, bidderId, 150);
      await biddingService.placeBid(sessionId, bidderId, 160);
      console.error('❌ Should have failed but succeeded');
    } catch (error) {
      console.log('✅ Correctly rejected:', error.message);
    }
  },

  // Test 6: Withdraw Bid
  async testWithdrawBid(sessionId, bidId, bidderId) {
    console.log('🧪 Test 6: Withdraw Bid');
    try {
      const result = await biddingService.withdrawBid(sessionId, bidId, bidderId);
      console.log('✅ Bid withdrawn:', result.status);
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 7: Counter Offer
  async testCounterOffer(sessionId, ownerId, bidderId) {
    console.log('🧪 Test 7: Counter Offer');
    try {
      const offer = await biddingService.counterOffer(
        sessionId,
        ownerId,
        bidderId,
        125
      );
      console.log('✅ Counter offer sent:', offer.message_text);
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 8: Reject Bid
  async testRejectBid(sessionId, bidId, ownerId) {
    console.log('🧪 Test 8: Reject Bid');
    try {
      const result = await biddingService.rejectBid(sessionId, bidId, ownerId);
      console.log('✅ Bid rejected:', result.status);
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 9: Accept Bid
  async testAcceptBid(sessionId, bidId, ownerId) {
    console.log('🧪 Test 9: Accept Bid');
    try {
      const result = await biddingService.acceptBid(sessionId, bidId, ownerId);
      console.log('✅ Bid accepted:', result.status);
      console.log('✅ Booking should be created');
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 10: Bid on Closed Session
  async testBidOnClosedSession(sessionId, bidderId) {
    console.log('🧪 Test 10: Bid on Closed Session (Should Fail)');
    try {
      await biddingService.placeBid(sessionId, bidderId, 300);
      console.error('❌ Should have failed but succeeded');
    } catch (error) {
      console.log('✅ Correctly rejected:', error.message);
    }
  },

  // Test 11: Send Message
  async testSendMessage(sessionId, userId) {
    console.log('🧪 Test 11: Send Message');
    try {
      const message = await biddingService.sendMessage(
        sessionId,
        userId,
        'Test message in bidding chat'
      );
      console.log('✅ Message sent:', message.message_text);
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Test 12: Close Session
  async testCloseSession(sessionId, ownerId) {
    console.log('🧪 Test 12: Close Session');
    try {
      const result = await biddingService.closeSession(sessionId, ownerId);
      console.log('✅ Session closed:', result.is_active);
    } catch (error) {
      console.error('❌ Failed:', error.message);
    }
  },

  // Run All Tests
  async runAllTests() {
    console.log('🚀 Starting Bidding System Tests\n');
    
    const session = await this.testCreateSession();
    if (!session) return;

    const bid1 = await this.testPlaceBid(session.id);
    await this.testInvalidBidIncrement(session.id);
    await this.testOwnerBidding(session.id, session.owner_id);
    
    if (bid1) {
      await this.testBidCooldown(session.id, bid1.bidder_id);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for cooldown
      
      const bid2 = await this.testPlaceBid(session.id);
      await this.testSendMessage(session.id, bid1.bidder_id);
      await this.testCounterOffer(session.id, session.owner_id, bid1.bidder_id);
      
      if (bid2) {
        await this.testRejectBid(session.id, bid2.id, session.owner_id);
      }
      
      await this.testWithdrawBid(session.id, bid1.id, bid1.bidder_id);
      
      const bid3 = await this.testPlaceBid(session.id);
      if (bid3) {
        await this.testAcceptBid(session.id, bid3.id, session.owner_id);
        await this.testBidOnClosedSession(session.id, 'another-bidder-id');
      }
    }

    console.log('\n✅ All tests completed!');
  }
};

// Manual test execution
// biddingTests.runAllTests();
