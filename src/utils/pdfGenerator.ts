import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { BillingDocument, CompanySettings } from '../types/billingTypes';
import { DEFAULT_COMPANY_SETTINGS } from '../types/billingTypes';
import { buildUpiPaymentUrl, generateQrCodeDataUrl } from './qrCodeGenerator';

// Helper to convert OKLCH color strings (from Tailwind v4) into standard RGB/RGBA strings
export const oklchToRgb = (oklchStr: string): string => {
  const match = oklchStr.match(/oklch\(\s*([0-9.%]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.%]+))?\s*\)/i);
  if (!match || !match[1] || !match[2] || !match[3]) return oklchStr;

  const lStr = match[1];
  const cStr = match[2];
  const hStr = match[3];
  const alphaStr = match[4];

  let l = parseFloat(lStr);
  if (lStr.endsWith('%')) l /= 100;
  let c = parseFloat(cStr);
  let h = parseFloat(hStr);
  let alpha = alphaStr ? (alphaStr.endsWith('%') ? parseFloat(alphaStr) / 100 : parseFloat(alphaStr)) : 1;

  // OKLCH -> OKLAB
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  // OKLAB -> LMS
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  // LMS -> Linear RGB
  const rL = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gL = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bL = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Linear RGB -> sRGB
  const toSRGB = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    return clamped <= 0.0031308
      ? Math.round(clamped * 12.92 * 255)
      : Math.round((1.055 * Math.pow(clamped, 1 / 2.4) - 0.055) * 255);
  };

  const r = toSRGB(rL);
  const g = toSRGB(gL);
  const b_val = toSRGB(bL);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${b_val}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b_val})`;
};

export const replaceUnsupportedColorsInString = (str: string): string => {
  if (!str) return str;

  let result = str.replace(/oklch\(\s*([0-9.%]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.%]+))?\s*\)/gi, (match) => {
    try {
      return oklchToRgb(match);
    } catch {
      return 'rgb(31, 41, 55)';
    }
  });

  result = result.replace(/okl[a-z0-9_-]*\([^)]*\)/gi, 'rgb(31, 41, 55)');
  result = result.replace(/light-dark\([^)]*\)/gi, 'rgb(31, 41, 55)');

  return result;
};

export const replaceOklchInString = replaceUnsupportedColorsInString;

const sanitizeClonedDocForHtml2Canvas = (clonedDoc: Document) => {
  const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
  styleTags.forEach((styleTag) => {
    if (styleTag.textContent) {
      styleTag.textContent = replaceUnsupportedColorsInString(styleTag.textContent);
    }
  });

  const linkTags = Array.from(clonedDoc.querySelectorAll('link[rel="stylesheet"]'));
  linkTags.forEach((link) => {
    link.remove();
  });

  const container = clonedDoc.getElementById('printable-document') || clonedDoc.body;
  if (container) {
    const elements = Array.from(container.querySelectorAll('*')) as HTMLElement[];
    elements.push(container as HTMLElement);

    elements.forEach((htmlEl) => {
      const styleAttr = htmlEl.getAttribute('style');
      if (styleAttr) {
        htmlEl.setAttribute('style', replaceUnsupportedColorsInString(styleAttr));
      }

      const computed = clonedDoc.defaultView?.getComputedStyle(htmlEl);
      if (computed) {
        ['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke', 'boxShadow', 'textShadow'].forEach((prop) => {
          const val = computed.getPropertyValue(prop);
          if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('oklan') || val.includes('light-dark'))) {
            const converted = replaceUnsupportedColorsInString(val);
            if (prop === 'color') htmlEl.style.color = converted;
            if (prop === 'backgroundColor') htmlEl.style.backgroundColor = converted;
            if (prop === 'borderColor') htmlEl.style.borderColor = converted;
            if (prop === 'outlineColor') htmlEl.style.outlineColor = converted;
            if (prop === 'fill') htmlEl.style.fill = converted;
            if (prop === 'stroke') htmlEl.style.stroke = converted;
            if (prop === 'boxShadow') htmlEl.style.boxShadow = converted;
            if (prop === 'textShadow') htmlEl.style.textShadow = converted;
          }
        });
      }
    });
  }
};

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(val || 0);
};

// Build HTML markup for off-screen rendering using pure standard inline styles
const buildDocumentHTML = (doc: BillingDocument, company: CompanySettings, qrCodeDataUrl?: string): string => {
  const isQuotation = doc.document_type === 'quotation';
  const docTitle = isQuotation ? 'QUOTATION' : 'TAX INVOICE';

  const prefShowHsn = doc.show_hsn_column ?? company.show_hsn_column;
  const prefShowQty = doc.show_qty_column ?? company.show_qty_column;
  const prefShowUnit = doc.show_unit_column ?? company.show_unit_column;
  const prefShowRate = doc.show_rate_column ?? company.show_rate_column;
  const prefShowTax = doc.show_tax_column ?? company.show_tax_column;
  const prefShowBank = doc.show_bank_details ?? company.show_bank_details;
  const prefShowTerms = doc.show_terms_and_conditions ?? company.show_terms_and_conditions;

  const showHsn = prefShowHsn !== false;
  const showQty = prefShowQty !== false;
  const showUnit = prefShowUnit !== false;
  const showRate = prefShowRate !== false;
  const showTax = prefShowTax !== false;
  const totalCols = 2 + (showHsn ? 1 : 0) + (showQty ? 1 : 0) + (showUnit ? 1 : 0) + (showRate ? 1 : 0) + (showTax ? 1 : 0);

  const isInvoice = doc.document_type === 'invoice';
  const effectiveUpiId = company.upi_id?.trim() || DEFAULT_COMPANY_SETTINGS.upi_id;
  const effectiveCompanyName = company.company_name?.trim() || DEFAULT_COMPANY_SETTINGS.company_name;

  const hasBankDetails = Boolean(
    isInvoice &&
    prefShowBank !== false &&
    (
      (company.bank_name && company.bank_name.trim()) ||
      (company.account_number && company.account_number.trim()) ||
      (company.ifsc_code && company.ifsc_code.trim()) ||
      (company.branch && company.branch.trim()) ||
      effectiveUpiId
    )
  );

  const showTerms = prefShowTerms !== false && Boolean(doc.terms && doc.terms.trim());

  const itemsRows = (doc.items && doc.items.length > 0)
    ? doc.items.map((item, index) => `
      <tr style="background-color:${index % 2 === 0 ? '#ffffff' : '#f9fafb'}; border-bottom:1px solid #f3f4f6;">
        <td style="padding:10px; text-align:center; font-weight:500; color:#6b7280;">${index + 1}</td>
        <td style="padding:10px 12px; font-weight:600; color:#111827; white-space:pre-wrap;">${item.description}</td>
        ${showHsn ? `<td style="padding:10px; text-align:center; color:#4b5563;">${item.hsn_sac || '-'}</td>` : ''}
        ${showQty ? `<td style="padding:10px; text-align:right; font-weight:500; color:#1f2937;">${item.quantity ? item.quantity : '-'}</td>` : ''}
        ${showUnit ? `<td style="padding:10px; text-align:center; color:#4b5563;">${item.unit || '-'}</td>` : ''}
        ${showRate ? `<td style="padding:10px; text-align:right; color:#1f2937;">${formatCurrency(item.rate)}</td>` : ''}
        ${showTax ? `<td style="padding:10px; text-align:right; color:#4b5563;">${item.tax_percent}%</td>` : ''}
        <td style="padding:10px 12px; text-align:right; font-weight:700; color:#111827;">${formatCurrency(item.amount)}</td>
      </tr>
    `).join('')
    : `<tr><td colSpan="${totalCols}" style="padding:24px; text-align:center; color:#9ca3af;">No line items added</td></tr>`;

  return `
    <div style="position:relative; overflow:hidden; background:#ffffff; padding:32px; font-family:sans-serif; max-width:800px; margin:0 auto; border:1px solid #e5e7eb; border-radius:12px; color:#1f2937;">
      <!-- Background Watermark -->
      <div style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:0; overflow:hidden;">
        <span style="font-size:52px; font-weight:900; text-transform:uppercase; letter-spacing:0.12em; color:rgba(31, 41, 55, 0.04); transform:rotate(-35deg); text-align:center; white-space:nowrap; user-select:none;">
          ${company.company_name || 'New SB Engineering'}
        </span>
      </div>

      <div style="position:relative; z-index:10;">
        <!-- Header -->
      <div style="display:flex; justify-content:space-between; border-bottom:2px solid #dc2626; padding-bottom:24px; gap:24px;">
        <div>
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:8px;">
            ${company.logo_url ? `
              <img src="${company.logo_url}" alt="${company.company_name}" style="height:80px; max-width:220px; object-fit:contain; flex-shrink:0; border:2px solid #cbd5e1; border-radius:12px; padding:6px; background:#ffffff;" />
            ` : `
              <div style="width:48px; height:48px; background:#dc2626; color:#ffffff; font-weight:900; font-size:24px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; border:2px solid #b91c1c;">SB</div>
            `}
            <div>
              <h1 style="font-size:24px; font-weight:900; text-transform:uppercase; color:#111827; margin:0; line-height:1.2;">${company.company_name}</h1>
              ${company.tagline ? `<p style="font-size:12px; color:#dc2626; font-weight:500; text-transform:uppercase; margin:0;">${company.tagline}</p>` : ''}
            </div>
          </div>
          <div style="font-size:12px; color:#4b5563; margin-top:8px; line-height:1.4;">
            <p style="margin:0;">${company.address}, ${company.city_state_zip}</p>
            <p style="margin:0;">Phone: ${company.phone} | Email: ${company.email}</p>
            ${company.gstin ? `<p style="font-weight:600; color:#1f2937; margin:0;">GSTIN: ${company.gstin}</p>` : ''}
          </div>
        </div>

        <div style="text-align:right;">
          <span style="display:inline-block; padding:6px 16px; background:#fef2f2; color:#b91c1c; font-weight:900; font-size:18px; border-radius:8px; border:1px solid #fecaca;">
            ${docTitle}
          </span>
          <div style="font-size:12px; color:#4b5563; margin-top:8px; line-height:1.5;">
            <p style="margin:0;"><span style="font-weight:600; color:#111827;">Document No:</span> ${doc.document_number}</p>
            <p style="margin:0;"><span style="font-weight:600; color:#111827;">Issue Date:</span> ${doc.issue_date}</p>
            ${doc.due_date && doc.due_date.trim() !== '' ? `<p style="margin:0;"><span style="font-weight:600; color:#111827;">${isQuotation ? 'Valid Until:' : 'Due Date:'}</span> ${doc.due_date}</p>` : ''}
            ${doc.reference_no ? `<p style="margin:0;"><span style="font-weight:600; color:#111827;">Ref / P.O. No:</span> ${doc.reference_no}</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Client Info -->
      <div style="margin:24px 0; padding:16px; background:#f9fafb; border-radius:12px; border:1px solid #f3f4f6;">
        <h3 style="font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; margin:0 0 8px 0;">Billed To / Client</h3>
        <p style="font-weight:700; color:#111827; font-size:16px; margin:0;">${doc.client_name}</p>
        ${doc.client_company ? `<p style="font-size:14px; font-weight:500; color:#374151; margin:2px 0 0 0;">${doc.client_company}</p>` : ''}
        ${doc.client_address ? `<p style="font-size:12px; color:#4b5563; margin:4px 0 0 0;">${doc.client_address}</p>` : ''}
        ${doc.client_gstin ? `<p style="font-size:12px; font-weight:600; color:#1f2937; margin:4px 0 0 0;">GSTIN: ${doc.client_gstin}</p>` : ''}
        ${doc.client_phone ? `<p style="font-size:12px; color:#4b5563; margin:2px 0 0 0;">Phone: ${doc.client_phone}</p>` : ''}
        ${doc.client_email ? `<p style="font-size:12px; color:#4b5563; margin:2px 0 0 0;">Email: ${doc.client_email}</p>` : ''}
      </div>

      <!-- Line Items Table -->
      <div style="margin:24px 0; overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="background:#1f2937; color:#ffffff; font-size:11px; text-transform:uppercase;">
              <th style="padding:10px; width:40px; text-align:center;">#</th>
              <th style="padding:10px;">Description</th>
              ${showHsn ? `<th style="padding:10px; text-align:center;">HSN/SAC</th>` : ''}
              ${showQty ? `<th style="padding:10px; text-align:right;">Qty</th>` : ''}
              ${showUnit ? `<th style="padding:10px; text-align:center;">Unit</th>` : ''}
              ${showRate ? `<th style="padding:10px; text-align:right;">Rate</th>` : ''}
              ${showTax ? `<th style="padding:10px; text-align:right;">Tax %</th>` : ''}
              <th style="padding:10px; text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody style="font-size:12px;">
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <!-- Bank Details & Totals -->
      <div style="display:flex; justify-content:${hasBankDetails ? 'space-between' : 'flex-end'}; gap:32px; margin:24px 0; padding-top:16px; border-top:1px solid #e5e7eb;">
        <!-- Bank Info -->
        ${hasBankDetails ? `
        <div style="width:55%; font-size:12px; color:#4b5563;">
          <div style="padding:16px; background:#f9fafb; border-radius:12px; border:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
              <h4 style="font-weight:700; color:#1f2937; text-transform:uppercase; font-size:11px; margin:0 0 8px 0;">Bank Payment Details</h4>
              ${company.bank_name ? `<p style="margin:2px 0;"><span style="font-weight:500; color:#374151;">Bank Name:</span> ${company.bank_name}</p>` : ''}
              ${company.account_number ? `<p style="margin:2px 0;"><span style="font-weight:500; color:#374151;">Account No:</span> ${company.account_number}</p>` : ''}
              ${company.ifsc_code ? `<p style="margin:2px 0;"><span style="font-weight:500; color:#374151;">IFSC Code:</span> ${company.ifsc_code}</p>` : ''}
              ${company.branch ? `<p style="margin:2px 0;"><span style="font-weight:500; color:#374151;">Branch:</span> ${company.branch}</p>` : ''}
              ${company.upi_id ? `<p style="font-weight:600; color:#dc2626; margin:6px 0 0 0;">UPI ID: ${company.upi_id}</p>` : ''}
            </div>
            ${qrCodeDataUrl ? `
            <div style="text-align:center; background:#ffffff; padding:6px; border-radius:8px; border:1px solid #e5e7eb; margin-left:12px;">
              <img src="${qrCodeDataUrl}" style="width:85px; height:85px; display:block;" alt="Scan & Pay" />
              <span style="font-size:9px; font-weight:600; color:#4b5563; display:block; margin-top:3px;">Scan & Pay via UPI</span>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <!-- Totals -->
        <div style="width:${hasBankDetails ? '45%' : '350px'}; font-size:12px;">
          <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
            <span style="color:#4b5563; font-weight:500;">Subtotal:</span>
            <span style="font-weight:600; color:#1f2937;">${formatCurrency(doc.subtotal)}</span>
          </div>
          ${doc.total_tax > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6;">
              <span style="color:#4b5563; font-weight:500;">GST / Taxes:</span>
              <span style="font-weight:600; color:#1f2937;">${formatCurrency(doc.total_tax)}</span>
            </div>
          ` : ''}
          ${doc.round_off !== 0 ? `
            <div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #f3f4f6; color:#6b7280;">
              <span>Round Off:</span>
              <span>${formatCurrency(doc.round_off)}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; padding:12px; background:#dc2626; color:#ffffff; border-radius:12px; font-weight:700; font-size:14px; margin-top:12px;">
            <span>Grand Total:</span>
            <span>${formatCurrency(doc.grand_total)}</span>
          </div>
        </div>
      </div>

      <!-- Notes & Terms -->
      ${(doc.notes || showTerms) ? `
      <div style="display:flex; justify-content:space-between; gap:24px; margin:24px 0; padding-top:16px; border-top:1px solid #e5e7eb; font-size:12px;">
        ${doc.notes ? `
          <div style="width:${showTerms ? '50%' : '100%'};">
            <h4 style="font-weight:700; color:#1f2937; text-transform:uppercase; font-size:11px; margin:0 0 4px 0;">Notes & Remarks</h4>
            <p style="color:#4b5563; margin:0; white-space:pre-wrap;">${doc.notes}</p>
          </div>
        ` : ''}
        ${showTerms ? `
          <div style="width:${doc.notes ? '50%' : '100%'};">
            <h4 style="font-weight:700; color:#1f2937; text-transform:uppercase; font-size:11px; margin:0 0 4px 0;">Terms & Conditions</h4>
            <p style="color:#4b5563; margin:0; line-height:1.5;">${doc.terms}</p>
          </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- Signatures -->
      <div style="display:flex; justify-content:space-between; align-items:flex-end; width:100%; padding-top:48px; margin-top:32px; border-top:1px solid #e5e7eb; font-size:12px;">
        <div style="color:#6b7280;">
          <p style="font-weight:500; color:#374151; margin:0;">Thank you for your business!</p>
          <p style="margin:2px 0 0 0;">Computer Generated ${docTitle}</p>
        </div>
        <div style="text-align:center; margin-left:auto;">
          <p style="font-weight:700; color:#1f2937; margin:0 0 40px 0;">For ${company.company_name}</p>
          <div style="border-top:1px solid #9ca3af; padding-top:4px; width:192px; font-weight:500; color:#4b5563;">
            Authorized Signatory
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
};

const createTempRenderElement = async (doc: BillingDocument, company: CompanySettings): Promise<HTMLElement> => {
  let qrCodeDataUrl = '';
  const effectiveUpiId = company.upi_id?.trim() || DEFAULT_COMPANY_SETTINGS.upi_id;
  const effectiveCompanyName = company.company_name?.trim() || DEFAULT_COMPANY_SETTINGS.company_name;

  if (doc.document_type === 'invoice' && company.show_bank_details !== false && effectiveUpiId) {
    const upiUrl = buildUpiPaymentUrl({
      upiId: effectiveUpiId,
      payeeName: effectiveCompanyName,
      amount: doc.grand_total,
      transactionNote: `Invoice ${doc.document_number}`,
    });
    qrCodeDataUrl = await generateQrCodeDataUrl(upiUrl, { width: 140, margin: 1 });
  }

  const tempContainer = window.document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '800px';
  tempContainer.style.background = '#ffffff';
  tempContainer.innerHTML = buildDocumentHTML(doc, company, qrCodeDataUrl);
  window.document.body.appendChild(tempContainer);
  return tempContainer.firstElementChild as HTMLElement || tempContainer;
};

// Main export function to generate PDF directly
export const generateDocumentPDF = async (doc: BillingDocument, company: CompanySettings): Promise<void> => {
  const element = await createTempRenderElement(doc, company);
  const container = element.parentElement || element;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => sanitizeClonedDocForHtml2Canvas(clonedDoc),
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const isQuotation = doc.document_type === 'quotation';
    const filename = `${isQuotation ? 'Quotation' : 'Invoice'}_${doc.document_number}.pdf`;
    pdf.save(filename);
  } finally {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};

// Export PDF as File object (for native sharing)
export const generateDocumentPDFFile = async (doc: BillingDocument, company: CompanySettings): Promise<File> => {
  const element = await createTempRenderElement(doc, company);
  const container = element.parentElement || element;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => sanitizeClonedDocForHtml2Canvas(clonedDoc),
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const isQuotation = doc.document_type === 'quotation';
    const filename = `${isQuotation ? 'Quotation' : 'Invoice'}_${doc.document_number}.pdf`;
    const blob = pdf.output('blob');
    return new File([blob], filename, { type: 'application/pdf' });
  } finally {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};
