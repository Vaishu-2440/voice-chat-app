import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log('OpenAI API called');
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    
    const { message } = await request.json();
    console.log('Received message:', message);

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly and helpful voice assistant. Respond naturally and conversationally. Keep responses concise (1-2 sentences) and engaging. Be helpful, informative, and sometimes humorous. Always respond as if you\'re having a natural conversation.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      text: response,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
} 