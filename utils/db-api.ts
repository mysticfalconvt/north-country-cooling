// New API utility functions that replace Google Sheets
export async function getSiteData() {
  const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/site-data`;
  console.log('🔍 getSiteData called, fetching from:', url);
  
  try {
    console.log('🌐 Making fetch request to site-data API...');
    const response = await fetch(url);
    console.log('📡 Site-data API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ Site-data API request failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`);
    }
    
    console.log('📄 Parsing site-data JSON response...');
    const data = await response.json();
    console.log('✅ Site-data fetched successfully:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error fetching site data:', error);
    
    // Return fallback data
    return {
      title: 'North Country Cooling',
      subTitle: '',
      mainContent1: '',
      mainContent2: '',
      learnMoreText: '',
      contactMeContent: '',
      callMe: '',
      emailMe: '',
      facebookMe: '',
      facebookPost: '',
      quotes: [],
    };
  }
}

export async function getLinksData(): Promise<string[]> {
  const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/links-data`;
  console.log('🔗 getLinksData called, fetching from:', url);
  
  try {
    console.log('🌐 Making fetch request to links-data API...');
    const response = await fetch(url);
    console.log('📡 Links-data API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ Links-data API request failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch links data: ${response.status} ${response.statusText}`);
    }
    
    console.log('📄 Parsing links-data JSON response...');
    const data = await response.json();
    console.log('✅ Links-data fetched successfully:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error fetching links data:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return [];
  }
}

// For backwards compatibility, keep the same function names
export const getSheetsData = getSiteData;