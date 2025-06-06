import axios from 'axios';

export async function getKeywordRank(keyword, domain) {
  try {
    // Validate inputs
    if (!keyword || !domain) {
      throw new Error('Keyword and domain are required');
    }

    // Clean domain to remove protocol and www for better matching
    const cleanDomain = domain.replace(/(https?:\/\/)?(www\.)?/, '');

    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: keyword,
        api_key: process.env.SERPAPI_KEY,
        engine: 'google',
        num: 100,  // Get maximum allowed results
        hl: 'en',  // Language
        gl: 'us',  // Country
      },
      timeout: 10000,  // 10 second timeout
    });

    if (!response.data.organic_results) {
      console.warn('No organic results in SerpAPI response');
      return null;
    }

    // Find matching result with domain check
    const matchingResult = response.data.organic_results.find(result => {
      try {
        const resultUrl = new URL(result.link);
        return resultUrl.hostname.includes(cleanDomain);
      } catch {
        return false;
      }
    });
   
    return matchingResult?.position || null;

  } catch (error) {
    console.error('Error in getKeywordRank:', error.message);
    
    // Handle specific error cases
    if (error.response?.data?.error) {
      throw new Error(`SerpAPI error: ${error.response.data.error}`);
    }
    
    throw error;  // Re-throw for route handler to catch
  }
}