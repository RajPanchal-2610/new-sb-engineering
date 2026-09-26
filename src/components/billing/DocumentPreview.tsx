import React, { useState, useEffect } from 'react';
import type { BillingDocument, CompanySettings } from '../../types/billingTypes';
import { DEFAULT_COMPANY_SETTINGS } from '../../types/billingTypes';
import { Share2, ArrowLeft, Download } from 'lucide-react';
import { generateDocumentPDF } from '../../utils/pdfGenerator';
import { buildUpiPaymentUrl, generateQrCodeDataUrl } from '../../utils/qrCodeGenerator';

interface Props {
  document: BillingDocument;
  company: CompanySettings;
  onBack: () => void;
  onShare: () => void;
}

export const DocumentPreview: React.FC<Props> = ({ document, company, onBack, onShare }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const isQuotation = document.document_type === 'quotation';
  const docTitle = isQuotation ? 'QUOTATION' : 'TAX INVOICE';

  const isInvoice = document.document_type === 'invoice';
  const effectiveUpiId = company.upi_id?.trim() || DEFAULT_COMPANY_SETTINGS.upi_id;
  const effectiveCompanyName = company.company_name?.trim() || DEFAULT_COMPANY_SETTINGS.company_name;

  useEffect(() => {
    if (isInvoice && company.show_bank_details !== false && effectiveUpiId) {
      const upiUrl = buildUpiPaymentUrl({
        upiId: effectiveUpiId,
        payeeName: effectiveCompanyName,
        amount: document.grand_total,
        transactionNote: `Invoice ${document.document_number}`,
      });
      generateQrCodeDataUrl(upiUrl, { width: 140, margin: 1 }).then(setQrDataUrl);
    } else {
      setQrDataUrl('');
    }
  }, [
    isInvoice,
    company.show_bank_details,
    effectiveUpiId,
    effectiveCompanyName,
    document.grand_total,
    document.document_number,
    document.document_type,
  ]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateDocumentPDF(document, company);
    } catch (error: any) {
      console.error('Error generating PDF download:', error);
      alert(`Failed to generate PDF download (${error?.message || 'Unknown error'}). Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const showHsn = company.show_hsn_column !== false && document.items?.some(
    (i) => i.hsn_sac && i.hsn_sac.trim() !== '' && i.hsn_sac !== '-'
  );
  const showQty = company.show_qty_column !== false && document.items?.some(
    (i) => i.quantity !== undefined && i.quantity !== null && String(i.quantity).trim() !== '' && Number(i.quantity) > 0
  );
  const showUnit = company.show_unit_column !== false && document.items?.some(
    (i) => i.unit && i.unit.trim() !== '' && i.unit !== '-'
  );
  const showRate = company.show_rate_column !== false;
  const showTax = company.show_tax_column !== false && document.items?.some(
    (i) => i.tax_percent !== undefined && i.tax_percent !== null && Number(i.tax_percent) > 0
  );
  const totalCols = 2 + (showHsn ? 1 : 0) + (showQty ? 1 : 0) + (showUnit ? 1 : 0) + (showRate ? 1 : 0) + (showTax ? 1 : 0);

  const hasBankDetails = Boolean(
    isInvoice &&
    company.show_bank_details !== false &&
    (
      (company.bank_name && company.bank_name.trim()) ||
      (company.account_number && company.account_number.trim()) ||
      (company.ifsc_code && company.ifsc_code.trim()) ||
      (company.branch && company.branch.trim()) ||
      effectiveUpiId
    )
  );

  const showTerms = company.show_terms_and_conditions !== false && Boolean(document.terms && document.terms.trim());

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium text-sm transition px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-700 transition shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-red-700 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Downloading PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div
        id="printable-document"
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:max-w-none text-gray-800 font-sans"
      >
        {/* Document Header */}
        <div className="flex flex-col md:flex-row justify-between border-b-2 border-red-600 pb-6 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3.5 mb-2">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.company_name}
                  className="h-20 w-auto max-w-[220px] object-contain shrink-0"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-12 h-12 bg-red-600 text-white font-black text-2xl rounded-lg flex items-center justify-center shadow shrink-0">
                  SB
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase leading-tight">
                  {company.company_name}
                </h1>
                {company.tagline && (
                  <p className="text-xs text-red-600 font-medium tracking-wide uppercase">{company.tagline}</p>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-600 space-y-0.5 pt-1">
              <p>{company.address}, {company.city_state_zip}</p>
              <p>Phone: {company.phone} | Email: {company.email}</p>
              {company.gstin && <p className="font-semibold text-gray-800">GSTIN: {company.gstin}</p>}
            </div>
          </div>

          <div className="text-right md:text-right space-y-1">
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-700 font-black text-lg tracking-wider rounded-lg border border-red-200">
              {docTitle}
            </span>
            <div className="text-xs text-gray-600 space-y-1 pt-2">
              <p><span className="font-semibold text-gray-800">Document No:</span> {document.document_number}</p>
              <p><span className="font-semibold text-gray-800">Issue Date:</span> {document.issue_date}</p>
              {document.due_date && document.due_date.trim() !== '' && (
                <p><span className="font-semibold text-gray-800">{isQuotation ? 'Valid Until:' : 'Due Date:'}</span> {document.due_date}</p>
              )}
              {document.reference_no && (
                <p><span className="font-semibold text-gray-800">Ref / P.O. No:</span> {document.reference_no}</p>
              )}
            </div>
          </div>
        </div>

        {/* Client & Billing Info */}
        <div className="my-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To / Client</h3>
          <p className="font-bold text-gray-900 text-base">{document.client_name}</p>
          {document.client_company && <p className="text-sm font-medium text-gray-700">{document.client_company}</p>}
          {document.client_address && <p className="text-xs text-gray-600 mt-1">{document.client_address}</p>}
          {document.client_gstin && <p className="text-xs font-semibold text-gray-800 mt-1">GSTIN: {document.client_gstin}</p>}
          {document.client_phone && <p className="text-xs text-gray-600">Phone: {document.client_phone}</p>}
          {document.client_email && <p className="text-xs text-gray-600">Email: {document.client_email}</p>}
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-4">Description</th>
                {showHsn && <th className="py-3 px-3 text-center">HSN/SAC</th>}
                {showQty && <th className="py-3 px-3 text-right">Qty</th>}
                {showUnit && <th className="py-3 px-3 text-center">Unit</th>}
                {showRate && <th className="py-3 px-3 text-right">Rate</th>}
                {showTax && <th className="py-3 px-3 text-right">Tax %</th>}
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {document.items && document.items.length > 0 ? (
                document.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                    <td className="py-3 px-3 text-center font-medium text-gray-500">{index + 1}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-pre-wrap">{item.description}</td>
                    {showHsn && <td className="py-3 px-3 text-center text-gray-600">{item.hsn_sac || '-'}</td>}
                    {showQty && <td className="py-3 px-3 text-right font-medium text-gray-800">{item.quantity ? item.quantity : '-'}</td>}
                    {showUnit && <td className="py-3 px-3 text-center text-gray-600">{item.unit || '-'}</td>}
                    {showRate && <td className="py-3 px-3 text-right text-gray-800">{formatCurrency(item.rate)}</td>}
                    {showTax && <td className="py-3 px-3 text-right text-gray-600">{item.tax_percent}%</td>}
                    <td className="py-3 px-4 text-right font-bold text-gray-900">{formatCurrency(item.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={totalCols} className="py-6 text-center text-gray-400">No line items added</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown & Bank Details */}
        <div className={`my-6 pt-4 border-t border-gray-200 ${hasBankDetails ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'flex justify-end'}`}>
          {/* Bank & Payment Info */}
          {hasBankDetails && (
            <div className="space-y-4 text-xs text-gray-600">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-2">Bank Payment Details</h4>
                  {company.bank_name && <p><span className="font-medium text-gray-700">Bank Name:</span> {company.bank_name}</p>}
                  {company.account_number && <p><span className="font-medium text-gray-700">Account No:</span> {company.account_number}</p>}
                  {company.ifsc_code && <p><span className="font-medium text-gray-700">IFSC Code:</span> {company.ifsc_code}</p>}
                  {company.branch && <p><span className="font-medium text-gray-700">Branch:</span> {company.branch}</p>}
                  {effectiveUpiId && <p className="font-semibold text-red-600 pt-1">UPI ID: {effectiveUpiId}</p>}
                </div>
                {qrDataUrl && (
                  <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-gray-200 shadow-xs shrink-0 self-center sm:self-auto">
                    <img src={qrDataUrl} alt="Scan to Pay via UPI" className="w-24 h-24 object-contain" />
                    <span className="text-[10px] font-semibold text-gray-600 mt-1">Scan & Pay via UPI</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Totals Table */}
          <div className={`space-y-2 text-xs ${hasBankDetails ? '' : 'w-full max-w-sm'}`}>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(document.subtotal)}</span>
            </div>

            {document.total_discount > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-100 text-red-600">
                <span>Discount:</span>
                <span>- {formatCurrency(document.total_discount)}</span>
              </div>
            )}

            {document.total_tax > 0 && (
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 font-medium">GST / Taxes:</span>
                <span className="font-semibold text-gray-800">{formatCurrency(document.total_tax)}</span>
              </div>
            )}

            {document.round_off !== 0 && (
              <div className="flex justify-between py-1 border-b border-gray-100 text-gray-500">
                <span>Round Off:</span>
                <span>{formatCurrency(document.round_off)}</span>
              </div>
            )}

            <div className="flex justify-between py-3 px-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-sm mt-3">
              <span>Grand Total:</span>
              <span>{formatCurrency(document.grand_total)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(document.notes || showTerms) && (
          <div className={`grid grid-cols-1 ${document.notes && showTerms ? 'md:grid-cols-2' : ''} gap-6 my-6 pt-4 border-t border-gray-200 text-xs`}>
            {document.notes && (
              <div>
                <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1">Notes & Remarks</h4>
                <p className="text-gray-600 whitespace-pre-wrap">{document.notes}</p>
              </div>
            )}
            {showTerms && (
              <div>
                <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-1">Terms & Conditions</h4>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{document.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Authorized Signature */}
        <div className="flex justify-between items-end pt-12 mt-8 border-t border-gray-200 text-xs">
          <div className="text-gray-500">
            <p className="font-medium text-gray-700">Thank you for your business!</p>
            <p>Computer Generated {docTitle}</p>
          </div>
          <div className="text-center space-y-10">
            <p className="font-bold text-gray-800">For {company.company_name}</p>
            <div className="border-t border-gray-400 pt-1 w-48 font-medium text-gray-600">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
