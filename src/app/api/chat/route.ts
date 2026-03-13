import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Supabase Admin for context fetching
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. Fetch Context (Simple RAG)
    // We fetch a few top products and related info to ground the AI
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("title, brand, price_range, affiliate_link, short_description")
      .limit(5);

    const productContext = products
      ? products.map(p => `- ${p.title} (${p.brand}): ${p.price_range}. Details: ${p.short_description}`).join("\n")
      : "No product data available.";

    const systemPrompt = `
      You are "Tech Assistant", an advanced AI guru for Affiliate Hub Pro.
      Your mission is to help users find the best tech products, buying guides, and deals on our site.
      
      TONE: Professional, tech-savvy, helpful, and slightly "futuristic".
      
      CONTEXT:
      Our current top products:
      ${productContext}
      
      INSTRUCTIONS:
      1. If a user asks for recommendations, prioritize the products in the context.
      2. Always include a positive sentiment about the products.
      3. If you don't know the answer based on the context, say you're still indexing that information but can help with the top tech products listed above.
      4. Keep responses concise and use Markdown for formatting.
      5. Never mention internal database IDs or technical system details.
    `;

    // 2. Generate Content
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // Add system instructions as a preamble or first message if needed, 
    // but Gemini 1.5 Flash supports systemInstruction in some SDK versions.
    // For simplicity with this SDK version, we'll append context to the last prompt or use a system-like start.
    
    const promptWithContext = `System Instruction: ${systemPrompt}\n\nUser Question: ${lastMessage}`;

    const result = await chat.sendMessage(promptWithContext);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown protocol error';
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Neural link failure. Please try again later.", details: message },
      { status: 500 }
    );
  }
}
