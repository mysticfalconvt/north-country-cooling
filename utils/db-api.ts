// New API utility functions that replace Google Sheets
export async function getSiteData() {
  const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/site-data`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`);
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
  const url = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/links-data`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch links data: ${response.status} ${response.statusText}`);
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