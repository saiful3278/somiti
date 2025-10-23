// Error handling utilities with Bengali messages and retry logic

export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  EMAIL_GEN_FAILED: 'EMAIL_GEN_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  FIRESTORE_ERROR: 'FIRESTORE_ERROR',
  BACKEND_ERROR: 'BACKEND_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR'
};

// Bengali error messages mapping
export const BengaliErrorMessages = {
  [ErrorTypes.NETWORK_ERROR]: 'ইন্টারনেট সংযোগ পরীক্ষা করুন',
  [ErrorTypes.EMAIL_EXISTS]: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে',
  [ErrorTypes.EMAIL_GEN_FAILED]: 'ইমেইল তৈরি করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন',
  [ErrorTypes.VALIDATION_ERROR]: 'তথ্য সঠিকভাবে পূরণ করুন',
  [ErrorTypes.AUTH_ERROR]: 'লগইন করুন বা অনুমতি পরীক্ষা করুন',
  [ErrorTypes.PERMISSION_DENIED]: 'আপনার এই কাজের অনুমতি নেই',
  [ErrorTypes.FIRESTORE_ERROR]: 'ডেটাবেস সংযোগে সমস্যা',
  [ErrorTypes.BACKEND_ERROR]: 'সার্ভার সংযোগে সমস্যা',
  [ErrorTypes.RATE_LIMIT_ERROR]: 'অনেক দ্রুত চেষ্টা করছেন। কিছুক্ষণ অপেক্ষা করুন'
};

// Specific error messages for different scenarios
export const SpecificErrorMessages = {
  // Registration errors
  REGISTER_FAILED: 'নিবন্ধন ব্যর্থ হয়েছে',
  REGISTER_EMAIL_EXISTS: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে',
  REGISTER_WEAK_PASSWORD: 'পাসওয়ার্ড আরো শক্তিশালী করুন',
  
  // Login errors
  LOGIN_FAILED: 'লগইন ব্যর্থ হয়েছে',
  LOGIN_INVALID_CREDENTIALS: 'ইমেইল বা পাসওয়ার্ড ভুল',
  LOGIN_USER_NOT_FOUND: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট নেই',
  LOGIN_ACCOUNT_DISABLED: 'আপনার অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে',
  
  // Member creation errors
  MEMBER_CREATE_FAILED: 'সদস্য যোগ করতে ব্যর্থ',
  MEMBER_DUPLICATE_PHONE: 'এই ফোন নম্বর দিয়ে ইতিমধ্যে সদস্য আছেন',
  MEMBER_INVALID_PHONE: 'সঠিক ফোন নম্বর দিন',
  MEMBER_REQUIRED_FIELDS: 'সব প্রয়োজনীয় তথ্য পূরণ করুন',
  
  // Firestore errors
  FIRESTORE_PERMISSION_DENIED: 'ডেটাবেস অ্যাক্সেসের অনুমতি নেই',
  FIRESTORE_UNAVAILABLE: 'ডেটাবেস সার্ভিস বন্ধ আছে',
  FIRESTORE_QUOTA_EXCEEDED: 'ডেটাবেস সীমা অতিক্রম করেছে',
  
  // Network errors
  NETWORK_TIMEOUT: 'সংযোগ সময় শেষ। আবার চেষ্টা করুন',
  NETWORK_OFFLINE: 'ইন্টারনেট সংযোগ নেই',
  SERVER_ERROR: 'সার্ভারে সমস্যা হয়েছে',
  
  // Validation errors
  VALIDATION_NAME_REQUIRED: 'নাম প্রয়োজন',
  VALIDATION_FATHER_NAME_REQUIRED: 'পিতার নাম প্রয়োজন',
  VALIDATION_PHONE_REQUIRED: 'ফোন নম্বর প্রয়োজন',
  VALIDATION_PHONE_INVALID: 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)',
  VALIDATION_ADDRESS_REQUIRED: 'ঠিকানা প্রয়োজন',
  VALIDATION_EMAIL_INVALID: 'সঠিক ইমেইল ঠিকানা দিন',
  VALIDATION_PASSWORD_WEAK: 'পাসওয়ার্ড কমপক্ষে ১০ অক্ষরের হতে হবে'
};

// Error classification function
export const classifyError = (error) => {
  if (!error) return ErrorTypes.BACKEND_ERROR;
  
  const errorMessage = error.message || error.toString().toLowerCase();
  const errorCode = error.code || '';
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorCode === 'network-request-failed') {
    return ErrorTypes.NETWORK_ERROR;
  }
  
  // Firebase/Firestore errors
  if (errorCode === 'permission-denied') {
    return ErrorTypes.PERMISSION_DENIED;
  }
  if (errorCode === 'unavailable') {
    return ErrorTypes.FIRESTORE_ERROR;
  }
  if (errorCode === 'quota-exceeded') {
    return ErrorTypes.FIRESTORE_ERROR;
  }
  
  // Authentication errors
  if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
    return ErrorTypes.AUTH_ERROR;
  }
  if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('email_exists')) {
    return ErrorTypes.EMAIL_EXISTS;
  }
  
  // Rate limiting
  if (errorCode === 'too-many-requests' || errorMessage.includes('rate limit')) {
    return ErrorTypes.RATE_LIMIT_ERROR;
  }
  
  return ErrorTypes.BACKEND_ERROR;
};

// Get Bengali error message
export const getBengaliErrorMessage = (error, specificKey = null) => {
  // If specific key is provided, use it
  if (specificKey && SpecificErrorMessages[specificKey]) {
    return SpecificErrorMessages[specificKey];
  }
  
  // Classify error and get general message
  const errorType = classifyError(error);
  return BengaliErrorMessages[errorType] || 'অজানা ত্রুটি হয়েছে';
};

// Retry configuration
export const RetryConfig = {
  EMAIL_GENERATION: {
    maxRetries: 10,
    baseDelay: 100, // milliseconds
    maxDelay: 2000
  },
  BACKEND_REGISTRATION: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000
  },
  FIRESTORE_OPERATIONS: {
    maxRetries: 3,
    baseDelay: 500,
    maxDelay: 3000
  }
};

// Exponential backoff delay calculation
export const calculateDelay = (attempt, baseDelay, maxDelay) => {
  const delay = baseDelay * Math.pow(2, attempt);
  return Math.min(delay, maxDelay);
};

// Generic retry function with exponential backoff
export const retryWithBackoff = async (
  operation,
  config = RetryConfig.BACKEND_REGISTRATION,
  shouldRetry = () => true
) => {
  let lastError;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!shouldRetry(error) || attempt === config.maxRetries) {
        throw error;
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(attempt, config.baseDelay, config.maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Specific retry functions for different operations

// Email generation retry with collision handling
export const retryEmailGeneration = async (generateEmailFn, checkEmailExistsFn) => {
  return retryWithBackoff(
    async () => {
      const email = generateEmailFn();
      const exists = await checkEmailExistsFn(email);
      
      if (exists) {
        throw new Error('EMAIL_EXISTS');
      }
      
      return email;
    },
    RetryConfig.EMAIL_GENERATION,
    (error) => error.message === 'EMAIL_EXISTS'
  );
};

// Firestore operation retry
export const retryFirestoreOperation = async (operation) => {
  return retryWithBackoff(
    operation,
    RetryConfig.FIRESTORE_OPERATIONS,
    (error) => {
      const errorType = classifyError(error);
      // Retry on network and firestore errors, but not on permission errors
      return errorType === ErrorTypes.NETWORK_ERROR || 
             errorType === ErrorTypes.FIRESTORE_ERROR;
    }
  );
};

// Rate limiting helper
export class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    return this.requests.length < this.maxRequests;
  }
  
  recordRequest() {
    this.requests.push(Date.now());
  }
  
  getTimeUntilNextRequest() {
    if (this.canMakeRequest()) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    return this.windowMs - (Date.now() - oldestRequest);
  }
}

// Global rate limiter instances
export const memberCreationRateLimiter = new RateLimiter(60000, 5); // 5 requests per minute
export const loginRateLimiter = new RateLimiter(300000, 10); // 10 requests per 5 minutes

// Error logging utility
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    context,
    message: error.message,
    code: error.code,
    stack: error.stack
  };
  
  console.error('Error logged:', errorInfo);
  
  // In production, you might want to send this to a logging service
  // sendToLoggingService(errorInfo);
};

// User-friendly error display helper
export const formatErrorForUser = (error, context = '') => {
  logError(error, context);
  
  const bengaliMessage = getBengaliErrorMessage(error);
  const errorType = classifyError(error);
  
  return {
    message: bengaliMessage,
    type: errorType,
    canRetry: [
      ErrorTypes.NETWORK_ERROR,
      ErrorTypes.BACKEND_ERROR,
      ErrorTypes.FIRESTORE_ERROR
    ].includes(errorType)
  };
};