// Debug Safety Utilities
// Prevents debug users from affecting production data

/**
 * Checks if the current user is a debug user
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - True if user is a debug user
 */
export const isDebugUser = (user) => {
  return user && (user.isDebugUser === true || user.uid === 'debug-user');
};

/**
 * Prevents Firebase operations for debug users
 * @param {Object} user - User object from AuthContext
 * @param {string} operation - Name of the operation being attempted
 * @returns {Object} - Success false with debug message if debug user
 */
export const preventDebugFirebaseOperation = (user, operation = 'operation') => {
  if (isDebugUser(user)) {
    console.warn(`🚫 Debug Safety: ${operation} blocked for debug user`);
    return {
      success: false,
      error: 'Debug users cannot perform database operations',
      isDebugBlocked: true
    };
  }
  return null; // Allow operation to proceed
};

/**
 * Creates mock data for debug users instead of real Firebase operations
 * @param {string} type - Type of mock data to create
 * @param {Object} inputData - Input data for the mock
 * @returns {Object} - Mock response
 */
export const createMockResponse = (type, inputData = {}) => {
  const mockId = `debug-${type}-${Date.now()}`;
  
  switch (type) {
    case 'member':
      return {
        success: true,
        data: {
          id: mockId,
          ...inputData,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active',
          isDebugData: true
        }
      };
    
    case 'transaction':
      return {
        success: true,
        data: {
          id: mockId,
          ...inputData,
          createdAt: new Date(),
          isDebugData: true
        }
      };
    
    case 'notice':
      return {
        success: true,
        data: {
          id: mockId,
          ...inputData,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDebugData: true
        }
      };
    
    default:
      return {
        success: true,
        data: {
          id: mockId,
          ...inputData,
          isDebugData: true
        }
      };
  }
};

/**
 * Shows debug warning in UI components
 * @param {Object} user - User object from AuthContext
 * @returns {JSX.Element|null} - Debug warning component or null
 */
export const DebugWarning = ({ user }) => {
  if (!isDebugUser(user)) return null;
  
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm">
            <strong>Debug Mode:</strong> You are using a debug account. Data operations are simulated and won't affect production.
          </p>
        </div>
      </div>
    </div>
  );
};