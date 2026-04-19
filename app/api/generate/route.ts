import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { peppers, quantities } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert on capsaicin and Scoville heat units. Provide accurate SHU estimates, relative heat comparisons, and dilution calculations for reaching target heat levels. Use markdown with a comparison table.`,
        },
        {
          role: "user",
          content: `Compare the heat of these peppers:\nPeppers: ${peppers}\nQuantities: ${quantities}\n\nProvide:\n1. Estimated SHU for each pepper\n2. Relative heat comparison (ranked)\n3. Combined heat if used together\n4. Dilution calculations to reach target heat levels\n5. Usage tips for each pepper type`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
