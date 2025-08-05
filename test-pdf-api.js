// Simple test script to verify PDF API is working
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPdfApi() {
  try {
    console.log('Testing PDF extraction API...');
    
    // Create a simple test - we'll test with a form data request
    const formData = new FormData();
    
    // Create a minimal PDF buffer for testing (this won't work, but will test the API structure)
    const testBuffer = Buffer.from('Test PDF content');
    formData.append('pdf', testBuffer, {
      filename: 'test.pdf',
      contentType: 'application/pdf'
    });
    
    const response = await fetch('http://localhost:3001/api/extract-pdf', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('API Response:', result);
    console.log('Status:', response.status);
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testPdfApi();