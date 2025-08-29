#!/usr/bin/env tsx

import { convertFacebookPostToEmbed, isValidFacebookPostUrl, extractFacebookPostId, extractFacebookPageName } from '../lib/facebook-utils';

// Test URLs
const testUrls = [
  'https://www.facebook.com/NorthCountryCooling/posts/pfbid02Aru749n4JBCQ8rd1JBQeAPbpGFfvAa1YrdvDRvheoSqS4PGyEaqkBRE3CJE84AWrl',
  'https://www.facebook.com/NorthCountryCooling/posts/pfbid08Z8aV1JiKugR3YRwnHBAy6at7UgkcmDYBEq7THEawTzvwvNK5a8ghiS4bU9TKyZTl',
  'facebook.com/NorthCountryCooling/posts/pfbid02Aru749n4JBCQ8rd1JBQeAPbpGFfvAa1YrdvDRvheoSqS4PGyEaqkBRE3CJE84AWrl',
  'm.facebook.com/NorthCountryCooling/posts/pfbid02Aru749n4JBCQ8rd1JBQeAPbpGFfvAa1YrdvDRvheoSqS4PGyEaqkBRE3CJE84AWrl',
];

// Expected embed URL for comparison
const expectedEmbed = 'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FNorthCountryCooling%2Fposts%2Fpfbid08Z8aV1JiKugR3YRwnHBAy6at7UgkcmDYBEq7THEawTzvwvNK5a8ghiS4bU9TKyZTl&width=350&show_text=true&height=480&appId';

console.log('🧪 Testing Facebook URL Converter\n');

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: ${url}`);
  console.log(`Valid: ${isValidFacebookPostUrl(url)}`);
  
  if (isValidFacebookPostUrl(url)) {
    const embedUrl = convertFacebookPostToEmbed(url);
    console.log(`Embed: ${embedUrl}`);
    console.log(`Page: ${extractFacebookPageName(url)}`);
    console.log(`Post ID: ${extractFacebookPostId(url)}`);
    
    // Check if second URL matches expected
    if (index === 1) {
      console.log(`Matches expected: ${embedUrl === expectedEmbed ? '✅' : '❌'}`);
      if (embedUrl !== expectedEmbed) {
        console.log(`Expected: ${expectedEmbed}`);
      }
    }
  }
  
  console.log('');
});