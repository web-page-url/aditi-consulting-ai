# Testing Guide for PDF Chat AI

## How to Test Your Application

### 1. Start the Application
```bash
npm run dev
```
The app will run on http://localhost:3001

### 2. Set Up Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key (starts with `sk-`)
3. Enter it in the "OpenAI API Key" field in the app
4. Click "Save API Key"

### 3. Test with Sample PDFs

#### Option A: Create a Simple Test PDF
1. Open any word processor (Word, Google Docs, etc.)
2. Type some sample content like:
   ```
   Sample Document for Testing
   
   This is a test document for the PDF Chat AI application.
   
   Key Information:
   - Company: Aditi Consulting
   - Project: PDF Chat AI
   - Technology: Next.js, TypeScript, OpenAI
   - Features: PDF upload, text extraction, AI chat
   
   Questions you can ask:
   - What company is mentioned in this document?
   - What technology stack is used?
   - What are the main features?
   ```
3. Save/Export as PDF
4. Upload to the application

#### Option B: Use Existing PDFs
- Try with any text-based PDF (reports, articles, documentation)
- Avoid scanned PDFs or image-based PDFs as they won't work
- Keep file size under 10MB

### 4. Test the Chat Feature
Once your PDF is uploaded, try these sample questions:
- "What is this document about?"
- "Summarize the main points"
- "What are the key features mentioned?"
- "Tell me about [specific topic from your PDF]"

### 5. Troubleshooting

#### PDF Upload Issues
- **"No text found in PDF"**: The PDF might be image-based or scanned
- **"Invalid PDF file"**: File might be corrupted or not a real PDF
- **"File too large"**: Reduce file size to under 10MB

#### Chat Issues
- **"Invalid API key"**: Check your OpenAI API key is correct
- **No response**: Check browser console for errors
- **Slow responses**: Normal for large PDFs or complex questions

### 6. Browser Console Logs
Open Developer Tools (F12) and check the Console tab for detailed logs:
- PDF upload progress
- Text extraction results
- API call responses
- Error details

### 7. Expected Behavior
✅ **Working correctly:**
- PDF uploads without errors
- Text extraction completes successfully
- Chat responses are relevant to PDF content
- Theme switching works
- Mobile responsive design

❌ **Common issues:**
- Scanned PDFs won't work (no extractable text)
- Very large PDFs may timeout
- Password-protected PDFs are not supported
- Image-only PDFs won't work

### 8. Performance Tips
- Use text-based PDFs for best results
- Smaller files process faster
- Clear, well-formatted PDFs work better
- Avoid heavily formatted or complex layout PDFs

## Sample Questions to Test
- "What is the main topic of this document?"
- "Can you summarize this in 3 bullet points?"
- "What are the key dates mentioned?"
- "Who are the main people or companies mentioned?"
- "What are the conclusions or recommendations?"