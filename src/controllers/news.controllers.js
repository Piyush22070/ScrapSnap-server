import axios from 'axios';
import { load } from 'cheerio';
import { asyncHandlers } from '../utils/asyncHandler.utils.js';
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {storeToDb} from '../db/index.db.js'


const news = asyncHandlers(async (req, res) => {

    const articles = [];

    // Web Scrap
    try{
        // Api Call 
        const response = await axios.get('https://www.bbc.com/news', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
        });
    

        const $ = load(response.data);

        // Main selectors
        const mainSelectors = [
        '[data-testid="card-headline"]',
        '[data-testid="edinburgh-card"]', 
        '.gs-c-promo',
        'a[href*="/news/"]'
        ];

        // Extract articles
        for (const selector of mainSelectors) {
        $(selector).each((index, element) => {
            if (articles.length >= 50) return false;
            
            const $element = $(element);
            
            // Get title
            let title = $element
            .find('h1, h2, h3')
            .first().text().trim() || $element.text().trim();
            
            // Get URL
            let url = $element
            .find('a').first().attr('href') || $element.attr('href');
            
            if (url && !url.startsWith('http')) {
            url = `https://www.bbc.com${url}`;
            }
        
            // Get image
            const image = $element.find('img').first().attr('src') || null;
            
            // Get summary
            const summary = $element.find('p').first().text().trim() || "No summary available";
            
            // Validate and add article
            if (title && url && title.length > 10 && url.includes('/news/')) {
            const isDuplicate = articles.some(article => 
                article.title === title || article.url === url
            );
          
            if (!isDuplicate) {
                articles.push({
                title: title,
                url: url,
                image: image,
                summary: summary,
                source: "BBC News",
                "News Date": new Date().toISOString(),
                category: "General"
                });
            }
            }
      });
      
      if (articles.length > 0) break;
    }
    }
    catch{
        throw new ApiError(500,"Web Scrap Failed !")
    }

    // checking 
    console.log("Requested to Server");
    console.log("No of Article send:", articles.length);

    // Storing to Database
    storeToDb(articles)

    // Response 
    res
    .status(200)
    .json(
      new ApiResponse(200,articles,"Scraped BBC News headlines")
    );

});

export { news };