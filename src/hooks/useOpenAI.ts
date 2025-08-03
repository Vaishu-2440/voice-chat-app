import { useCallback } from 'react';
import { OpenAIResponse } from '@/types/performance';

export function useOpenAI() {
  const generateResponse = useCallback(async (transcript: string): Promise<string> => {
    try {
      console.log('🌐 Making OpenAI API request for:', transcript);
      
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: transcript,
        }),
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error response:', errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data: OpenAIResponse = await response.json();
      console.log('✅ API Response data:', data);
      return data.text;

    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      
      // Fallback response for demo purposes
      return `I received your message: "${transcript}". This is a demo response since the OpenAI API is not configured. In a production environment, this would be a real AI-generated response based on your input. The system is designed to process speech locally and only use the network for the AI response generation.`;
    }
  }, []);

  return {
    generateResponse,
  };
} 