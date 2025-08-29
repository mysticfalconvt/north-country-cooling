// New API utility functions that replace Google Sheets
export async function getSiteData() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/site-data`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch site data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching site data:', error);
    
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
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/links-data`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch links data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching links data:', error);
    return [];
  }
}

// For backwards compatibility, keep the same function names
export const getSheetsData = getSiteData;