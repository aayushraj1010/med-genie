'use client';

import { useState } from 'react';
import { exportChatToPDF } from '@/lib/exportToPDF';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ExportPDFButtonProps {
    messages: Message[];
    userName?: string;
}

export default function ExportPDFButton({
    messages,
    userName = 'User'
}: ExportPDFButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (messages.length === 0) {
            alert('No conversation to export yet!');
            return;
        }

        setIsExporting(true);
        try {
            exportChatToPDF(messages, userName);
        } catch (error) {
            console.error('PDF export failed:', error);
            alert('Failed to export PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting || messages.length === 0}
            className="
        flex items-center gap-2 
        px-4 py-2 
        bg-blue-600 hover:bg-blue-700 
        disabled:bg-gray-400 disabled:cursor-not-allowed
        text-white text-sm font-medium 
        rounded-lg transition-colors duration-200
        shadow-sm hover:shadow-md
      "
        >
            {isExporting ? (
                <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Exporting...
                </>
            ) : (
                <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Export as PDF
                </>
            )}
        </button>
    );
}