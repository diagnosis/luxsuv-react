export const formatDateForInput = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export const formatTimeForInput = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5);
  } catch {
    return '';
  }
};

export const formatDateTimeForAPI = (date, time) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toISOString();
};

export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Not specified';
  }
};

export const formatBookingTitle = (dateString, pickupLocation, dropoffLocation) => {
  try {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });

    const pickup = extractDestinationName(pickupLocation);
    const destination = extractDestinationName(dropoffLocation);

    if (pickup && destination) {
      return { dateStr, pickup, destination, hasFullTrip: true };
    } else if (destination) {
      return { dateStr, destination, hasFullTrip: false };
    } else {
      return { dateStr, hasFullTrip: false };
    }
  } catch {
    return { dateStr: 'Recent Booking', hasFullTrip: false };
  }
};

const extractDestinationName = (fullAddress) => {
  if (!fullAddress) return '';

  const parts = fullAddress.split(',');
  let destination = parts[0].trim();

  if (/^\d+/.test(destination) && parts[1]) {
    destination = parts[1].trim();
  }

  if (destination.length > 25) {
    destination = destination.substring(0, 25) + '...';
  }

  return destination;
};
