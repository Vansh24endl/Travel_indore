import axios from 'axios'
import { listDestinations } from '../../src/Data/Database'

interface TravelPlace {
    name: string
    rating: number
    location: string
    mapUrl: string
    category?: string
}

// Indore rich local mock database for local development without API keys
const LOCAL_MOCK_PLACES: Record<string, TravelPlace[]> = {
    'Vijay Nagar': [
        { name: 'Shreemaya Residency Restaurant', rating: 4.5, location: 'AB Road, Vijay Nagar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shreemaya+Residency+Indore' },
        { name: 'Nafees Restaurant', rating: 4.4, location: 'Vijay Nagar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nafees+Restaurant+Vijay+Nagar+Indore' },
        { name: 'The Square - Novotel', rating: 4.6, location: 'SGS Area, Vijay Nagar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Square+Novotel+Indore' },
        { name: 'Vijay Nagar Chaupati', rating: 4.3, location: 'Vijay Nagar Sector C, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vijay+Nagar+Chaupati+Indore' }
    ],
    'Sarafa': [
        { name: 'Joshi Dahi Bada House', rating: 4.8, location: 'Sarafa Bazar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Joshi+Dahi+Bada+House+Indore' },
        { name: 'Vijay Chaat House', rating: 4.6, location: 'Sarafa Bazar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vijay+Chaat+House+Indore' },
        { name: 'Anoop Pan Kulfi', rating: 4.5, location: 'Sarafa Bazar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Anoop+Kulfi+Sarafa+Indore' }
    ],
    'Palasia': [
        { name: 'Chappan Dukan', rating: 4.7, location: 'New Palasia, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chappan+Dukan+Indore' },
        { name: 'Johny Hot Dog', rating: 4.8, location: 'Chappan Dukan, New Palasia, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Johny+Hot+Dog+Indore' },
        { name: 'Madhuram Sweets', rating: 4.6, location: 'New Palasia, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Madhuram+Sweets+Indore' }
    ],
    'Rajwada': [
        { name: 'Rajwada Palace', rating: 4.8, location: 'Rajwada, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajwada+Palace+Indore' },
        { name: 'Krishnapura Chhatris', rating: 4.5, location: 'Near Rajwada, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Krishnapura+Chhatris+Indore' },
        { name: 'Kanch Mandir', rating: 4.7, location: 'Itwaria Bazar, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kanch+Mandir+Indore' }
    ],
    'Khajrana': [
        { name: 'Khajrana Ganesh Temple', rating: 4.9, location: 'Khajrana, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khajrana+Ganesh+Temple+Indore' }
    ],
    'Indore': [
        { name: 'Rajwada Palace', rating: 4.8, location: 'Rajwada, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rajwada+Palace+Indore' },
        { name: 'Chappan Dukan', rating: 4.7, location: 'New Palasia, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chappan+Dukan+Indore' },
        { name: 'Khajrana Ganesh Temple', rating: 4.9, location: 'Khajrana, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khajrana+Ganesh+Temple+Indore' },
        { name: 'Lal Bagh Palace', rating: 4.5, location: 'Lalbagh Road, Indore', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lal+Bagh+Palace+Indore' }
    ]
}

// Local Keyword Parser (when Gemini is unavailable or not set up)
function parseQueryLocally(query: string): ExtractedQuery {
    const q = query.toLowerCase()

    // Extract intent
    let intent: 'food' | 'itinerary' | 'budget' | 'spiritual' | 'general' = 'general'
    if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('cafe') || q.includes('breakfast') || q.includes('lunch') || q.includes('dinner') || q.includes('chappan') || q.includes('sarafa')) {
        intent = 'food'
    } else if (q.includes('temple') || q.includes('spiritual') || q.includes('ganesh') || q.includes('mandir') || q.includes('church') || q.includes('mosque') || q.includes('god') || q.includes('khajrana') || q.includes('tekri')) {
        intent = 'spiritual'
    } else if (q.includes('budget') || q.includes('price') || q.includes('cost') || q.includes('cheap') || q.includes('hotels') || q.includes('spending')) {
        intent = 'budget'
    } else if (q.includes('itinerary') || q.includes('plan') || q.includes('trip') || q.includes('walkthrough') || q.includes('day') || q.includes('weekend')) {
        intent = 'itinerary'
    }

    // Extract location
    let location: string | null = null
    const locations = ['vijay nagar', 'rajwada', 'sarafa', 'palasia', 'khajrana', 'mhow', 'lalbagh', 'bhanwarkuan', 'lig']
    for (const loc of locations) {
        if (q.includes(loc)) {
            location = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            break
        }
    }

    // Extract days
    let days: number | null = null
    const daysMatch = q.match(/(\d+)\s*day/)
    if (daysMatch) {
        days = parseInt(daysMatch[1])
    }

    return {
        intent,
        location,
        city: 'Indore',
        days
    }
}

// Function to call Gemini API
async function callGemini(prompt: string, responseJson = false): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables.')
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ],
        generationConfig: responseJson ? { responseMimeType: 'application/json' } : undefined
    }

    const response = await axios.post(url, payload)
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// Phase 1: Query Extraction
interface ExtractedQuery {
    intent: 'food' | 'itinerary' | 'budget' | 'spiritual' | 'general'
    location: string | null
    city: string
    days: number | null
}

export async function extractQueryIntent(query: string): Promise<ExtractedQuery> {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return parseQueryLocally(query)
    }

    const prompt = `
Analyze the following travel-related query and extract structural search parameters.
Target city is strictly Indore. If no city is specified, or if another city is mentioned, assume Indore (Indore localities include Vijay Nagar, Rajwada, Sarafa, Palasia, Bhanwarkuan, LIG Colony, etc.).

Query: "${query}"

Return ONLY a valid JSON object matching this schema. Do not output code block wrappers or extra text.
{
  "intent": "food" | "itinerary" | "budget" | "spiritual" | "general",
  "location": "Locality/area name in Indore (e.g. Vijay Nagar, Sarafa) or null if none mentioned",
  "city": "Indore",
  "days": number or null
}
`
    try {
        const result = await callGemini(prompt, true)
        return JSON.parse(result.trim())
    } catch (error) {
        return parseQueryLocally(query)
    }
}

// Phase 2: Places Engine (Google Places with DB Fallback)
export async function getRealPlaces(extracted: ExtractedQuery): Promise<TravelPlace[]> {
    const mapsKey = process.env.GOOGLE_MAPS_API_KEY
    const searchArea = extracted.location ? `${extracted.location}, Indore` : 'Indore'

    let googleQuery = ''
    switch (extracted.intent) {
        case 'food':
            googleQuery = `restaurants near ${searchArea}`
            break
        case 'spiritual':
            googleQuery = `temples in ${searchArea}`
            break
        case 'budget':
            googleQuery = `budget hotels near ${searchArea}`
            break
        case 'itinerary':
        case 'general':
        default:
            googleQuery = `tourist attractions near ${searchArea}`
            break
    }

    // Attempt Google Places API if key is present
    if (mapsKey) {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/textsearch/json`,
                {
                    params: {
                        query: googleQuery,
                        key: mapsKey
                    }
                }
            )

            const results = response.data.results || []
            if (results.length > 0) {
                return results.slice(0, 4).map((place: any) => ({
                    name: place.name,
                    rating: place.rating || 4.0,
                    location: place.formatted_address || searchArea,
                    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.formatted_address || ''))}`
                }))
            }
        } catch (err) {
            console.warn('Google Places API call failed:', err)
        }
    }

    // Fallback 1: Local Mock Places database matching extracted location
    if (extracted.location && LOCAL_MOCK_PLACES[extracted.location]) {
        const mockList = LOCAL_MOCK_PLACES[extracted.location]
        if (extracted.intent === 'food') {
            return mockList.slice(0, 4) // Vijay Nagar list, etc.
        }
        return mockList.slice(0, 4)
    }

    // Fallback 2: Local database destinations
    try {
        const localDestinations = await listDestinations()
        let filtered = localDestinations

        // Filter by category map
        if (extracted.intent === 'food') {
            filtered = localDestinations.filter(d => d.category === 'food')
        } else if (extracted.intent === 'spiritual') {
            filtered = localDestinations.filter(d => d.category === 'spiritual')
        } else if (extracted.intent === 'general' || extracted.intent === 'itinerary') {
            filtered = localDestinations.filter(d => d.category === 'heritage' || d.category === 'nature')
        }

        // If location filter is present
        if (extracted.location) {
            const locRegex = new RegExp(extracted.location, 'i')
            const matchLoc = filtered.filter(d => locRegex.test(d.location) || locRegex.test(d.title) || locRegex.test(d.description))
            if (matchLoc.length > 0) {
                filtered = matchLoc
            }
        }

        if (filtered.length > 0) {
            return filtered.slice(0, 4).map(d => ({
                name: d.title,
                rating: d.rating || 4.5,
                location: d.location,
                mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.title + ' ' + d.location)}`,
                category: d.category
            }))
        }
    } catch (dbErr) {
        console.error('Local DB retrieval failed:', dbErr)
    }

    // Fallback 3: Return general Indore places from local mock database
    return LOCAL_MOCK_PLACES['Indore']
}

// Phase 4: Formatting and Response Generation
export async function generateAIResponse(query: string, extracted: ExtractedQuery, places: TravelPlace[]) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return buildMockResponse(query, extracted, places)
    }

    const hasPlaces = places.length > 0
    const placesDataStr = hasPlaces
        ? places.map(p => `- Name: ${p.name}, Rating: ${p.rating}★, Location: ${p.location}`).join('\n')
        : 'No specific local listings found.'

    const prompt = `
You are the Indore Travel AI Assistant. Answer the user's travel query about Indore.
Query: "${query}"
Intent: ${extracted.intent}
Target Location: ${extracted.location || 'Indore overall'}

Use this real-world place data for your response:
${placesDataStr}

Guidelines:
1. Provide a direct, engaging, and welcoming response.
2. Structure your reply nicely. Use headings with ### (e.g. ### Heading), bold text (**bold**), and list items starting with * (e.g. * **Item Name**: description).
3. Do NOT use markdown symbols other than ###, * and **. Do not write HTML tags.
4. Keep the text concise (max 3-4 bullet points or paragraphs).
5. At the very end of your response, append a clean JSON array of the places inside a code block starting with \`\`\`json. Output EXACTLY the schema:
\`\`\`json
[
  { "name": "...", "rating": 4.5, "location": "...", "mapUrl": "..." }
]
\`\`\`
Do not include any extra keys in the JSON block, and ensure it is valid JSON.
`

    try {
        const aiResponse = await callGemini(prompt)
        return parseResponseAndJSON(aiResponse, places)
    } catch (err) {
        return buildMockResponse(query, extracted, places)
    }
}

// Response parser to separate message text and JSON payload
function parseResponseAndJSON(aiText: string, places: TravelPlace[]) {
    const regex = /```json\s*([\s\S]*?)\s*```/
    const match = aiText.match(regex)

    let cleanText = aiText
    let parsedPlaces = places

    if (match) {
        cleanText = aiText.replace(regex, '').trim()
        try {
            parsedPlaces = JSON.parse(match[1].trim())
        } catch (e) {
            console.error('Failed to parse JSON blocks from Gemini response:', e)
        }
    }

    return {
        text: cleanText,
        places: parsedPlaces
    }
}

// Fallback Mock Response Generator (in case GEMINI_API_KEY is missing)
function buildMockResponse(query: string, extracted: ExtractedQuery, places: TravelPlace[]) {
    let reply = ''

    // Custom formatted text response matching locality and intent
    if (extracted.intent === 'food') {
        reply = `### 😋 Indore Food Recommendation:\nHere are some of the most famous food options around **${extracted.location || 'Indore'}**:\n\n`
    } else if (extracted.intent === 'spiritual') {
        reply = `### 🛕 Spiritual Spots in Indore:\nExplore these holy temples around **${extracted.location || 'Indore'}**:\n\n`
    } else if (extracted.intent === 'itinerary') {
        reply = `### 🏛️ Indore Travel Plan:\nHere is a recommended list of spots to visit in **${extracted.location || 'Indore'}**:\n\n`
    } else {
        reply = `### 🌟 Indore Travel Guide:\nHere is a list of recommended places for you in **${extracted.location || 'Indore'}**:\n\n`
    }

    if (places.length > 0) {
        places.forEach(p => {
            reply += `* **${p.name}**: Located at ${p.location}. Rated **${p.rating}★**.\n`
        })
    } else {
        reply += `* No local spots registered in this area. Try searching for Rajwada or Vijay Nagar!\n`
    }

    return {
        text: reply.trim(),
        places
    }
}
