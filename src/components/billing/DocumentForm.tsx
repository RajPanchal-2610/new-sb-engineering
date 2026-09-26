import React, { useState, useEffect } from 'react';
import type { BillingDocument, CompanySettings, DocumentType, LineItem } from '../../types/billingTypes';
import { Plus, Trash2, Save, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import { generateNextDocumentNumber } from '../../services/billingService';

interface Props {
  initialDocument?: BillingDocument | null;
  companySettings: CompanySettings;
  defaultType?: DocumentType;
  onSave: (doc: BillingDocument) => Promise<void>;
  onCancel: () => void;
  onPreview: (doc: BillingDocument) => void;
}

export const DocumentForm: React.FC<Props> = ({
  initialDocument,
  companySettings,
  defaultType = 'quotation',
  onSave,
  onCancel,
  onPreview,
}) => {
  const [docType, setDocType] = useState<DocumentType>(initialDocument?.document_type || defaultType);
  const [docNumber, setDocNumber] = useState<string>(initialDocument?.document_number || '');
  const [status, setStatus] = useState(initialDocument?.status || 'draft');
  
  const today = new Date().toISOString().split('T')[0];
  const defaultDueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [issueDate, setIssueDate] = useState(initialDocument?.issue_date || today);
  const [dueDate, setDueDate] = useState(initialDocument?.due_date || '');
  const [referenceNo, setReferenceNo] = useState(initialDocument?.reference_no || '');

  // Client Details
  const [clientName, setClientName] = useState(initialDocument?.client_name || '');
  const [clientCompany, setClientCompany] = useState(initialDocument?.client_company || '');
  const [clientGstin, setClientGstin] = useState(initialDocument?.client_gstin || '');
  const [clientPhone, setClientPhone] = useState(initialDocument?.client_phone || '');
  const [clientEmail, setClientEmail] = useState(initialDocument?.client_email || '');
  const [clientAddress, setClientAddress] = useState(initialDocument?.client_address || '');

  // Notes & Terms
  const [notes, setNotes] = useState(initialDocument?.notes || '');
  const [terms, setTerms] = useState(
    initialDocument?.terms !== undefined
      ? initialDocument.terms
      : (companySettings.show_terms_and_conditions !== false ? companySettings.default_terms : '')
  );

  // Items
  const [items, setItems] = useState<LineItem[]>(
    initialDocument?.items?.length
      ? initialDocument.items
      : [
          {
            description: '',
            hsn_sac: '',
            quantity: 1,
            unit: 'Pcs',
            rate: 0,
            discount_percent: 0,
            tax_percent: 18,
            amount: 0,
          },
        ]
  );

  const [saving, setSaving] = useState(false);

  // Sync document type when creating a new document
  useEffect(() => {
    if (!initialDocument && defaultType) {
      setDocType(defaultType);
    }
  }, [defaultType, initialDocument]);

  // Auto-generate number whenever docType changes for new documents
  useEffect(() => {
    if (!initialDocument) {
      generateNextDocumentNumber(docType).then((num) => setDocNumber(num));
    }
  }, [docType, initialDocument]);

  const handleRegenerateNumber = async () => {
    const num = await generateNextDocumentNumber(docType);
    setDocNumber(num);
  };

  const showHsnCol = companySettings.show_hsn_column !== false;
  const showQtyCol = companySettings.show_qty_column !== false;
  const showUnitCol = companySettings.show_unit_column !== false;
  const showRateCol = companySettings.show_rate_column !== false;
  const showTaxCol = companySettings.show_tax_column !== false;

  // Recalculate item amount
  const getQtyMultiplier = (qtyVal: any) => {
    if (qtyVal === '' || qtyVal === undefined || qtyVal === null) return 1;
    const num = Number(qtyVal);
    return isNaN(num) || num === 0 ? 1 : num;
  };

  const calculateItemAmount = (qtyVal: any, rateVal: any, discVal: any, taxVal: any) => {
    const qtyMultiplier = getQtyMultiplier(qtyVal);
    const rate = Number(rateVal) || 0;
    const disc = Number(discVal) || 0;
    const tax = Number(taxVal) || 0;

    const base = qtyMultiplier * rate;
    const afterDisc = base - (base * disc) / 100;
    const taxAmount = (afterDisc * tax) / 100;
    return Math.round((afterDisc + taxAmount) * 100) / 100;
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    if (!showRateCol && field === 'amount') {
      const numAmount = Number(value) || 0;
      current.amount = numAmount;
      current.rate = numAmount;
    } else if (showRateCol) {
      current.amount = calculateItemAmount(
        showQtyCol ? current.quantity : 1,
        current.rate,
        current.discount_percent,
        showTaxCol ? current.tax_percent : 0
      );
    }
    updated[index] = current as LineItem;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: '',
        hsn_sac: '',
        quantity: showQtyCol ? 1 : '',
        unit: showUnitCol ? 'Pcs' : '',
        rate: 0,
        discount_percent: 0,
        tax_percent: showTaxCol ? 18 : 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Financial Calculations
  const subtotal = items.reduce((acc, item) => {
    if (!showRateCol) return acc + (Number(item.amount) || 0);
    const qty = showQtyCol ? getQtyMultiplier(item.quantity) : 1;
    const rate = Number(item.rate) || 0;
    return acc + qty * rate;
  }, 0);

  const totalDiscount = items.reduce((acc, item) => {
    if (!showRateCol) return acc;
    const qty = showQtyCol ? getQtyMultiplier(item.quantity) : 1;
    const rate = Number(item.rate) || 0;
    const disc = Number(item.discount_percent) || 0;
    return acc + (qty * rate * disc) / 100;
  }, 0);

  const totalTax = items.reduce((acc, item) => {
    if (!showTaxCol) return acc;
    const qty = showQtyCol ? getQtyMultiplier(item.quantity) : 1;
    const rate = showRateCol ? (Number(item.rate) || 0) : (Number(item.amount) || 0);
    const disc = showRateCol ? (Number(item.discount_percent) || 0) : 0;
    const tax = Number(item.tax_percent) || 0;
    const taxableAmount = qty * rate - (qty * rate * disc) / 100;
    return acc + (taxableAmount * tax) / 100;
  }, 0);

  const unroundedTotal = subtotal - totalDiscount + totalTax;
  const grandTotal = Math.round(unroundedTotal);
  const roundOff = Math.round((grandTotal - unroundedTotal) * 100) / 100;

  const buildDocObject = (): BillingDocument => ({
    ...(initialDocument?.id ? { id: initialDocument.id } : {}),
    document_type: docType,
    document_number: docNumber,
    status: status as any,
    issue_date: issueDate || '',
    due_date: dueDate || '',
    reference_no: referenceNo,
    client_name: clientName,
    client_company: clientCompany,
    client_gstin: clientGstin,
    client_phone: clientPhone,
    client_email: clientEmail,
    client_address: clientAddress,
    subtotal: Math.round(subtotal * 100) / 100,
    total_tax: Math.round(totalTax * 100) / 100,
    total_discount: Math.round(totalDiscount * 100) / 100,
    round_off: roundOff,
    grand_total: grandTotal,
    notes,
    terms,
    ...(initialDocument?.converted_from_id ? { converted_from_id: initialDocument.converted_from_id } : {}),
    items,
    ...(initialDocument?.created_at ? { created_at: initialDocument.created_at } : {}),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Please enter client name');
      return;
    }
    if (items.some((i) => !i.description.trim())) {
      alert('Please fill description for all items');
      return;
    }

    setSaving(true);
    try {
      await onSave(buildDocObject());
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewClick = () => {
    onPreview(buildDocObject());
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-8 shadow-sm">
      {/* Form Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialDocument ? `Edit ${docType.toUpperCase()}` : `Create New ${docType.toUpperCase()}`}
            </h2>
            <p className="text-xs text-gray-500">Fill details below to generate a professional document</p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePreviewClick}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition"
          >
            <Eye className="w-4 h-4 text-gray-600" />
            <span>Preview</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:from-red-700 hover:to-amber-700 transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Document'}</span>
          </button>
        </div>
      </div>

      {/* Document Type & Numbering */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Document Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm font-semibold bg-white"
          >
            <option value="quotation">QUOTATION</option>
            <option value="invoice">TAX INVOICE</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Document Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm font-mono font-bold bg-white"
            />
            {!initialDocument && (
              <button
                type="button"
                onClick={handleRegenerateNumber}
                title="Generate Next Number"
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-white"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Ref / P.O. Number</label>
          <input
            type="text"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            placeholder="e.g. PO-98765"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Issue Date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
            {docType === 'quotation' ? 'Valid Until' : 'Due Date'} <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm bg-white"
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-2">
          Client / Billed To Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Client Contact Name *</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Rajesh Patel"
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Company / Organization</label>
            <input
              type="text"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              placeholder="e.g. Reliance Engineering Ltd"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Client GSTIN</label>
            <input
              type="text"
              value={clientGstin}
              onChange={(e) => setClientGstin(e.target.value)}
              placeholder="24XYZAB9876C1Z4"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+91 98250 12345"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@company.com"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Billing Address</label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Plot No, Road, City, Pincode"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Itemized Line Items</h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[200px]">Description *</th>
                {showHsnCol && <th className="py-2.5 px-2 w-28">HSN/SAC</th>}
                {showQtyCol && <th className="py-2.5 px-2 w-20 text-right">Qty</th>}
                {showUnitCol && <th className="py-2.5 px-2 w-24">Unit</th>}
                {showRateCol && <th className="py-2.5 px-2 w-28 text-right">Rate (₹)</th>}
                {showRateCol && <th className="py-2.5 px-2 w-20 text-right">Disc %</th>}
                {showTaxCol && <th className="py-2.5 px-2 w-20 text-right">GST %</th>}
                <th className="py-2.5 px-3 w-36 text-right">Amount (₹) *</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/80">
                  <td className="py-2 px-3 text-center text-gray-400 font-medium">{index + 1}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="e.g. Fabrication of Heavy MS Structural Frame"
                      required
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 text-xs"
                    />
                  </td>
                  {showHsnCol && (
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={item.hsn_sac || ''}
                        onChange={(e) => handleItemChange(index, 'hsn_sac', e.target.value)}
                        placeholder="Optional"
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-center text-xs"
                      />
                    </td>
                  )}
                  {showQtyCol && (
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="-"
                        value={item.quantity ?? ''}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-right text-xs"
                      />
                    </td>
                  )}
                  {showUnitCol && (
                    <td className="py-2 px-2">
                      <select
                        value={item.unit || ''}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        className="w-full px-1.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                      >
                        <option value="">- None -</option>
                        <option value="Pcs">Pcs</option>
                        <option value="Nos">Nos</option>
                        <option value="Mtr">Mtr</option>
                        <option value="Sq.Ft">Sq.Ft</option>
                        <option value="Kg">Kg</option>
                        <option value="Ton">Ton</option>
                        <option value="Set">Set</option>
                        <option value="Hrs">Hrs</option>
                        <option value="Lot">Lot</option>
                      </select>
                    </td>
                  )}
                  {showRateCol && (
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-right text-xs"
                      />
                    </td>
                  )}
                  {showRateCol && (
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        value={item.discount_percent}
                        onChange={(e) => handleItemChange(index, 'discount_percent', e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-right text-xs"
                      />
                    </td>
                  )}
                  {showTaxCol && (
                    <td className="py-2 px-2">
                      <select
                        value={item.tax_percent}
                        onChange={(e) => handleItemChange(index, 'tax_percent', e.target.value)}
                        className="w-full px-1 py-1.5 border border-gray-300 rounded text-right text-xs bg-white"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </td>
                  )}
                  <td className="py-2 px-3 text-right font-bold text-gray-900">
                    {showRateCol ? (
                      `₹${item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    ) : (
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.amount || ''}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        required
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-right font-bold text-xs"
                      />
                    )}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-30 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Totals Summary */}
      <div className="flex justify-end pt-4 border-t">
        <div className="w-full max-w-sm space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Total Discount:</span>
              <span>- ₹{totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Total GST / Tax:</span>
            <span className="font-semibold text-gray-800">₹{totalTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Round Off:</span>
            <span>₹{roundOff.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-red-600 pt-2 border-t border-gray-200">
            <span>Grand Total:</span>
            <span>₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Notes / Remarks</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes for the client..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase">Terms & Conditions</label>
            <button
              type="button"
              onClick={() => setTerms(companySettings.default_terms)}
              className="text-[11px] text-red-600 font-medium hover:underline"
            >
              Reset to Defaults
            </button>
          </div>
          <textarea
            rows={3}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Terms and conditions..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
          />
        </div>
      </div>
    </form>
  );
};
