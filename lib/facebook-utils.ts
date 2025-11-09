/**
 * Converts a regular Facebook post URL to an embed URL
 * 
 * Input formats supported:
 * - https://www.facebook.com/PageName/posts/postId
 * - https://facebook.com/PageName/posts/postId
 * - https://m.facebook.com/PageName/posts/postId
 * 
 * Output format:
 * - https://www.facebook.com/plugins/post.php?href=ENCODED_URL&width=350&show_text=true&height=480&appId
 */
export function convertFacebookPostToEmbed(postUrl: string, options?: {
  width?: number;
  height?: number;
  showText?: boolean;
}): string {
  const { width = 350, height = 480, showText = true } = options || {};

  try {
    // Clean up the URL - handle different Facebook URL formats
    let cleanUrl = postUrl.trim();
    
    // Ensure it starts with https://
    if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://')) {
      if (cleanUrl.startsWith('www.facebook.com') || cleanUrl.startsWith('facebook.com') || cleanUrl.startsWith('m.facebook.com')) {
        cleanUrl = 'https://' + cleanUrl;
      } else {
        throw new Error('Invalid Facebook URL format');
      }
    }
    
    // Normalize different Facebook domains to www.facebook.com
    cleanUrl = cleanUrl.replace(/^https?:\/\/(m\.|mobile\.|touch\.)?facebook\.com/, 'https://www.facebook.com');

    // Validate that it's a Facebook post URL
    const facebookPostRegex = /^https:\/\/www\.facebook\.com\/[^\/]+\/posts\/[^\/\?]+/;
    if (!facebookPostRegex.test(cleanUrl)) {
      throw new Error('URL must be a Facebook post URL in format: facebook.com/PageName/posts/postId');
    }

    // URL encode the post URL for the embed parameter
    const encodedUrl = encodeURIComponent(cleanUrl);

    // Construct the embed URL
    const embedUrl = `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&width=${width}&show_text=${showText}&height=${height}&appId`;

    return embedUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to convert Facebook URL: ${errorMessage}`);
  }
}

/**
 * Validates if a string is a valid Facebook post URL
 */
export function isValidFacebookPostUrl(url: string): boolean {
  try {
    convertFacebookPostToEmbed(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts the post ID from a Facebook post URL
 */
export function extractFacebookPostId(url: string): string | null {
  try {
    const match = url.match(/\/posts\/([^\/\?]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Extracts the page name from a Facebook post URL
 */
export function extractFacebookPageName(url: string): string | null {
  try {
    const match = url.match(/facebook\.com\/([^\/]+)\/posts\//);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}