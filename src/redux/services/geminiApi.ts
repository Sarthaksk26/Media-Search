import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

// Initialize the Google Gen AI SDK
// Only initialize if we have a key to avoid crashes if the user hasn't set it yet.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Expand a search query using Gemini to get related keywords
 */
export const expandSearchQuery = async (query: string): Promise<string> => {
    if (!ai) return query; // Fallback to original query if no API key

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an AI assistant for a media search engine. The user searched for: "${query}". 
            Provide a comma-separated list of 3 to 5 optimized, broader, or highly related search keywords that would yield great visual results (photos/videos). 
            Do not include the original word unless necessary. Only return the comma-separated words, nothing else.`,
        });

        if (response.text) {
            // Return original query + AI expanded keywords
            return `${query}, ${response.text}`;
        }
        return query;
    } catch (error) {
        console.error("Gemini Search Expansion Error:", error);
        return query;
    }
};

/**
 * Generate a creative caption and tags for an image
 */
export const analyzeImage = async (imageUrl: string, title: string): Promise<{ caption: string, tags: string[] }> => {
    if (!ai) {
        return {
            caption: title || "A beautiful visual media.",
            tags: ["media", "visual"]
        };
    }

    try {
        // Fetch the image and convert it to base64
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        
        // Convert to base64 properly
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64Image = btoa(binary);

        const mimeType = response.headers.get('content-type') || 'image/jpeg';

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType
                    }
                },
                "Analyze this image. Provide a JSON response with two fields: 'caption' (a creative, detailed 1-2 sentence description) and 'tags' (an array of 3-5 relevant keywords). Do not include markdown formatting or backticks around the JSON."
            ]
        });

        const text = result.text || "{}";
        // Clean up potential markdown formatting from Gemini response
        const cleanJsonStr = text.replace(/```json\n?|```/g, '').trim();
        
        try {
            const parsed = JSON.parse(cleanJsonStr);
            return {
                caption: parsed.caption || title || "A beautiful visual media.",
                tags: parsed.tags || []
            };
        } catch (e) {
            console.error("Failed to parse Gemini JSON response:", e);
            return {
                caption: text,
                tags: []
            };
        }

    } catch (error) {
        console.error("Gemini Image Analysis Error:", error);
        return {
            caption: title || "Analysis failed.",
            tags: ["error"]
        };
    }
};
