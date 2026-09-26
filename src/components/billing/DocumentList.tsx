import React, { useState } from 'react';
import type { BillingDocument, CompanySettings, DocumentType } from '../../types/billingTypes';
import {
  FileText,
  Search,
  Plus,
  Share2,
  Download,
  Eye,
  Edit2,
  Trash2,
  ArrowRight,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { generateDocumentPDF } from '../../utils/pdfGenerator';

interface Props {
  documents: BillingDocument[];
  company: CompanySettings;
  onSelect: (doc: BillingDocument) => void;
  onEdit: (doc: BillingDocument) => void;
  onDelete: (id: string) => void;
  onShare: (doc: BillingDocument) => void;
  onConvert: (doc: BillingDocument) => void;
  onCreateNew: (type: DocumentType) => void;
  onStatusChange: (doc: BillingDocument, status: any) => void;
}

export const DocumentList: React.FC<Props> = ({
  documents,
  company,
  onSelect,
  onEdit,
  onDelete,
  onShare,
  onConvert,
  onCreateNew,
  onStatusChange,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'quotation' | 'invoice'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDirectDownload = async (doc: BillingDocument) => {
    if (doc.id) setDownloadingId(doc.id);
    try {
      await generateDocumentPDF(doc, company);
    } catch (err) {
      console.error('Direct download failed:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.document_number.toLowerCase().includes(search.toLowerCase()) ||
      doc.client_name.toLowerCase().includes(search.toLowerCase()) ||
      (doc.client_company && doc.client_company.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
      {/* Header & Main CTAs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quotations & Invoices</h2>
          <p className="text-xs text-gray-500">Manage, create, convert, download, and share client billing documents</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onCreateNew('quotation')}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:from-red-700 hover:to-amber-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Quotation</span>
          </button>
          <button
            onClick={() => onCreateNew('invoice')}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by doc #, client, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="all">All Document Types</option>
            <option value="quotation">Quotations Only</option>
            <option value="invoice">Invoices Only</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      {filteredDocs.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4">Document #</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs">
              {filteredDocs.map((doc) => {
                const isQuotation = doc.document_type === 'quotation';
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/80 transition group">
                    {/* Doc Number */}
                    <td className="py-3 px-4 font-bold text-gray-900 font-mono">
                      <button
                        onClick={() => onSelect(doc)}
                        className="hover:text-red-600 underline decoration-red-300 underline-offset-4"
                      >
                        {doc.document_number}
                      </button>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                          isQuotation
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {doc.document_type}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{doc.client_name}</div>
                      {doc.client_company && (
                        <div className="text-[11px] text-gray-500">{doc.client_company}</div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{doc.issue_date}</td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-bold text-gray-900 font-mono">
                      {formatCurrency(doc.grand_total)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4 text-center">
                      <select
                        value={doc.status}
                        onChange={(e) => onStatusChange(doc, e.target.value)}
                        className={`text-[11px] font-bold uppercase px-2 py-1 rounded-full border cursor-pointer ${
                          doc.status === 'paid'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : doc.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : doc.status === 'sent'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : doc.status === 'cancelled'
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Convert Quotation to Invoice */}
                        {isQuotation && (
                          <button
                            onClick={() => onConvert(doc)}
                            title="Convert to Invoice"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}

                        {/* View Preview Page */}
                        <button
                          onClick={() => onSelect(doc)}
                          title="View Preview"
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Direct PDF Download */}
                        <button
                          onClick={() => handleDirectDownload(doc)}
                          disabled={downloadingId === doc.id}
                          title="Download PDF directly"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => onShare(doc)}
                          title="Share"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEdit(doc)}
                          title="Edit"
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDelete(doc.id!)}
                          title="Delete"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No Documents Found</h3>
          <p className="text-xs text-gray-500 mb-4">Get started by creating your first quotation or invoice</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => onCreateNew('quotation')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-xs hover:bg-red-700 transition"
            >
              Create Quotation
            </button>
            <button
              onClick={() => onCreateNew('invoice')}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-xs hover:bg-gray-800 transition"
            >
              Create Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
