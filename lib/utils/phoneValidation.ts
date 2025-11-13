import type { LocationData } from "@/store/slices/cartSlice";

/**
 * Phone validation utility based on country/region
 * Supports international phone number formats
 */

// Country code type - includes all implemented countries
export type CountryCode =
  | "US" | "IN" | "GB" | "CA" | "AU" | "DE" | "FR" | "IT" | "ES" | "NL"
  | "BE" | "CH" | "AT" | "SE" | "NO" | "DK" | "FI" | "PL" | "CZ" | "IE"
  | "PT" | "GR" | "RU" | "TR" | "SA" | "AE" | "IL" | "JP" | "CN" | "KR"
  | "SG" | "MY" | "TH" | "ID" | "PH" | "VN" | "NZ" | "ZA" | "EG" | "NG"
  | "KE" | "MX" | "BR" | "AR" | "CL" | "CO" | "PE" | "VE" | "PK" | "BD"
  | "LK" | "UNKNOWN";

// Country information interface
export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  dialCode: string;
  format: (phone: string) => string;
  validate: (phone: string) => { isValid: boolean; errorMessage: string | null };
  placeholder: string;
  hint: string;
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
}

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  country: CountryCode;
  errorMessage: string | null;
}

export interface PhoneValidationConfig {
  country: CountryCode;
  allowInternational?: boolean;
}

/**
 * Clean phone number - remove all non-digit characters except +
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Extract digits only from phone number
 */
function extractDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Format phone number with pattern
 */
function formatWithPattern(digits: string, pattern: string): string {
  let formatted = "";
  let digitIndex = 0;
  
  for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
    if (pattern[i] === "X" || pattern[i] === "x") {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += pattern[i];
    }
  }
  
  // Add remaining digits
  if (digitIndex < digits.length) {
    formatted += digits.slice(digitIndex);
  }
  
  return formatted;
}

/**
 * Generic phone formatter
 */
function formatPhoneGeneric(phone: string, dialCode: string, pattern: string, maxLength: number): string {
  const cleaned = cleanPhoneNumber(phone);
  let digits = cleaned;
  
  // Remove dial code if present
  if (cleaned.startsWith(`+${dialCode}`)) {
    digits = cleaned.slice(dialCode.length + 1);
  } else if (cleaned.startsWith(dialCode)) {
    digits = cleaned.slice(dialCode.length);
  }
  
  digits = extractDigits(digits);
  
  if (digits.length === 0) return "";
  
  // Limit to max length
  if (digits.length > maxLength) {
    digits = digits.slice(0, maxLength);
  }
  
  // Format with pattern if provided
  if (pattern && digits.length >= pattern.replace(/[^Xx]/g, "").length) {
    return formatWithPattern(digits, pattern);
  }
  
  return digits;
}

/**
 * Generic phone validator
 */
function validatePhoneGeneric(
  phone: string,
  dialCode: string,
  minLength: number,
  maxLength: number,
  pattern?: RegExp,
  customValidator?: (digits: string) => string | null
): { isValid: boolean; errorMessage: string | null } {
  const cleaned = cleanPhoneNumber(phone);
  let digits = cleaned;
  
  // Remove dial code if present
  if (cleaned.startsWith(`+${dialCode}`)) {
    digits = cleaned.slice(dialCode.length + 1);
  } else if (cleaned.startsWith(dialCode)) {
    digits = cleaned.slice(dialCode.length);
  }
  
  digits = extractDigits(digits);
  
  if (digits.length === 0) {
    return { isValid: false, errorMessage: "Phone number is required" };
  }
  
  if (digits.length < minLength) {
    return { isValid: false, errorMessage: `Phone number must be at least ${minLength} digits` };
  }
  
  if (digits.length > maxLength) {
    return { isValid: false, errorMessage: `Phone number must be at most ${maxLength} digits` };
  }
  
  // Pattern validation
  if (pattern && !pattern.test(digits)) {
    return { isValid: false, errorMessage: "Invalid phone number format" };
  }
  
  // Custom validator
  if (customValidator) {
    const customError = customValidator(digits);
    if (customError) {
      return { isValid: false, errorMessage: customError };
    }
  }
  
  return { isValid: true, errorMessage: null };
}

/**
 * Country registry with all country information
 */
export const COUNTRY_REGISTRY: Record<CountryCode, CountryInfo> = {
  // United States
  US: {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    dialCode: "1",
    format: (phone) => formatPhoneGeneric(phone, "1", "(XXX) XXX-XXXX", 10),
    validate: (phone) => {
      const result = validatePhoneGeneric(phone, "1", 10, 10, undefined, (digits) => {
        const areaCode = digits.slice(0, 3);
        const exchangeCode = digits.slice(3, 6);
        if (areaCode[0] === "0" || areaCode[0] === "1") {
          return "Area code cannot start with 0 or 1";
        }
        if (exchangeCode[0] === "0" || exchangeCode[0] === "1") {
          return "Exchange code cannot start with 0 or 1";
        }
        return null;
      });
      return result;
    },
    placeholder: "(555) 123-4567",
    hint: "10-digit number (e.g., (555) 123-4567)",
    minLength: 10,
    maxLength: 10,
  },
  
  // India
  IN: {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    dialCode: "91",
    format: (phone) => formatPhoneGeneric(phone, "91", "XXXXX XXXXX", 10),
    validate: (phone) => {
      const result = validatePhoneGeneric(phone, "91", 10, 10, /^[6-9]\d{9}$/, undefined);
      if (!result.isValid && result.errorMessage === "Invalid phone number format") {
        return { isValid: false, errorMessage: "Indian mobile numbers must start with 6, 7, 8, or 9" };
      }
      return result;
    },
    placeholder: "98765 43210",
    hint: "10-digit mobile number (e.g., 98765 43210)",
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
  },
  
  // United Kingdom
  GB: {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    dialCode: "44",
    format: (phone) => formatPhoneGeneric(phone, "44", "XXXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "44", 10, 10),
    placeholder: "7700 123456",
    hint: "10-digit number (e.g., 7700 123456)",
    minLength: 10,
    maxLength: 10,
  },
  
  // Canada
  CA: {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    dialCode: "1",
    format: (phone) => formatPhoneGeneric(phone, "1", "(XXX) XXX-XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "1", 10, 10),
    placeholder: "(555) 123-4567",
    hint: "10-digit number (e.g., (555) 123-4567)",
    minLength: 10,
    maxLength: 10,
  },
  
  // Australia
  AU: {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    dialCode: "61",
    format: (phone) => formatPhoneGeneric(phone, "61", "XXXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "61", 9, 9),
    placeholder: "412 345 678",
    hint: "9-digit number (e.g., 412 345 678)",
    minLength: 9,
    maxLength: 9,
  },
  
  // Germany
  DE: {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    dialCode: "49",
    format: (phone) => formatPhoneGeneric(phone, "49", "XXXX XXXXXXX", 11),
    validate: (phone) => validatePhoneGeneric(phone, "49", 10, 11),
    placeholder: "1512 3456789",
    hint: "10-11 digit number",
    minLength: 10,
    maxLength: 11,
  },
  
  // France
  FR: {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    dialCode: "33",
    format: (phone) => formatPhoneGeneric(phone, "33", "X XX XX XX XX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "33", 9, 9),
    placeholder: "6 12 34 56 78",
    hint: "9-digit number (e.g., 6 12 34 56 78)",
    minLength: 9,
    maxLength: 9,
  },
  
  // Italy
  IT: {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    dialCode: "39",
    format: (phone) => formatPhoneGeneric(phone, "39", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "39", 9, 10),
    placeholder: "312 345 6789",
    hint: "9-10 digit number",
    minLength: 9,
    maxLength: 10,
  },
  
  // Spain
  ES: {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    dialCode: "34",
    format: (phone) => formatPhoneGeneric(phone, "34", "XXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "34", 9, 9),
    placeholder: "612 345 678",
    hint: "9-digit number (e.g., 612 345 678)",
    minLength: 9,
    maxLength: 9,
  },
  
  // Netherlands
  NL: {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    dialCode: "31",
    format: (phone) => formatPhoneGeneric(phone, "31", "X XXXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "31", 9, 9),
    placeholder: "6 1234 5678",
    hint: "9-digit number (e.g., 6 1234 5678)",
    minLength: 9,
    maxLength: 9,
  },
  
  // Belgium
  BE: {
    code: "BE",
    name: "Belgium",
    flag: "🇧🇪",
    dialCode: "32",
    format: (phone) => formatPhoneGeneric(phone, "32", "XXX XX XX XX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "32", 9, 9),
    placeholder: "470 12 34 56",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Switzerland
  CH: {
    code: "CH",
    name: "Switzerland",
    flag: "🇨🇭",
    dialCode: "41",
    format: (phone) => formatPhoneGeneric(phone, "41", "XX XXX XX XX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "41", 9, 9),
    placeholder: "79 123 45 67",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Austria
  AT: {
    code: "AT",
    name: "Austria",
    flag: "🇦🇹",
    dialCode: "43",
    format: (phone) => formatPhoneGeneric(phone, "43", "XXXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "43", 10, 13),
    placeholder: "664 123456",
    hint: "10-13 digit number",
    minLength: 10,
    maxLength: 13,
  },
  
  // Sweden
  SE: {
    code: "SE",
    name: "Sweden",
    flag: "🇸🇪",
    dialCode: "46",
    format: (phone) => formatPhoneGeneric(phone, "46", "XX-XXX XX XX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "46", 9, 9),
    placeholder: "70-123 45 67",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Norway
  NO: {
    code: "NO",
    name: "Norway",
    flag: "🇳🇴",
    dialCode: "47",
    format: (phone) => formatPhoneGeneric(phone, "47", "XXX XX XXX", 8),
    validate: (phone) => validatePhoneGeneric(phone, "47", 8, 8),
    placeholder: "412 34 567",
    hint: "8-digit number",
    minLength: 8,
    maxLength: 8,
  },
  
  // Denmark
  DK: {
    code: "DK",
    name: "Denmark",
    flag: "🇩🇰",
    dialCode: "45",
    format: (phone) => formatPhoneGeneric(phone, "45", "XX XX XX XX", 8),
    validate: (phone) => validatePhoneGeneric(phone, "45", 8, 8),
    placeholder: "20 12 34 56",
    hint: "8-digit number",
    minLength: 8,
    maxLength: 8,
  },
  
  // Finland
  FI: {
    code: "FI",
    name: "Finland",
    flag: "🇫🇮",
    dialCode: "358",
    format: (phone) => formatPhoneGeneric(phone, "358", "XX XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "358", 9, 10),
    placeholder: "50 123 4567",
    hint: "9-10 digit number",
    minLength: 9,
    maxLength: 10,
  },
  
  // Poland
  PL: {
    code: "PL",
    name: "Poland",
    flag: "🇵🇱",
    dialCode: "48",
    format: (phone) => formatPhoneGeneric(phone, "48", "XXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "48", 9, 9),
    placeholder: "512 345 678",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Czech Republic
  CZ: {
    code: "CZ",
    name: "Czech Republic",
    flag: "🇨🇿",
    dialCode: "420",
    format: (phone) => formatPhoneGeneric(phone, "420", "XXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "420", 9, 9),
    placeholder: "601 123 456",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Ireland
  IE: {
    code: "IE",
    name: "Ireland",
    flag: "🇮🇪",
    dialCode: "353",
    format: (phone) => formatPhoneGeneric(phone, "353", "XX XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "353", 9, 9),
    placeholder: "85 123 4567",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Portugal
  PT: {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    dialCode: "351",
    format: (phone) => formatPhoneGeneric(phone, "351", "XXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "351", 9, 9),
    placeholder: "912 345 678",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Greece
  GR: {
    code: "GR",
    name: "Greece",
    flag: "🇬🇷",
    dialCode: "30",
    format: (phone) => formatPhoneGeneric(phone, "30", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "30", 10, 10),
    placeholder: "694 123 4567",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Russia
  RU: {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    dialCode: "7",
    format: (phone) => formatPhoneGeneric(phone, "7", "(XXX) XXX-XX-XX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "7", 10, 10),
    placeholder: "(912) 345-67-89",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Turkey
  TR: {
    code: "TR",
    name: "Turkey",
    flag: "🇹🇷",
    dialCode: "90",
    format: (phone) => formatPhoneGeneric(phone, "90", "(XXX) XXX XX XX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "90", 10, 10),
    placeholder: "(532) 123 45 67",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Saudi Arabia
  SA: {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    dialCode: "966",
    format: (phone) => formatPhoneGeneric(phone, "966", "X XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "966", 9, 9),
    placeholder: "5 012 3456",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // United Arab Emirates
  AE: {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    dialCode: "971",
    format: (phone) => formatPhoneGeneric(phone, "971", "X XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "971", 9, 9),
    placeholder: "50 123 4567",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Israel
  IL: {
    code: "IL",
    name: "Israel",
    flag: "🇮🇱",
    dialCode: "972",
    format: (phone) => formatPhoneGeneric(phone, "972", "XX-XXX-XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "972", 9, 9),
    placeholder: "50-123-4567",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Japan
  JP: {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    dialCode: "81",
    format: (phone) => formatPhoneGeneric(phone, "81", "XX-XXXX-XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "81", 10, 10),
    placeholder: "90-1234-5678",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // China
  CN: {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    dialCode: "86",
    format: (phone) => formatPhoneGeneric(phone, "86", "XXX XXXX XXXX", 11),
    validate: (phone) => validatePhoneGeneric(phone, "86", 11, 11),
    placeholder: "138 1234 5678",
    hint: "11-digit number",
    minLength: 11,
    maxLength: 11,
  },
  
  // South Korea
  KR: {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    dialCode: "82",
    format: (phone) => formatPhoneGeneric(phone, "82", "XX-XXXX-XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "82", 10, 10),
    placeholder: "10-1234-5678",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Singapore
  SG: {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    dialCode: "65",
    format: (phone) => formatPhoneGeneric(phone, "65", "XXXX XXXX", 8),
    validate: (phone) => validatePhoneGeneric(phone, "65", 8, 8),
    placeholder: "9123 4567",
    hint: "8-digit number",
    minLength: 8,
    maxLength: 8,
  },
  
  // Malaysia
  MY: {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    dialCode: "60",
    format: (phone) => formatPhoneGeneric(phone, "60", "XX-XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "60", 9, 10),
    placeholder: "12-345 6789",
    hint: "9-10 digit number",
    minLength: 9,
    maxLength: 10,
  },
  
  // Thailand
  TH: {
    code: "TH",
    name: "Thailand",
    flag: "🇹🇭",
    dialCode: "66",
    format: (phone) => formatPhoneGeneric(phone, "66", "XX-XXX-XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "66", 9, 9),
    placeholder: "81-234-5678",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Indonesia
  ID: {
    code: "ID",
    name: "Indonesia",
    flag: "🇮🇩",
    dialCode: "62",
    format: (phone) => formatPhoneGeneric(phone, "62", "XXX-XXXX-XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "62", 10, 11),
    placeholder: "812-3456-7890",
    hint: "10-11 digit number",
    minLength: 10,
    maxLength: 11,
  },
  
  // Philippines
  PH: {
    code: "PH",
    name: "Philippines",
    flag: "🇵🇭",
    dialCode: "63",
    format: (phone) => formatPhoneGeneric(phone, "63", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "63", 10, 10),
    placeholder: "912 345 6789",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Vietnam
  VN: {
    code: "VN",
    name: "Vietnam",
    flag: "🇻🇳",
    dialCode: "84",
    format: (phone) => formatPhoneGeneric(phone, "84", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "84", 9, 10),
    placeholder: "912 345 6789",
    hint: "9-10 digit number",
    minLength: 9,
    maxLength: 10,
  },
  
  // New Zealand
  NZ: {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    dialCode: "64",
    format: (phone) => formatPhoneGeneric(phone, "64", "XXX XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "64", 9, 9),
    placeholder: "21 123 4567",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // South Africa
  ZA: {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    dialCode: "27",
    format: (phone) => formatPhoneGeneric(phone, "27", "XX XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "27", 9, 9),
    placeholder: "82 123 4567",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Egypt
  EG: {
    code: "EG",
    name: "Egypt",
    flag: "🇪🇬",
    dialCode: "20",
    format: (phone) => formatPhoneGeneric(phone, "20", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "20", 10, 10),
    placeholder: "100 123 4567",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Nigeria
  NG: {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    dialCode: "234",
    format: (phone) => formatPhoneGeneric(phone, "234", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "234", 10, 10),
    placeholder: "802 123 4567",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Kenya
  KE: {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    dialCode: "254",
    format: (phone) => formatPhoneGeneric(phone, "254", "XXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "254", 9, 9),
    placeholder: "712 123 456",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Mexico
  MX: {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    dialCode: "52",
    format: (phone) => formatPhoneGeneric(phone, "52", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "52", 10, 10),
    placeholder: "551 234 5678",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Brazil
  BR: {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    dialCode: "55",
    format: (phone) => formatPhoneGeneric(phone, "55", "(XX) XXXXX-XXXX", 11),
    validate: (phone) => validatePhoneGeneric(phone, "55", 10, 11),
    placeholder: "(11) 91234-5678",
    hint: "10-11 digit number",
    minLength: 10,
    maxLength: 11,
  },
  
  // Argentina
  AR: {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    dialCode: "54",
    format: (phone) => formatPhoneGeneric(phone, "54", "XX XXXX-XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "54", 10, 10),
    placeholder: "11 1234-5678",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Chile
  CL: {
    code: "CL",
    name: "Chile",
    flag: "🇨🇱",
    dialCode: "56",
    format: (phone) => formatPhoneGeneric(phone, "56", "X XXXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "56", 9, 9),
    placeholder: "9 1234 5678",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Colombia
  CO: {
    code: "CO",
    name: "Colombia",
    flag: "🇨🇴",
    dialCode: "57",
    format: (phone) => formatPhoneGeneric(phone, "57", "XXX XXX XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "57", 10, 10),
    placeholder: "300 123 4567",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Peru
  PE: {
    code: "PE",
    name: "Peru",
    flag: "🇵🇪",
    dialCode: "51",
    format: (phone) => formatPhoneGeneric(phone, "51", "XXX XXX XXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "51", 9, 9),
    placeholder: "912 345 678",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Venezuela
  VE: {
    code: "VE",
    name: "Venezuela",
    flag: "🇻🇪",
    dialCode: "58",
    format: (phone) => formatPhoneGeneric(phone, "58", "XXX-XXX.XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "58", 10, 10),
    placeholder: "412-123.4567",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Pakistan
  PK: {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    dialCode: "92",
    format: (phone) => formatPhoneGeneric(phone, "92", "XXX-XXXXXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "92", 10, 10),
    placeholder: "300-1234567",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Bangladesh
  BD: {
    code: "BD",
    name: "Bangladesh",
    flag: "🇧🇩",
    dialCode: "880",
    format: (phone) => formatPhoneGeneric(phone, "880", "XXXX-XXXXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "880", 10, 10),
    placeholder: "1712-345678",
    hint: "10-digit number",
    minLength: 10,
    maxLength: 10,
  },
  
  // Sri Lanka
  LK: {
    code: "LK",
    name: "Sri Lanka",
    flag: "🇱🇰",
    dialCode: "94",
    format: (phone) => formatPhoneGeneric(phone, "94", "XX XXX XXXX", 9),
    validate: (phone) => validatePhoneGeneric(phone, "94", 9, 9),
    placeholder: "71 234 5678",
    hint: "9-digit number",
    minLength: 9,
    maxLength: 9,
  },
  
  // Default/Unknown - use USA format
  UNKNOWN: {
    code: "UNKNOWN",
    name: "Unknown",
    flag: "🇺🇸",
    dialCode: "1",
    format: (phone) => formatPhoneGeneric(phone, "1", "(XXX) XXX-XXXX", 10),
    validate: (phone) => validatePhoneGeneric(phone, "1", 10, 10),
    placeholder: "(555) 123-4567",
    hint: "10-digit number (e.g., (555) 123-4567)",
    minLength: 10,
    maxLength: 10,
  },
};

/**
 * Get country info by code
 */
export function getCountryInfo(code: CountryCode): CountryInfo {
  return COUNTRY_REGISTRY[code] || COUNTRY_REGISTRY.UNKNOWN;
}

/**
 * Get country code from country name (case-insensitive)
 */
export function getCountryCodeFromName(countryName: string): CountryCode {
  const normalized = countryName.toLowerCase().trim();
  
  // Direct mappings
  const countryMap: Record<string, CountryCode> = {
    "united states": "US",
    "usa": "US",
    "us": "US",
    "united states of america": "US",
    "india": "IN",
    "in": "IN",
    "united kingdom": "GB",
    "uk": "GB",
    "great britain": "GB",
    "canada": "CA",
    "australia": "AU",
    "germany": "DE",
    "france": "FR",
    "italy": "IT",
    "spain": "ES",
    "netherlands": "NL",
    "belgium": "BE",
    "switzerland": "CH",
    "austria": "AT",
    "sweden": "SE",
    "norway": "NO",
    "denmark": "DK",
    "finland": "FI",
    "poland": "PL",
    "czech republic": "CZ",
    "ireland": "IE",
    "portugal": "PT",
    "greece": "GR",
    "russia": "RU",
    "turkey": "TR",
    "saudi arabia": "SA",
    "united arab emirates": "AE",
    "uae": "AE",
    "israel": "IL",
    "japan": "JP",
    "china": "CN",
    "south korea": "KR",
    "singapore": "SG",
    "malaysia": "MY",
    "thailand": "TH",
    "indonesia": "ID",
    "philippines": "PH",
    "vietnam": "VN",
    "new zealand": "NZ",
    "south africa": "ZA",
    "egypt": "EG",
    "nigeria": "NG",
    "kenya": "KE",
    "mexico": "MX",
    "brazil": "BR",
    "argentina": "AR",
    "chile": "CL",
    "colombia": "CO",
    "peru": "PE",
    "venezuela": "VE",
    "pakistan": "PK",
    "bangladesh": "BD",
    "sri lanka": "LK",
  };
  
  // Check exact match
  if (countryMap[normalized]) {
    return countryMap[normalized];
  }
  
  // Check partial match
  for (const [key, code] of Object.entries(countryMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code;
    }
  }
  
  return "US"; // Default to USA
}

/**
 * Detect country from location data
 * Priority: addressDetails.country > nearestStore.region
 * Default: US (USA) if no location data available
 */
export function detectCountryFromLocation(locationData: LocationData | null): CountryCode {
  if (!locationData) {
    return "US"; // Default to USA when no location data
  }

  // First, try to get country from address details
  if (locationData.addressDetails?.country) {
    const countryCode = getCountryCodeFromName(locationData.addressDetails.country);
    if (countryCode !== "US" || locationData.addressDetails.country.toLowerCase().includes("united states")) {
      return countryCode;
    }
  }

  // Fallback to region from nearest store
  if (locationData.nearestStore?.region) {
    const region = locationData.nearestStore.region.toLowerCase();
    if (region === "india") {
      return "IN";
    }
    if (region === "usa") {
      return "US";
    }
  }

  return "US"; // Default to USA when location data exists but country cannot be determined
}

/**
 * Get phone placeholder based on country
 */
export function getPhonePlaceholder(country: CountryCode): string {
  return getCountryInfo(country).placeholder;
}

/**
 * Get phone format hint based on country
 */
export function getPhoneFormatHint(country: CountryCode): string {
  return getCountryInfo(country).hint;
}

/**
 * Get country flag emoji based on country code
 */
export function getCountryFlag(country: CountryCode): string {
  return getCountryInfo(country).flag;
}

/**
 * Get country name based on country code
 */
export function getCountryName(country: CountryCode): string {
  return getCountryInfo(country).name;
}

/**
 * Main validation function
 * Validates and formats phone number based on country
 */
export function validatePhoneNumber(
  phone: string,
  locationData: LocationData | null,
  config?: Partial<PhoneValidationConfig>
): PhoneValidationResult {
  // Detect country
  let country = config?.country || detectCountryFromLocation(locationData);
  
  // If country is unknown, try to infer from phone number format
  if (country === "UNKNOWN" && phone) {
    const cleaned = cleanPhoneNumber(phone);
    
    // Try to detect from dial code
    for (const [code, info] of Object.entries(COUNTRY_REGISTRY)) {
      if (code === "UNKNOWN") continue;
      if (cleaned.startsWith(`+${info.dialCode}`) || cleaned.startsWith(info.dialCode)) {
        country = code as CountryCode;
        break;
      }
    }
  }
  
  // Ensure we always have a valid country (default to US)
  if (country === "UNKNOWN") {
    country = "US";
  }
  
  const countryInfo = getCountryInfo(country);
  
  // Format phone number
  const formatted = countryInfo.format(phone);
  
  // Validate phone number
  const validation = countryInfo.validate(phone);
  
  return {
    isValid: validation.isValid,
    formatted,
    country,
    errorMessage: validation.errorMessage,
  };
}

/**
 * Get all supported countries
 */
export function getAllCountries(): CountryInfo[] {
  return Object.values(COUNTRY_REGISTRY).filter(country => country.code !== "UNKNOWN");
}

/**
 * Search countries by name
 */
export function searchCountries(query: string): CountryInfo[] {
  const normalized = query.toLowerCase();
  return getAllCountries().filter(country => 
    country.name.toLowerCase().includes(normalized) ||
    country.code.toLowerCase().includes(normalized)
  );
}
