'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface PdfUploadProps {
    onPdfUpload: (text: string, fileName: string) => void;
}

export default function PdfUpload({ onPdfUpload }: PdfUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('PDF file is too large. Maximum size is 10MB.');
            return;
        }

        setUploadedFile(file.name);
        setProcessing(true);

        try {
            console.log('Uploading PDF:', file.name, file.size, 'bytes');

            // Send the PDF file to the server for processing
            const formData = new FormData();
            formData.append('pdf', file);

            const response = await fetch('/api/extract-pdf', {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await response.text();
                console.error('Non-JSON response:', textResponse);
                throw new Error('Server returned an invalid response. Please try again.');
            }

            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to extract PDF text');
            }

            const { text } = responseData;

            if (!text || text.trim().length === 0) {
                throw new Error('No text found in PDF');
            }

            console.log('PDF processed successfully, text length:', text.length);
            onPdfUpload(text, file.name);
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert(`Error processing PDF: ${error instanceof Error ? error.message : 'Please try again with a different PDF file.'}`);
            setUploadedFile(null);
        } finally {
            setProcessing(false);
        }
    };

    const clearFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upload PDF Document
                </h3>
            </div>

            {!uploadedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={processing}
                    />

                    <div className="space-y-4">
                        {processing ? (
                            <Loader2 className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto animate-spin" />
                        ) : (
                            <Upload className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto" />
                        )}

                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {processing ? 'Processing PDF...' : 'Drop your PDF here or click to browse'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Supports PDF files up to 10MB. Works best with text-based PDFs.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {uploadedFile}
                        </span>
                    </div>
                    <button
                        onClick={clearFile}
                        className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </button>
                </div>
            )}
        </div>
    );
}