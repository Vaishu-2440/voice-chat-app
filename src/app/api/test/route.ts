import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    console.log('Test API called');
    console.log('API Key available:', !!process.env.OPENAI_API_KEY);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond with a simple greeting.',
        },
        {
          role: 'user',
          content: 'Hello',
        },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'No response';

    return NextResponse.json({
      success: true,
      response: response,
      apiKeyAvailable: !!process.env.OPENAI_API_KEY
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        apiKeyAvailable: !!process.env.OPENAI_API_KEY
      },
      { status: 500 }
    );
  }
} 