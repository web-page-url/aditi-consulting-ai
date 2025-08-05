import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { message, pdfText, apiKey } = await request.json();

    console.log('Chat API called with message:', message?.substring(0, 100) + '...');

    if (!message || !pdfText || !apiKey) {
      console.log('Missing required fields:', { 
        hasMessage: !!message, 
        hasPdfText: !!pdfText, 
        hasApiKey: !!apiKey 
      });
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('Calling OpenAI API...');

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that answers questions about PDF documents accurately and concisely. Base your answers strictly on the provided PDF content.'
          },
          {
            role: 'user',
            content: `Here is the content of a PDF document:

${pdfText}

User question: ${message}

Please provide a helpful and accurate answer based on the PDF content above. If the question cannot be answered from the PDF content, please say so politely and suggest what information might be available in the document.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      console.log('OpenAI response received, length:', reply.length);
      
      return NextResponse.json({ reply });

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      
      if (openaiError.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenAI API key.' }, 
          { status: 401 }
        );
      }
      
      if (openaiError.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' }, 
          { status: 429 }
        );
      }
      
      if (openaiError.status === 402) {
        return NextResponse.json(
          { error: 'Insufficient credits. Please check your OpenAI account balance.' }, 
          { status: 402 }
        );
      }
      
      return NextResponse.json(
        { error: `OpenAI API error: ${openaiError.message || 'Unknown error'}` }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}