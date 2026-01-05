/**
 * Convert Firebase Timestamp to Date
 */
export function convertToDate(timestamp: any): Date | undefined {
  if (!timestamp) return undefined
  
  // Handle Firebase Timestamp object
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return timestamp.toDate()
  }
  
  // Handle Firebase Timestamp plain object { seconds, nanoseconds }
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000)
  }
  
  // Fallback to string/date parsing
  return new Date(timestamp)
}
