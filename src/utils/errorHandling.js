export const isTokenExpiredError = (error, statusCode) => {
  if (statusCode === 410) return true;

  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('expired') ||
    message.includes('already been used') ||
    message.includes('token_expired') ||
    message.includes('token expired') ||
    message.includes('access token has expired')
  );
};

export const isTokenInvalidError = (error, statusCode) => {
  if (statusCode === 400) return true;

  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('invalid access') ||
    message.includes('check your code') ||
    message.includes('invalid token') ||
    message.includes('malformed')
  );
};

export const isRateLimitError = (error, statusCode) => {
  return statusCode === 429;
};

export const isNotFoundError = (error, statusCode) => {
  return statusCode === 404;
};

export const isEmailNotFoundError = (error, statusCode) => {
  if (statusCode !== 404) return false;

  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('not found') ||
    message.includes('email not found') ||
    message.includes('no bookings found')
  );
};

export const getTokenErrorMessage = (error, statusCode) => {
  if (isTokenExpiredError(error, statusCode)) {
    const message = error?.message || '';
    if (message.includes('already been used')) {
      return 'This access link or code has already been used. Please request a new one.';
    }
    return 'Your access has expired. Please request a new access code to view your bookings.';
  }

  if (isTokenInvalidError(error, statusCode)) {
    const message = error?.message || '';
    if (message.includes('access code')) {
      return 'Invalid access code format. Please check your 6-digit code and try again.';
    }
    return 'Invalid access link. Please check the link or request a new one.';
  }

  if (isRateLimitError(error, statusCode)) {
    return 'Too many failed attempts. Please wait a moment and request a new access code.';
  }

  if (isNotFoundError(error, statusCode)) {
    return 'Access link not found. Please request a new one.';
  }

  return error?.message || 'An unexpected error occurred';
};

export const getEmailErrorMessage = (error, statusCode) => {
  if (isEmailNotFoundError(error, statusCode)) {
    return 'No bookings found for this email address. Please double-check your email and try again, or contact support if you believe this is an error.';
  }

  if (isRateLimitError(error, statusCode)) {
    return 'Too many requests. Please wait a moment before trying again.';
  }

  return error?.message || 'An unexpected error occurred while requesting access codes.';
};

export const enrichError = (error) => {
  const statusCode = error?.status || error?.response?.status;

  return {
    ...error,
    statusCode,
    isTokenExpired: isTokenExpiredError(error, statusCode),
    isTokenInvalid: isTokenInvalidError(error, statusCode),
    isRateLimit: isRateLimitError(error, statusCode),
    isNotFound: isNotFoundError(error, statusCode),
    isEmailNotFound: isEmailNotFoundError(error, statusCode),
    userFriendlyMessage: error.userFriendlyMessage || getTokenErrorMessage(error, statusCode)
  };
};
