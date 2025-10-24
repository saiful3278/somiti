/**
 * Bangla to English transliteration utility
 * Converts Bangla characters to their English equivalents for email generation
 */

// Bangla to English character mapping
const banglaToEnglishMap = {
  // Vowels
  'অ': 'a', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u',
  'ঋ': 'ri', 'এ': 'e', 'ঐ': 'ai', 'ও': 'o', 'ঔ': 'au',
  
  // Consonants
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
  'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'ny',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
  'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
  'য': 'y', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh',
  'স': 's', 'হ': 'h', 'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
  'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': 'n',
  
  // Vowel marks (kar)
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u',
  'ৃ': 'ri', 'ে': 'e', 'ৈ': 'ai', 'ো': 'o', 'ৌ': 'au',
  
  // Numbers
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  
  // Common conjuncts
  'ক্ষ': 'ksh', 'জ্ঞ': 'gy', 'ঞ্চ': 'nch', 'ঞ্জ': 'nj',
  'ত্র': 'tr', 'দ্র': 'dr', 'ন্ত': 'nt', 'ন্দ': 'nd',
  'ম্প': 'mp', 'ম্ব': 'mb', 'ল্প': 'lp', 'শ্চ': 'shch',
  'স্ত': 'st', 'স্প': 'sp', 'হ্ম': 'hm', 'হ্ন': 'hn'
};

/**
 * Transliterates Bangla text to English
 * @param {string} banglaText - The Bangla text to transliterate
 * @returns {string} - The transliterated English text
 */
export const transliterateBanglaToEnglish = (banglaText) => {
  if (!banglaText || typeof banglaText !== 'string') {
    return '';
  }

  let result = '';
  let i = 0;
  
  while (i < banglaText.length) {
    let matched = false;
    
    // Try to match longer sequences first (conjuncts)
    for (let len = 3; len >= 1; len--) {
      if (i + len <= banglaText.length) {
        const substring = banglaText.substring(i, i + len);
        if (banglaToEnglishMap[substring]) {
          result += banglaToEnglishMap[substring];
          i += len;
          matched = true;
          break;
        }
      }
    }
    
    // If no match found, check if it's already English or a space
    if (!matched) {
      const char = banglaText[i];
      if (/[a-zA-Z0-9\s]/.test(char)) {
        result += char.toLowerCase();
      }
      // Skip unknown characters
      i++;
    }
  }
  
  return result;
};

/**
 * Generates a safe email-friendly string from a name
 * @param {string} name - The name to process
 * @returns {string} - Email-safe string
 */
export const generateEmailSafeName = (name) => {
  if (!name || typeof name !== 'string') {
    return 'user';
  }

  // First transliterate if it contains Bangla characters
  let processedName = transliterateBanglaToEnglish(name.trim());
  
  // If transliteration resulted in empty string, use fallback
  if (!processedName) {
    processedName = 'user';
  }
  
  // Remove special characters and keep only alphanumeric
  processedName = processedName.replace(/[^a-zA-Z0-9]/g, '');
  
  // If still empty after cleaning, use fallback
  if (!processedName) {
    processedName = 'user';
  }
  
  // Take only the first part (first name equivalent)
  const firstPart = processedName.split(/\s+/)[0] || processedName;
  
  // Limit length to reasonable size for email
  return firstPart.substring(0, 15).toLowerCase();
};

/**
 * Generates a strong password with mixed characters
 * @param {string} baseName - Base name for password
 * @param {number} length - Desired password length (default: 12)
 * @returns {string} - Strong password
 */
const generateStrongPassword = (baseName, length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%&*';
  
  // Start with the base name (first name)
  const nameLength = Math.min(baseName.length, 6);
  let password = baseName.substring(0, nameLength);
  
  // Ensure we have at least one character from each category after the name
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill remaining length with random characters from all categories
  const allChars = uppercase + lowercase + numbers + symbols;
  const remainingLength = length - password.length;
  
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password;
};

/**
 * Generates email credentials with Bangla name support
 * @param {string} name - The user's name (can be in Bangla)
 * @returns {object} - Object containing email and password
 */
export const generateEmailCredentials = (name) => {
  const randomDigits = Math.floor(Math.random() * 900) + 100; // 100-999
  const safeName = generateEmailSafeName(name);
  
  // Generate a strong password using the safe name as base
  const strongPassword = generateStrongPassword(safeName, 12);
  
  return {
    email: `${safeName}${randomDigits}@fulmurigram.com`,
    password: strongPassword
  };
};