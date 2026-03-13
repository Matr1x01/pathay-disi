export default function generateUniqueString() {
  // 1. Prefix: "PD"
  const prefix = 'PD';

  // 2. Today's date in int (timestamp in milliseconds)
  // Date.now() provides a precise timestamp, which helps with uniqueness.
  const timestampInt = Date.now();

  // 3. Generate a unique 8-character random string
  // This uses a cryptographically secure method where available for better uniqueness.
  const randomString = generateRandomAlphanumeric(8);

  // Combine the parts

  return `${prefix}-${timestampInt}-${randomString}`;
}

// Function to generate a random alphanumeric string of a specific length
function generateRandomAlphanumeric(length: number) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  // Use crypto.getRandomValues for cryptographically strong random numbers if available
  if (
    typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const randomArray = new Uint8Array(length);
    window.crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
      result += chars[number % chars.length];
    });
  } else {
    // Fallback to Math.random() if crypto API is not available (less unique, but works)
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
}
