/**
 * Helper functions for vehicle details modal
 */

/**
 * Truncate description text intelligently at word boundaries
 * @param text - The text to truncate
 * @param maxLength - Maximum length in characters (default: 150)
 * @returns Truncated text
 */
export const truncateDescription = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  
  // Find the last space before the max length to avoid cutting words
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;
};

/**
 * Determine if a description should show the "read more" button
 * @param text - The text to evaluate
 * @param maxLength - Maximum length threshold (default: 150)
 * @returns Boolean indicating if read more should be shown
 */
export const shouldShowReadMore = (text: string, maxLength: number = 150): boolean => {
  return Boolean(text && text.trim() !== "" && text.length > maxLength);
};