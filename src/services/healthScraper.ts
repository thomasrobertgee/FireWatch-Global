// @ts-ignore
import NewsAPI from 'newsapi';
import fetch, { Headers, Request, Response } from 'node-fetch'; // Polyfill fetch for Node environment

if (!globalThis.fetch) {
    globalThis.fetch = fetch as any;
    globalThis.Headers = Headers as any;
    globalThis.Request = Request as any;
    globalThis.Response = Response as any;
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase, DBArticle } from '@/lib/supabase';
import { generateSlug } from '@/lib/slug';

// Helper for PubMed (using standard newsapi for now as primary source due to env constraints, 
// but queries will be highly scientific)

let newsapi: any;
let genAI: GoogleGenerativeAI;
let model: any;

function initClients() {
    if (newsapi) return;

    const newsKey = process.env.NEWS_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!newsKey || !geminiKey) throw new Error('API Keys missing');

    newsapi = new NewsAPI(newsKey);
    genAI = new GoogleGenerativeAI(geminiKey);

    // Use the advanced model for reading complex text
    model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
    });
}

export async function fetchHealthResearch() {
    initClients();
    console.log('🔬 Fetching Medical/Scientific Data...');

    // Strict scientific query
    const results = await newsapi.v2.everything({
        q: '(firefighter AND (cancer OR carcinogen OR "occupational health" OR toxicology OR PFAS))',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 5 // Quality over quantity
    });

    return results.articles.map((a: any) => ({
        title: a.title,
        url: a.url,
        source: a.source.name,
        content: a.description || ''
    }));
}

export async function processHealthArticle(article: any) {
    initClients();

    if (!supabase) throw new Error('Supabase client not initialized');

    // Check Dupes
    const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('source_url', article.url)
        .single();

    if (existing) {
        console.log(`Skipping duplicate study: ${article.title} `);
        return;
    }

    console.log(`🧬 Analyzing Study: ${article.title} `);

    const prompt = `
    You are a Medical Data Analyst.usage of "fire" as tags is forbidden unless it's literal fire.

Article: ${article.title}
Content: ${article.content}

Task:
1. VALIDATE: Is this article discussing actual research, studies, legislation about health, or medical findings regarding firefighters ?
    - If it's just a general news story about a fire, output "IRRELEVANT".

2. SUMMARIZE: Create exactly 3 bullet points with these EXACT headers:
- Methodology: (How was the data collected ? or 'Analysis of...')
- Findings: (What are the medical facts ?)
- Impact on Firefighters: (What does this mean for the profession ?)

    3. METADATA:
- Region: (Global, North America, etc.)
- Tags: 3 specific medical / scientific tags(e.g.PFAS, Carcinogens, Legislation).

    Output JSON:
{
    "relevant": boolean,
        "summary_bullets": ["Methodology: ...", "Findings: ...", "Impact on Firefighters: ..."],
            "region": string,
                "tags": ["tag1", "tag2", "tag3"]
}
`;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const text = result.response.text().replace(/```json | ```/g, '').trim();
        const analysis = JSON.parse(text);

        if (!analysis.relevant) {
            console.log(`Filtered out as non - research: ${article.title} `);
            return;
        }

        const slug = generateSlug(article.title);

        await supabase.from('articles').insert({
            title: article.title,
            slug: slug,
            source_url: article.url,
            source_name: article.source,
            full_text: article.content,
            category: 'Health_Research', // Forced Category
            summary_bullets: analysis.summary_bullets,
            region: analysis.region,
            tags: analysis.tags
        });

        console.log(`✅ Saved Health Ledger Entry: ${article.title} `);

    } catch (e) {
        console.error(`Failed to process ${article.title} `, e);
    }
}

export async function runHealthScraper() {
    const articles = await fetchHealthResearch();
    for (const a of articles) {
        await processHealthArticle(a);
    }
}
