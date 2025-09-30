export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'text-green-400 bg-green-400/20 border border-green-400/30';
    case 'pending':
      return 'text-yellow-300 bg-yellow-400/20 border border-yellow-400/40';
    case 'cancelled':
      return 'text-red-400 bg-red-400/20 border border-red-400/30';
    case 'completed':
      return 'text-blue-400 bg-blue-400/20 border border-blue-400/30';
    default:
      return 'text-gray-400 bg-gray-400/20 border border-gray-400/30';
  }
};

export const getPaymentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'validated':
      return 'text-blue-400 bg-blue-400/20 border border-blue-400/30';
    case 'paid':
      return 'text-green-400 bg-green-400/20 border border-green-400/30';
    case 'failed':
      return 'text-red-400 bg-red-400/20 border border-red-400/30';
    case 'pending':
    default:
      return 'text-orange-400 bg-orange-400/20 border border-orange-400/30';
  }
};

export const isPaid = (booking) => {
  return booking.paid === true ||
         booking.payment_status === 'paid' ||
         booking.status === 'completed';
};

export const isPaymentValidated = (booking) => {
  return booking.payment_status === 'validated';
};

export const canPay = (booking) => {
  return booking.status?.toLowerCase() === 'approved' &&
         isPaymentValidated(booking) &&
         !isPaid(booking);
};

export const canCancel = (booking, showCancelOption) => {
  if (booking.status?.toLowerCase() === 'cancelled') return false;
  if (booking.status?.toLowerCase() === 'completed') return false;
  return showCancelOption;
};

export const canActuallyCancel = (booking, showCancelOption, guestToken) => {
  return canCancel(booking, showCancelOption) && !!guestToken;
};

export const canEdit = (booking) => {
  if (booking.status?.toLowerCase() === 'cancelled') return false;
  if (booking.status?.toLowerCase() === 'completed') return false;
  return true;
};

export const validateBookingTime = (scheduledAt) => {
  const bookingDateTime = new Date(scheduledAt);
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));

  return bookingDateTime > oneHourFromNow;
};

export const validatePassengerCount = (count) => {
  return count >= 1 && count <= 8;
};

export const validateLuggageCount = (count) => {
  return count >= 0 && count <= 20;
};
