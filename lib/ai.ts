export interface SearchFilters {
  location?: string;
  minRooms?: number;
  maxRooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-super-120b-a12b:free';

const SYSTEM_PROMPT = `You are a real estate search assistant for Nexter.
Extract search filters from the user's natural language query.
Return ONLY a valid JSON object (no markdown, no extra text) with these optional fields:
- location: string (city or country)
- minRooms: number
- maxRooms: number
- minPrice: number (in USD, no symbols)
- maxPrice: number (in USD, no symbols)
- minArea: number (in m²)
- maxArea: number (in m²)
Omit fields not mentioned. Return {} if no filters found.`;

export async function extractSearchFilters(query: string): Promise<SearchFilters> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not set');
  }

  const res = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      temperature: 0,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content ?? '{}';

  // Extract JSON even if wrapped in markdown
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return {};

  try {
    return JSON.parse(jsonMatch[0]) as SearchFilters;
  } catch {
    return {};
  }
}

export async function generatePropertyDescription(
  title: string,
  location: string,
  rooms: number,
  area: number
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

  const prompt = `Write a compelling 2-3 sentence property description for:
Title: ${title}
Location: ${location}
Rooms: ${rooms}
Area: ${area}m²
Keep it professional, evocative, and suitable for a luxury real estate listing.`;

  const res = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error('OpenRouter error');
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}
