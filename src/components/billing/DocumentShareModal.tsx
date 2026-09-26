import React, { useState } from 'react';
import type { BillingDocument, CompanySettings } from '../../types/billingTypes';
import { X, MessageSquare, Mail, Share2, Copy, Check, FileText, Download } from 'lucide-react';
import { generateDocumentPDF, generateDocumentPDFFile } from '../../utils/pdfGenerator';
import { copyToClipboard } from '../../utils/clipboardUtils';

interface Props {
  document: BillingDocument;
  company: CompanySettings;
  onClose: () => void;
}

export const DocumentShareModal: React.FC<Props> = ({ document, company, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);

  const [copiedLink, setCopiedLink] = useState(false);

  const docTitle = document.document_type === 'quotation' ? 'Quotation' : 'Invoice';
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(document.grand_total);

  const publicUrl = `${window.location.origin}/document/${document.id}`;

  // Formatted summary text for message body
  const shareText = `*${company.company_name} - ${docTitle.toUpperCase()}*\n\n` +
    `Document No: ${document.document_number}\n` +
    `Client: ${document.client_name} ${document.client_company ? `(${document.client_company})` : ''}\n` +
    `Date: ${document.issue_date}\n` +
    `Total Amount: ${formattedTotal}\n\n` +
    `📄 View ${docTitle} Online:\n${publicUrl}\n\n` +
    `Thank you for choosing ${company.company_name}!`;

  // WhatsApp link
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // Email mailto link
  const emailSubject = encodeURIComponent(`${docTitle} ${document.document_number} from ${company.company_name}`);
  const emailBody = encodeURIComponent(`Dear ${document.client_name},\n\nPlease find attached details for your ${docTitle.toLowerCase()}:\n\n` + shareText);
  const mailtoUrl = `mailto:${document.client_email || ''}?subject=${emailSubject}&body=${emailBody}`;

  const handleSharePdfFile = async () => {
    setIsPreparingPdf(true);
    try {
      const pdfFile = await generateDocumentPDFFile(document, company);

      let sharedSuccessfully = false;
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        try {
          await navigator.share({
            title: `${docTitle} ${document.document_number}`,
            text: shareText,
            files: [pdfFile],
          });
          sharedSuccessfully = true;
        } catch (shareErr: any) {
          console.warn('Native share failed or canceled:', shareErr);
        }
      }

      if (!sharedSuccessfully) {
        // Fallback: Trigger direct download and open WhatsApp
        const isQuotation = document.document_type === 'quotation';
        const fileName = `${isQuotation ? 'Quotation' : 'Invoice'}_${document.document_number}.pdf`;

        const blobUrl = URL.createObjectURL(pdfFile);
        const link = window.document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        alert(`PDF downloaded as "${fileName}". WhatsApp will open now so you can attach the downloaded PDF file.`);
        window.open(whatsappUrl, '_blank');
      }
    } catch (err: any) {
      console.error('Error sharing PDF file:', err);
      alert(`Could not prepare PDF file (${err?.message || 'Unknown error'}). Please try again.`);
    } finally {
      setIsPreparingPdf(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleCopyText = async () => {
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Share {docTitle}</h3>
            <p className="text-xs text-gray-500">{document.document_number} • {formattedTotal}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Share PDF Document File directly */}
          <button
            onClick={handleSharePdfFile}
            disabled={isPreparingPdf}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100/90 text-red-900 font-semibold transition group text-left cursor-pointer disabled:opacity-50"
          >
            <div className="p-2 bg-red-600 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm font-bold text-red-950">
                {isPreparingPdf ? 'Generating PDF...' : 'Share PDF Document File'}
              </div>
              <div className="text-xs text-red-700 font-normal">
                Attaches PDF document directly via WhatsApp / System Share
              </div>
            </div>
          </button>

          {/* WhatsApp Text Share with Web Link */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 font-semibold transition group"
          >
            <div className="p-2 bg-emerald-600 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm">WhatsApp Message + Online Link</div>
              <div className="text-xs text-emerald-600 font-normal">Sends WhatsApp message containing website link</div>
            </div>
          </a>

          {/* Copy Direct Web Page Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-900 font-semibold transition group text-left cursor-pointer"
          >
            <div className="p-2 bg-indigo-600 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
              {copiedLink ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm font-bold text-indigo-950">
                {copiedLink ? 'Link Copied to Clipboard!' : 'Copy Online Website Link'}
              </div>
              <div className="text-xs text-indigo-700 font-normal">
                Copy link to view document directly on your website
              </div>
            </div>
          </button>

          {/* Email Share */}
          <a
            href={mailtoUrl}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 font-semibold transition group"
          >
            <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm">Send Email</div>
              <div className="text-xs text-blue-600 font-normal">Open default email app with pre-filled details</div>
            </div>
          </a>
          {/* Copy Summary Text */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold transition group text-left cursor-pointer"
          >
            <div className="p-2 bg-gray-700 text-white rounded-lg group-hover:scale-105 transition-transform shrink-0">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm">{copied ? 'Copied to Clipboard!' : 'Copy Text Summary'}</div>
              <div className="text-xs text-gray-500 font-normal">Copy summary details to paste anywhere</div>
            </div>
          </button>
        </div>

        {/* Informational Note */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 space-y-1">
          <p className="font-bold">📱 Why WhatsApp text links don't auto-attach PDF files:</p>
          <p className="text-amber-700 leading-tight">
            Web browser security prevents websites from automatically attaching local files into WhatsApp web links. Use <strong>"Share PDF Document File"</strong> above (on mobile) or download the PDF and attach it manually in WhatsApp.
          </p>
        </div>

        {/* Text Preview Box */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Message Preview</div>
          <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">{shareText}</pre>
        </div>
      </div>
    </div>
  );
};
