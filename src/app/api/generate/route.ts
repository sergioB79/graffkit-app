import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPrompt, PromptConfig } from "../../../lib/buildPrompt";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
  }

  let body: { config?: PromptConfig };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const config = body?.config;
  if (!config || !config.text) {
    return NextResponse.json({ error: "Incomplete config" }, { status: 400 });
  }

  const prompt = buildPrompt(config);

  try {
    const result = await client.images.generate({
      model: "gpt-image-1.5",
      prompt,
      size: "1024x1024",
    });

    const image = result.data?.[0]?.url ?? null;
    return NextResponse.json({ image });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message ?? "Image generation failed" }, { status: 500 });
  }
}
