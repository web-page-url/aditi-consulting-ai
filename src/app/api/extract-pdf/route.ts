import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  
  try {
    console.log('PDF extraction API called');
    
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size);

    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'PDF file too large. Maximum size is 10MB.' }, { status: 400 });
    }

    // Convert file to buffer and save temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create temporary file
    tempFilePath = join(tmpdir(), `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.pdf`);
    writeFileSync(tempFilePath, buffer);
    
    console.log('Temporary file created:', tempFilePath);

    // Extract text using pdf2json
    console.log('Starting PDF parsing with pdf2json...');
    
    const PDFParser = (await import('pdf2json')).default;
    
    const extractText = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();
        
        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.error('PDF Parser Error:', errData.parserError);
          reject(new Error(`PDF parsing failed: ${errData.parserError}`));
        });
        
        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          try {
            let fullText = '';
            
            if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
              pdfData.Pages.forEach((page: any) => {
                if (page.Texts && Array.isArray(page.Texts)) {
                  page.Texts.forEach((textItem: any) => {
                    if (textItem.R && Array.isArray(textItem.R)) {
                      textItem.R.forEach((textRun: any) => {
                        if (textRun.T) {
                          // Decode URI component to handle special characters
                          const decodedText = decodeURIComponent(textRun.T);
                          fullText += decodedText + ' ';
                        }
                      });
                    }
                  });
                  fullText += '\n'; // Add line break after each page
                }
              });
            }
            
            resolve(fullText.trim());
          } catch (parseError) {
            console.error('Error processing PDF data:', parseError);
            reject(new Error('Failed to process PDF content'));
          }
        });
        
        pdfParser.loadPDF(tempFilePath!);
      });
    };
    
    const extractedText = await extractText();
    console.log('PDF parsed successfully. Text length:', extractedText?.length || 0);
    
    if (!extractedText || extractedText.trim().length === 0) {
      console.log('No text found in PDF');
      return NextResponse.json({ 
        error: 'No text found in PDF. This might be a scanned document or image-based PDF.' 
      }, { status: 400 });
    }

    console.log('Returning extracted text');
    return NextResponse.json({ 
      text: extractedText,
      pages: 'N/A', // pdf2json doesn't provide page count in the same way
      success: true
    });

  } catch (error) {
    console.error('Detailed error extracting PDF:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    let errorMessage = 'Failed to extract text from PDF.';
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF') || error.message.includes('PDF parsing failed')) {
        errorMessage = 'Invalid PDF file. Please ensure the file is not corrupted.';
      } else if (error.message.includes('Password')) {
        errorMessage = 'Password-protected PDFs are not supported.';
      } else {
        errorMessage = `PDF processing error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
        console.log('Temporary file cleaned up:', tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temporary file:', cleanupError);
      }
    }
  }
}