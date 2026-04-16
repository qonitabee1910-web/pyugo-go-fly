/**
 * Service Layer Index
 * Central export point for all business logic services
 */

export { paymentService } from './PaymentService';
export { notificationService } from './NotificationService';
export { analyticsService, ratingService } from './AnalyticsService';
export { supportService, advancedDispatchService } from './SupportService';

/**
 * Service Usage Patterns
 * ========================
 *
 * 1. PAYMENT SERVICE
 *    - Create payment intent: paymentService.createPaymentIntent(params)
 *    - Confirm payment: paymentService.confirmPayment(txId, gatewayTxId, status)
 *    - Process refund: paymentService.processRefund(refundRequest)
 *    - Get wallet: paymentService.getWallet(userId)
 *
 * 2. NOTIFICATION SERVICE
 *    - Send notification: notificationService.send(payload, userId)
 *    - Broadcast to drivers: notificationService.broadcastToDrivers(message)
 *    - Register device: notificationService.registerDeviceToken(userId, token, platform)
 *    - Mark read: notificationService.markAsRead(notificationId)
 *
 * 3. ANALYTICS SERVICE
 *    - Track event: analyticsService.trackEvent(eventName, properties, userId)
 *    - Track purchase: analyticsService.trackPurchase(userId, amount, bookingId, type)
 *    - Track trip: analyticsService.trackRideCompletion(userId, bookingId, distance, duration, fare)
 *    - Get stats: analyticsService.getUserStatistics(userId)
 *
 * 4. RATING SERVICE
 *    - Submit rating: ratingService.submitRating(bookingId, raterId, rateeId, rating, comment)
 *    - Get stats: ratingService.getDriverRatingStats(driverId)
 *    - Detect fraud: ratingService.detectSuspiciousRatings(driverId)
 *
 * 5. SUPPORT SERVICE
 *    - Create ticket: supportService.createTicket(userId, ticketData)
 *    - Get tickets: supportService.getUserTickets(userId, status)
 *    - Update status: supportService.updateTicketStatus(ticketId, status, notes)
 *
 * 6. ADVANCED DISPATCH SERVICE
 *    - Find drivers: advancedDispatchService.findOptimalDrivers(context)
 *    - Adaptive dispatch: advancedDispatchService.adaptiveDispatch(context)
 */
