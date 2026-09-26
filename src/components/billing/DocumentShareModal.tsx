import React, { useState } from 'react';
import type { BillingDocument, CompanySettings } from '../../types/billingTypes';
import { X, MessageSquare, Mail, Share2, Copy, Check } from 'lucide-react';

interface Props {
  document: BillingDocument;
  company: CompanySettings;
  onClose: () => void;
}

export const DocumentShareModal: React.FC<Props> = ({ document, company, onClose }) => {
  const [copied, setCopied] = useState(false);

  const docTitle = document.document_type === 'quotation' ? 'Quotation' : 'Invoice';
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(document.grand_total);

  // Formatted summary text for message body
  const shareText = `*${company.company_name} - ${docTitle.toUpperCase()}*\n\n` +
    `Document No: ${document.document_number}\n` +
    `Client: ${document.client_name} ${document.client_company ? `(${document.client_company})` : ''}\n` +
    `Date: ${document.issue_date}\n` +
    `Total Amount: ${formattedTotal}\n\n` +
    `Thank you for choosing ${company.company_name}!`;

  // WhatsApp link
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // Email mailto link
  const emailSubject = encodeURIComponent(`${docTitle} ${document.document_number} from ${company.company_name}`);
  const emailBody = encodeURIComponent(`Dear ${document.client_name},\n\nPlease find attached details for your ${docTitle.toLowerCase()}:\n\n` + shareText);
  const mailtoUrl = `mailto:${document.client_email || ''}?subject=${emailSubject}&body=${emailBody}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${docTitle} ${document.document_number}`,
          text: shareText,
        });
      } catch (err) {
        console.log('Share canceled or not supported');
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
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
          {/* WhatsApp Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 font-semibold transition group"
          >
            <div className="p-2 bg-emerald-600 text-white rounded-lg group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm">Share on WhatsApp</div>
              <div className="text-xs text-emerald-600 font-normal">Send quick message directly to client</div>
            </div>
          </a>

          {/* Email Share */}
          <a
            href={mailtoUrl}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 font-semibold transition group"
          >
            <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm">Send Email</div>
              <div className="text-xs text-blue-600 font-normal">Open default email client with draft</div>
            </div>
          </a>

          {/* Web Share API */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-800 font-semibold transition group"
            >
              <div className="p-2 bg-purple-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="text-left flex-grow">
                <div className="text-sm">More Apps (System Share)</div>
                <div className="text-xs text-purple-600 font-normal">Share via Bluetooth, Drive, or messaging apps</div>
              </div>
            </button>
          )}

          {/* Copy Summary Text */}
          <button
            onClick={handleCopyText}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 font-semibold transition group"
          >
            <div className="p-2 bg-gray-700 text-white rounded-lg group-hover:scale-105 transition-transform">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </div>
            <div className="text-left flex-grow">
              <div className="text-sm">{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</div>
              <div className="text-xs text-gray-500 font-normal">Copy key details to paste anywhere</div>
            </div>
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Message Preview</div>
          <pre className="text-xs text-gray-700 font-sans whitespace-pre-wrap leading-relaxed">{shareText}</pre>
        </div>
      </div>
    </div>
  );
};
