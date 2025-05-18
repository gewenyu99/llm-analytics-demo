import { OpenAI } from '@posthog/ai'
import { PostHog } from 'posthog-node'
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const phClient = new PostHog(
  process.env.POSTHOG_API_KEY ?? '',
  { host: process.env.POSTHOG_HOST ?? '' }
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  posthog: phClient,
});

export async function POST(request: Request) {
  try {
    const { prompt, nickname } = await request.json();

    if (!nickname) {
      return NextResponse.json(
        { error: 'Nickname is required' },
        { status: 400 }
      );
    }

    // Save nickname in a cookie
    const cookieStore = await cookies()
    cookieStore.set('nickname', nickname);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Keep your responses concise and clear."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      posthogDistinctId: nickname
    });

    const response = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 