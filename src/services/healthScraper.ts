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
    You are a Medical Data Analyst. usage of "fire" as tags is forbidden unless it's literal fire.

    Article: ${article.title}
    Content: ${article.content}
    
    Task:
    1. VALIDATE: Is this article discussing actual research, studies, legislation about health, or medical findings regarding firefighters?
        - If it's just a general news story about a fire, output "IRRELEVANT".
    
    2. SUMMARIES:
        - card_summary: A single, punchy paragraph (max 220 chars) summarizing the findings.
        - full_summary: A comprehensive 5-paragraph summary:
            1. Methodology (How data was collected).
            2. Key Medical Findings.
            3. Statistical Significance/Details.
            4. Impact on Firefighters.
            5. Recommendations/Conclusion.
        - Include quotes if available.
    
    3. METADATA:
    - Region: (Global, North America, etc.)
    - Tags: 3 specific medical/scientific tags.
    
    Output JSON:
    {
        "relevant": boolean,
        "card_summary": "string",
        "full_summary": ["Para 1", "Para 2", "Para 3", "Para 4", "Para 5"],
        "region": "string",
        "tags": ["tag1", "tag2"]
    }
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const text = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();

        if (text.includes("IRRELEVANT")) {
            console.log(`Filtered out as non-research (text): ${article.title}`);
            return;
        }

        const analysis = JSON.parse(text);

        if (!analysis.relevant) {
            console.log(`Filtered out as non-research (json): ${article.title} `);
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
            summary_bullets: analysis.full_summary.slice(0, 3), // Backward compat
            card_summary: analysis.card_summary,
            full_summary: analysis.full_summary,
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
