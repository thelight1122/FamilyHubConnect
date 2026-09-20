

// @ts-nocheck

import { GoogleGenAI } from "npm:@google/genai";
import { corsHeaders } from '../_shared/cors.ts'

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const parseJsonFromMarkdown = (text: string): string => {
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = text.match(fenceRegex);
    if (match && match[2]) {
      return match[2].trim();
    }
    return text.trim();
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set in Supabase secrets." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
  }

  try {
    const { endpoint, ...body } = await req.json()
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    switch (endpoint) {
        case 'generateText': {
            const { prompt, systemInstruction } = body;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    ...(systemInstruction && { systemInstruction }),
                }
            });
            const text = response.text;
            return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'generateJson': {
            const { prompt, systemInstruction } = body;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    ...(systemInstruction && { systemInstruction }),
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'generateImage': {
            const { prompt } = body;
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: prompt,
                config: {numberOfImages: 1, outputMimeType: 'image/jpeg'}
            });
            const imageUrl = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
            return new Response(JSON.stringify({ imageUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'generateMovieSuggestions': {
            const { prompt } = body;
             const systemInstruction = `You are a family movie expert. Based on the user's prompt (e.g., a genre or theme), suggest 5 relevant, family-friendly movie titles. Return the response as a JSON array of strings. Example: ["The Goonies", "E.T.", "Honey, I Shrunk the Kids"]. Do not include any other text, just the raw JSON array.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Suggest movies based on this theme/genre: ${prompt}`,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'generateSkillSuggestions': {
            const { age, interests } = body;
            const prompt = `Suggest 3-5 new skills or talents for a child aged ${age} who is interested in ${interests}. The skills should be achievable and fun. Focus on creativity, practical skills, or physical activities.`;
            const systemInstruction = `Provide the response as a JSON array of strings, where each string is a skill name. Example: ["Basic coding with Scratch", "Creative Writing", "Learn to juggle"]. Do not include any other text, just the raw JSON array.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'suggestHabits': {
            const { prompt, systemInstruction } = body;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    ...(systemInstruction && { systemInstruction }),
                },
            });
            const parsedText = parseJsonFromMarkdown(response.text);
            const suggestions = JSON.parse(parsedText);
            return new Response(JSON.stringify({ suggestions }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'categorizeExpense': {
            const { prompt, categories } = body;
            if (!prompt || !Array.isArray(categories)) {
                throw new Error("A prompt and a list of categories are required.");
            }
            const systemInstruction = `You are an expert expense categorizer. Analyze the user's text and determine the most appropriate category ID from the provided list. The list of categories is a JSON array of objects, each with an 'id' and a 'name'. Also extract the expense amount as a number and a short description. Your response must be a JSON object with keys 'description' (string), 'amount' (number), and 'categoryId' (string). Example input prompt: "groceries for $52.50 at the store". Example output: {"description": "groceries at the store", "amount": 52.50, "categoryId": "cat_123"}`;
            const userPrompt = `Categorize this expense: "${prompt}". Available categories: ${JSON.stringify(categories.map(c => ({id: c.id, name: c.name})))}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            return new Response(JSON.stringify({ expenseData: JSON.parse(text) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'generateMaintenanceSchedule': {
            const { make, model, year } = body;
            if (!make || !model || !year) {
                throw new Error("Make, model, and year are required for maintenance schedule generation.");
            }
            const prompt = `Generate a typical, simplified routine maintenance schedule for a ${year} ${make} ${model}. Include common items like oil changes, tire rotations, and brake checks with suggested mileage or time intervals. Format it as a simple list.`;
            const systemInstruction = `You are a helpful car maintenance assistant. Provide the output as a JSON object with a single key "schedule" which is an array of strings. Each string is a maintenance suggestion. Example: {"schedule": ["Oil Change: Every 5,000 miles or 6 months", "Tire Rotation: Every 7,500 miles"]}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            const schedule = JSON.parse(text).schedule;
            return new Response(JSON.stringify({ schedule }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'generateMealSuggestions': {
            const { prompt, systemInstruction } = body;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            return new Response(JSON.stringify({ suggestions: JSON.parse(text) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'generateRecipe': {
            const { prompt, systemInstruction } = body;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            return new Response(JSON.stringify({ recipe: JSON.parse(text) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'chatbot': {
            const { prompt, history, context } = body;
            const systemInstruction = `You are a helpful and friendly family assistant chatbot. Use the provided JSON context to answer the user's questions about their family hub. The context contains information about profiles, chores, events, meals, etc. Be concise and conversational. If the information is not in the context, say you don't know. The current user is ${context.currentViewingProfile.name}. The current date is ${new Date().toLocaleDateString()}. Here is the family's data context: ${JSON.stringify(context)}.`;
            
            const model = ai.chats.create({
              model: 'gemini-2.5-flash',
              config: {
                systemInstruction: systemInstruction,
              },
              history: history || []
            });

            const result = await model.sendMessage({message: prompt});
            const text = result.text;

            return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'generateGroundedContent': {
            const { prompt, systemInstruction } = body;
            
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}],
                    ...(systemInstruction && { systemInstruction }),
                },
            });
            // Sanitize response to prevent serialization issues with the complex SDK object
            const responsePayload = {
                text: response.text,
                candidates: response.candidates,
            };
            return new Response(JSON.stringify(responsePayload), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'getWeather': {
            const { location } = body;
            if (!location) {
                throw new Error("Location is required to get weather.");
            }
            const prompt = `
                You are a weather bot. Respond with a JSON object containing these keys: "temperature" (number), "condition" (string), "high" (number), "low" (number). Example: {"temperature": 72, "condition": "Sunny", "high": 78, "low": 65}. Return ONLY the raw JSON object.
                Question: What is the current weather in ${location}? Provide the temperature in Fahrenheit, the current condition (e.g., "Sunny", "Cloudy"), and the high and low temperatures for today.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });
            
            try {
                const text = parseJsonFromMarkdown(response.text);
                const weatherData = JSON.parse(text);
                return new Response(JSON.stringify({ weather: weatherData }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
            } catch (e) {
                console.error("Failed to parse weather JSON from Gemini:", response.text);
                throw new Error("AI returned an invalid format for weather data.");
            }
        }

        case 'suggestChoreAssignment': {
            const { choreName, children } = body;
            if (!choreName || !Array.isArray(children) || children.length === 0) {
                throw new Error("Chore name and a list of children are required.");
            }
            const systemInstruction = `You are an expert at assigning age-appropriate chores. Based on the chore name and the list of children with their ages, determine the most suitable child for the task. Consider age and chore complexity. Your response MUST be a JSON object with a single key "profileId", which is the ID of the suggested child. Example: {"profileId": "child_mock_1"}`;
            const userPrompt = `Chore: "${choreName}". Children: ${JSON.stringify(children)}. Who should do it?`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userPrompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            const data = JSON.parse(text);

            return new Response(JSON.stringify({ profileId: data.profileId }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        
        case 'generateShoppingList': {
            const { prompt } = body;
            const systemInstruction = `You are a helpful shopping assistant. Based on the user's prompt (e.g., "Taco night for 4"), create a categorized shopping list. Return a JSON object where keys are categories (like "Produce", "Meat", "Dairy", "Pantry") and values are arrays of item names.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Create a shopping list for: ${prompt}`,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            const list = JSON.parse(text);
            return new Response(JSON.stringify({ list }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'suggestRestorativeTasks': {
            const { reason, age } = body;
            if (!reason) {
                throw new Error("Reason for infraction is required.");
            }
            const systemInstruction = `You are a child psychologist specializing in restorative justice. Your goal is to suggest constructive, age-appropriate tasks for a child who has misbehaved. The tasks should help them learn and make amends, not just be punitive. Respond with a JSON array of strings, where each string is a task.`;
            const prompt = `A child (age ${age || 'unknown'}) has committed the following infraction: "${reason}". Suggest 3-4 restorative tasks.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            const tasks = JSON.parse(text);
            return new Response(JSON.stringify({ tasks }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'generateCareInstructions': {
            const { topic } = body;
            if (!topic) throw new Error("A topic is required.");
            const systemInstruction = `You are an expert caregiver assistant. Based on the user's topic, generate a clear, step-by-step list of instructions suitable for a babysitter or caregiver. The tone should be clear and direct. Respond with a JSON array of strings, where each string is one step.`;
            const prompt = `Generate care instructions for the following topic: "${topic}"`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    systemInstruction,
                },
            });
            const text = parseJsonFromMarkdown(response.text);
            const instructions = JSON.parse(text);
            return new Response(JSON.stringify({ instructions }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        case 'streamText': {
            const { prompt, systemInstruction } = body;
            const streamResponse = await ai.models.generateContentStream({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                ...(systemInstruction && { systemInstruction }),
              }
            });
            
            const stream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of streamResponse) {
                        const chunkText = chunk.text;
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                    controller.close();
                }
            });
            
            return new Response(stream, { headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' } });
        }

      default:
        throw new Error("Invalid endpoint.")
    }

  } catch (error) {
    console.error(`Error in ai-handler:`, error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
