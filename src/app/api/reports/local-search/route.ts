import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ReportEntry {
  title: string;
  source: string;
  url: string;
  date: string;
  category: string;
  type: string;
  description?: string;
  citations?: number;
}

// Module-level in-memory cache to persist datasets across warm invocations in serverless environments
let aiCache: ReportEntry[] | null = null;
let web3Cache: ReportEntry[] | null = null;

function getDataset(corpus: 'ai' | 'web3'): ReportEntry[] {
  if (corpus === 'web3') {
    if (!web3Cache) {
      console.log('Loading web3-reports-data.json into server cache...');
      const filePath = path.join(process.cwd(), 'public/web3-reports-data.json');
      if (!fs.existsSync(filePath)) {
        throw new Error('Web3 database file not found on disk');
      }
      const data = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(data) as ReportEntry[];
      web3Cache = parsed;
      console.log(`Loaded ${parsed.length} Web3 reports into cache`);
    }
    return web3Cache as ReportEntry[];
  } else {
    if (!aiCache) {
      console.log('Loading ai-reports-data.json into server cache...');
      const filePath = path.join(process.cwd(), 'public/ai-reports-data.json');
      if (!fs.existsSync(filePath)) {
        throw new Error('AI database file not found on disk');
      }
      const data = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(data) as ReportEntry[];
      aiCache = parsed;
      console.log(`Loaded ${parsed.length} AI reports into cache`);
    }
    return aiCache as ReportEntry[];
  }
}

// Helper to parse dates like "Apr 2026", "2025", etc., for sorting
function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date(0);
  
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) return new Date(parsed);
  
  const match = dateStr.match(/\d{4}/);
  if (match) {
    const year = parseInt(match[0], 10);
    const monthStr = dateStr.slice(0, 3).toLowerCase();
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const month = months[monthStr] !== undefined ? months[monthStr] : 0;
    return new Date(year, month, 1);
  }
  
  return new Date(0);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';
  const category = searchParams.get('category')?.trim() || '';
  const corpus = (searchParams.get('corpus') || 'ai') as 'ai' | 'web3';
  const sort = searchParams.get('sort') || 'citations'; // 'citations' | 'date'
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

  try {
    const data = getDataset(corpus);

    // Apply filters
    let results = [...data]; // Copy the cache array to avoid in-memory mutations

    // Filter by category (exact match)
    if (category) {
      results = results.filter(item => item.category === category);
    }

    // Filter by query (multi-word match)
    if (query) {
      const queryTerms = query.split(/\s+/).filter(Boolean);
      results = results.filter(item => {
        const title = item.title.toLowerCase();
        const source = item.source.toLowerCase();
        const desc = item.description?.toLowerCase() || '';
        
        // Every term must be present in at least one of the fields
        return queryTerms.every(term => 
          title.includes(term) || source.includes(term) || desc.includes(term)
        );
      });
    }

    // Apply sorting
    if (sort === 'date') {
      results.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
    } else {
      // Default: sort by citations descending, then date descending
      results.sort((a, b) => {
        const citDiff = (b.citations || 0) - (a.citations || 0);
        if (citDiff !== 0) return citDiff;
        return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      });
    }

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      results: paginatedResults,
      total,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Local search error:', error);
    return NextResponse.json(
      { error: 'Failed to search local reports', details: error.message },
      { status: 500 }
    );
  }
}
