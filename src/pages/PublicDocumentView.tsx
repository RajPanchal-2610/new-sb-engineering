import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { BillingDocument, CompanySettings } from '../types/billingTypes';
import { getDocumentById, getCompanySettings } from '../services/billingService';
import { generateDocumentPDF } from '../utils/pdfGenerator';
import { buildUpiPaymentUrl, generateQrCodeDataUrl } from '../utils/qrCodeGenerator';
import {
  Download,
  Share2,
  ArrowLeft,
  Printer,
  CheckCircle,
  FileText,
  Briefcase
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboardUtils';

export const PublicDocumentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [document, setDocument] = useState<BillingDocument | null>(null);
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const docRef = React.useRef<HTMLDivElement>(null);
  const [docHeight, setDocHeight] = useState<number | null>(null);

  // Auto-fit document scale for mobile screens
  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 840) {
        const autoScale = Math.min(1, (screenWidth - 32) / 800);
        setScale(Math.max(0.35, Math.round(autoScale * 100) / 100));
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!docRef.current) return;
    const updateDocHeight = () => {
      if (docRef.current) {
        setDocHeight(docRef.current.offsetHeight);
      }
    };

    updateDocHeight();
    const observer = new ResizeObserver(updateDocHeight);
    observer.observe(docRef.current);
    return () => observer.disconnect();
  }, [document]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Document ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [docData, companyData] = await Promise.all([
          getDocumentById(id),
          getCompanySettings(),
        ]);

        if (!docData) {
          setError('The requested document was not found or has been removed.');
        } else {
          setDocument(docData);
          setCompany(companyData);

          // Generate UPI QR Code if applicable
          if (docData.document_type === 'invoice' && companyData.show_bank_details !== false && companyData.upi_id) {
            const upiUrl = buildUpiPaymentUrl({
              upiId: companyData.upi_id,
              payeeName: companyData.company_name,
              amount: docData.grand_total,
              transactionNote: `Invoice ${docData.document_number}`,
            });
            generateQrCodeDataUrl(upiUrl, { width: 160, margin: 1 }).then(setQrDataUrl);
          }
        }
      } catch (err: any) {
        console.error('Error loading public document:', err);
        setError('Failed to load document details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const handleDownloadPDF = async () => {
    if (!document || !company) return;
    setIsDownloading(true);
    try {
      await generateDocumentPDF(document, company);
    } catch (err: any) {
      console.error('PDF download error:', err);
      alert(`Could not generate PDF download (${err?.message || 'Unknown error'}).`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="text-lg font-bold text-gray-800">Loading Document...</h2>
          <p className="text-xs text-gray-500">Retrieving official document details from SB Engineering</p>
        </div>
      </div>
    );
  }

  if (error || !document || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center max-w-md space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Document Not Found</h2>
          <p className="text-sm text-gray-600">{error || 'This link may be expired or invalid.'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Home</span>
          </button>
        </div>
      </div>
    );
  }

  const isQuotation = document.document_type === 'quotation';
  const docTitle = isQuotation ? 'QUOTATION' : 'TAX INVOICE';
  const isInvoice = document.document_type === 'invoice';

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
      company.upi_id
    )
  );

  const showTerms = company.show_terms_and_conditions !== false && Boolean(document.terms && document.terms.trim());

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-12">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div 
            className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition"
            onClick={() => navigate('/our-work')}
            title="Go to Our Work"
          >
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.company_name} className="h-9 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 bg-red-600 text-white font-black text-sm rounded-lg flex items-center justify-center">
                SB
              </div>
            )}
            <div>
              <h1 className="text-sm font-black text-gray-900 leading-none uppercase group-hover:text-red-600 transition">{company.company_name}</h1>
              <p className="text-[11px] text-gray-500 mt-0.5">{docTitle} #{document.document_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/our-work')}
              className="flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-red-600" />
              <span>Our Work</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Auto-fit Mobile Scaling */}
      <main className="w-full px-2 sm:px-4 pt-4 flex flex-col items-center">
        <div className="w-full overflow-x-auto pb-4 flex flex-col items-center">
          <div
            style={{
              width: `${800 * scale}px`,
              height: (docHeight && scale < 1) ? `${docHeight * scale}px` : 'auto',
              overflow: 'hidden',
              transition: 'width 0.15s ease-out, height 0.15s ease-out',
            }}
            className="mx-auto"
          >
            <div
              ref={docRef}
              id="printable-document"
              style={{
                width: '800px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                transition: 'transform 0.15s ease-out',
              }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-gray-800 font-sans print:shadow-none print:border-none print:p-0 print:transform-none print:w-full"
            >
              {/* Document Header */}
              <div className="flex flex-row justify-between border-b-2 border-red-600 pb-6 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3.5 mb-2">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.company_name}
                        className="h-20 w-auto max-w-[220px] object-contain shrink-0 rounded-xl border-2 border-gray-300 p-2 bg-white shadow-xs"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-red-600 text-white font-black text-2xl rounded-lg flex items-center justify-center shadow shrink-0">
                        SB
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase leading-tight">
                        {company.company_name}
                      </h2>
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

                <div className="text-right space-y-1">
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
              <div className="my-6">
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
                        <td colSpan={totalCols} className="py-6 text-center text-gray-400">No line items listed</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown & Bank Details */}
              <div className={`my-6 pt-4 border-t border-gray-200 ${hasBankDetails ? 'grid grid-cols-2 gap-8' : 'flex justify-end'}`}>
                {/* Bank & Payment Info */}
                {hasBankDetails && (
                  <div className="space-y-4 text-xs text-gray-600">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-row items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-gray-800 uppercase tracking-wider text-[11px] mb-2">Bank Payment Details</h4>
                        {company.bank_name && <p><span className="font-medium text-gray-700">Bank Name:</span> {company.bank_name}</p>}
                        {company.account_number && <p><span className="font-medium text-gray-700">Account No:</span> {company.account_number}</p>}
                        {company.ifsc_code && <p><span className="font-medium text-gray-700">IFSC Code:</span> {company.ifsc_code}</p>}
                        {company.branch && <p><span className="font-medium text-gray-700">Branch:</span> {company.branch}</p>}
                        {company.upi_id && <p className="font-semibold text-red-600 pt-1">UPI ID: {company.upi_id}</p>}
                      </div>
                      {qrDataUrl && (
                        <div className="flex flex-col items-center bg-white p-2 rounded-lg border border-gray-200 shadow-xs shrink-0 text-center">
                          <img src={qrDataUrl} alt="Scan to Pay via UPI" className="w-24 h-24 object-contain" />
                          <span className="text-[10px] font-bold text-gray-700 mt-1">Scan & Pay via UPI</span>
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
                <div className={`grid grid-cols-1 ${document.notes && showTerms ? 'grid-cols-2' : ''} gap-6 my-6 pt-4 border-t border-gray-200 text-xs`}>
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
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-4 text-center text-xs text-gray-500 print:hidden space-y-3 pb-4">
        <div>
          <button
            onClick={() => navigate('/our-work')}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold bg-white px-4 py-2 rounded-xl shadow-xs border border-gray-200 hover:border-red-300 transition cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-red-600" />
            <span>Explore Our Work & Projects →</span>
          </button>
        </div>
        <p>© {new Date().getFullYear()} {company.company_name}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicDocumentView;
