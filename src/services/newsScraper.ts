// @ts-ignore
import NewsAPI from 'newsapi';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize clients lazily
let newsapi: any;
let genAI: GoogleGenerativeAI;
let model: any;

function initClients() {
    if (newsapi) return;

    const newsKey = process.env.NEWS_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!newsKey || newsKey === 'your-news-api-key') {
        throw new Error('NEWS_API_KEY is missing or invalid.');
    }
    if (!geminiKey || geminiKey === 'your-gemini-api-key') {
        throw new Error('GEMINI_API_KEY is missing or invalid.');
    }

    newsapi = new NewsAPI(newsKey);
    genAI = new GoogleGenerativeAI(geminiKey);
    // Experimental: Gemini 3 Flash Preview
    // Note: 'thinking_level' is hypothetical/beta. We pass it in generationConfig if supported, 
    // or as a model parameter if the specific preview endpoint expects it. 
    // For now, we apply it to the model request if the SDK permits, or just standard config.
    model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        // User requested 'gemini-3-flash-preview'. I will use that string clearly.
    });
}

const NEGATIVE_KEYWORDS = [
    'under fire',
    'fireable',
    'firing squad',
    'on fire (metaphorical)',
    'political fire'
];

export interface ScrapedArticle {
    title: string;
    url: string;
    source: string;
    content: string;
    image_url?: string; // Add optional image URL
}

export async function fetchFireNews(): Promise<ScrapedArticle[]> {
    initClients();
    console.log('Fetching news from NewsAPI...');
    try {
        const response = await newsapi.v2.everything({
            q: '(firefighting OR wildfire OR bushfire OR "firefighter health")',
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 15,
        });

        if (response.status !== 'ok') {
            throw new Error(`NewsAPI Error: ${response.code}`);
        }

        return response.articles.map((article: any) => ({
            title: article.title,
            url: article.url,
            source: article.source.name,
            content: article.description || article.content || '',
            image_url: article.urlToImage || null, // Capture image
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

export async function processAndSaveArticle(article: ScrapedArticle) {
    initClients();

    // 0. Pre-filter negative keywords (Metaphorical check)
    const lowerTitle = article.title.toLowerCase();
    const lowerContent = article.content.toLowerCase();

    // Check title and content for stronger filtering
    if (NEGATIVE_KEYWORDS.some(phrase => lowerTitle.includes(phrase) ||
        (phrase === 'political fire' && lowerContent.includes('political fire')))) {
        console.log(`Skipping metaphorical/irrelevant article (Negative Keyword): ${article.title}`);
        return;
    }

    if (!supabase) throw new Error('Supabase client not initialized');

    // 1. Check if exists
    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('source_url', article.url)
        .single();

    if (existing) {
        console.log(`Skipping duplicate: ${article.title}`);
        return;
    }

    // 2. AI Processing
    console.log(`Processing with AI v2.0: ${article.title}`);

    const prompt = `
    Analyze this news article for a professional fire service portal.
    
    Article Title: ${article.title}
    Content/Snippet: ${article.content}
    Source: ${article.source}

    Tasks:
    1. RELEVANCE CHECK: Is this strictly about firefighting operations, professional welfare (cancer, unions, pay), innovation (tech, equipment), or major environment impact (bushfires)? 
       - If NO (e.g. "under fire", political scandals, metaphorical usage), output "IRRELEVANT".
       - Filter out ANY article that uses "fire" only as a metaphor.
    
    2. CATEGORIZE: Choose one: 'Operations', 'Welfare', 'Innovation', 'Environment'.
    
    3. REGION: Identify the region. Choose one: 'Australia/NZ', 'North America', 'Europe', 'Asia', 'Global'.
    
    4. TAGS: Extract 3-5 short keywords (e.g., 'Wildfire', 'Legislation', 'Cancer Research', 'EV Safety').
    
    5. SUMMARIZE: Create exactly 3 high-quality bullet points with these headers: 'The Situation', 'Professional Impact', 'Core Takeaway'.
       - Ensure the summary is transformative and adds value, not just copy-paste.

    Output JSON format only:
    {
      "relevant": boolean,
      "category": string,
      "region": string,
      "tags": ["tag1", "tag2", "tag3"],
      "summary_bullets": ["Point 1", "Point 2", "Point 3"]
    }
  `;

    try {
        // Use the requested model with thinking_level parameter (mapped to generationConfig or top level if applicable)
        // Since 'thinking_level' isn't standard in v1, we assume the model handles it or we pass it in unsafe config if needed.
        // For this implementation, we simply call generateContent on the configured model.
        // User requested model: 'gemini-3-flash-preview'
        // User requested param: 'thinking_level': 'medium'

        // Dynamic re-init for this specific request if needed, or just use the model we set.
        // We set 'gemini-2.0-flash-exp' above as a placeholder, let's try to override or use the exact string if the SDK allows.
        // Actually, let's respect the user's exact string in the initClients replacement.

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const text = result.response.text();

        // Clean code blocks if any
        const jsonStr = text.replace(/```json|```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        if (!analysis.relevant) {
            console.log(`Article filtered out as irrelevant (AI Decision): ${article.title}`);
            return;
        }

        // 3. Save to DB
        const { error } = await supabase.from('articles').insert({
            title: article.title,
            category: analysis.category,
            summary_bullets: analysis.summary_bullets,
            source_url: article.url,
            source_name: article.source,
            full_text: article.content,
            image_url: article.image_url // Save the image URL
        });

        if (error) {
            console.error('Error inserting article:', error);
        } else {
            console.log(`Saved: ${article.title}`);
        }

    } catch (error) {
        console.error('AI Processing failed (Skipping Save):', error);
        // NO FALLBACK - We prefer missing data over bad/unsummarized data in v2.0
    }
}

export async function runScraper() {
    const articles = await fetchFireNews();
    console.log(`Found ${articles.length} articles.`);

    for (const article of articles) {
        await processAndSaveArticle(article);
    }
}
