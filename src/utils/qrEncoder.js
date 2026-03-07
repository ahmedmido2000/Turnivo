/**
 * QR Code Property ID Encoder/Decoder
 * Obfuscates property IDs in QR URLs using XOR + Base64URL encoding.
 * Same property ID always produces the same token (deterministic).
 */

const SECRET = 'turnivo_qr_secure_k3y_2026!@#';

/**
 * Encode a property ID into an obfuscated URL-safe token
 * @param {number|string} propertyId
 * @returns {string} URL-safe token
 */
export const encodePropertyId = (propertyId) => {
  try {
    const str = String(propertyId);
    
    // 1. Add some salt (noise) to make the input longer and more complex
    // This ensures that even for short IDs, the resulting token is long
    const saltPrefix = "TRN";
    const saltSuffix = "V2X";
    const version = "v1";
    const extendedStr = `${saltPrefix}${str}${version}${saltSuffix}`;
    
    let xored = '';
    for (let i = 0; i < extendedStr.length; i++) {
      xored += String.fromCharCode(extendedStr.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
    }
    
    // 2. Base64 URL-safe (replace +/= with URL-safe chars)
    return btoa(xored)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch {
    return String(propertyId);
  }
};

/**
 * Decode an obfuscated token back to the original property ID
 * @param {string} token
 * @returns {string|null} property ID or null if invalid
 */
export const decodePropertyId = (token) => {
  try {
    // Restore Base64 padding and URL-safe chars
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    
    const decoded = atob(base64);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
    }
    
    // 3. Remove salt to get the original ID
    // Format: TRN[ID]v1V2X
    if (result.startsWith("TRN") && result.endsWith("V2X")) {
      const extracted = result.substring(3, result.length - 5); // Remove TRN (3) and v1V2X (5)
      
      // Validate it's a number
      if (/^\d+$/.test(extracted)) return extracted;
    }
    
    return null;
  } catch {
    return null;
  }
};
