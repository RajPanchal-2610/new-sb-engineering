import React, { useState, useEffect } from 'react';
import type { BillingDocument, CompanySettings, DocumentType } from '../types/billingTypes';
import { DEFAULT_COMPANY_SETTINGS } from '../types/billingTypes';
import {
  getCompanySettings,
  saveCompanySettings,
  getDocuments,
  saveDocument,
  deleteDocument,
  convertQuotationToInvoice,
} from '../services/billingService';
import { DocumentList } from '../components/billing/DocumentList';
import { DocumentForm } from '../components/billing/DocumentForm';
import { DocumentPreview } from '../components/billing/DocumentPreview';
import { DocumentShareModal } from '../components/billing/DocumentShareModal';
import { CompanySettingsForm } from '../components/billing/CompanySettingsForm';
import { FileText, PlusCircle, Settings, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'list' | 'form' | 'preview' | 'settings';

export const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [documents, setDocuments] = useState<BillingDocument[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(DEFAULT_COMPANY_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [activeDoc, setActiveDoc] = useState<BillingDocument | null>(null);
  const [defaultCreateType, setDefaultCreateType] = useState<DocumentType>('quotation');
  const [shareDoc, setShareDoc] = useState<BillingDocument | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, docsData] = await Promise.all([
        getCompanySettings(),
        getDocuments(),
      ]);
      setCompanySettings(settingsData);
      setDocuments(docsData);
    } catch (err) {
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = (type: DocumentType) => {
    setActiveDoc(null);
    setDefaultCreateType(type);
    setViewMode('form');
  };

  const handleSelectDoc = (doc: BillingDocument) => {
    setActiveDoc(doc);
    setViewMode('preview');
  };

  const handleEditDoc = (doc: BillingDocument) => {
    setActiveDoc(doc);
    setDefaultCreateType(doc.document_type);
    setViewMode('form');
  };

  const handleSaveDoc = async (doc: BillingDocument) => {
    try {
      const saved = await saveDocument(doc);
      setActiveDoc(saved);
      await loadData();
      setViewMode('preview');
    } catch (err) {
      alert('Failed to save document');
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
      await loadData();
      if (activeDoc?.id === id) {
        setActiveDoc(null);
        setViewMode('list');
      }
    }
  };

  const handleConvertQuotation = async (doc: BillingDocument) => {
    if (!doc.id) return;
    if (confirm(`Convert Quotation ${doc.document_number} into a new Invoice?`)) {
      try {
        const newInv = await convertQuotationToInvoice(doc.id);
        await loadData();
        setActiveDoc(newInv);
        setViewMode('preview');
      } catch (err) {
        alert('Failed to convert quotation');
      }
    }
  };

  const handleStatusChange = async (doc: BillingDocument, status: any) => {
    const updated = { ...doc, status };
    await saveDocument(updated);
    await loadData();
  };

  const handleSaveCompanySettings = async (settings: CompanySettings) => {
    const saved = await saveCompanySettings(settings);
    setCompanySettings(saved);
  };

  return (
    <div className="min-h-screen bg-gray-100/60 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Header / Breadcrumbs */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/admin-panel')}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
            <div className="h-4 w-px bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600 shrink-0" />
              <h1 className="text-base sm:text-lg font-bold text-gray-900">Quotation & Invoice Manager</h1>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 p-1.5 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setActiveDoc(null);
                setViewMode('list');
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition whitespace-nowrap ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 text-red-600 shrink-0" />
              <span>All Documents ({documents.length})</span>
            </button>

            <button
              onClick={() => handleCreateNew('quotation')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition whitespace-nowrap ${
                viewMode === 'form' && defaultCreateType === 'quotation' && !activeDoc
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>New Quotation</span>
            </button>

            <button
              onClick={() => handleCreateNew('invoice')}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition whitespace-nowrap ${
                viewMode === 'form' && defaultCreateType === 'invoice' && !activeDoc
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>New Invoice</span>
            </button>

            <button
              onClick={() => {
                setActiveDoc(null);
                setViewMode('settings');
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition whitespace-nowrap ${
                viewMode === 'settings'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 text-gray-700 shrink-0" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 font-medium border border-gray-200 shadow-sm">
            Loading Billing Data...
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <DocumentList
                documents={documents}
                company={companySettings}
                onSelect={handleSelectDoc}
                onEdit={handleEditDoc}
                onDelete={handleDeleteDoc}
                onShare={setShareDoc}
                onConvert={handleConvertQuotation}
                onCreateNew={handleCreateNew}
                onStatusChange={handleStatusChange}
              />
            )}

            {viewMode === 'form' && (
              <DocumentForm
                initialDocument={activeDoc}
                companySettings={companySettings}
                defaultType={defaultCreateType}
                onSave={handleSaveDoc}
                onCancel={() => setViewMode('list')}
                onPreview={(doc) => {
                  setActiveDoc(doc);
                  setViewMode('preview');
                }}
              />
            )}

            {viewMode === 'preview' && activeDoc && (
              <DocumentPreview
                document={activeDoc}
                company={companySettings}
                onBack={() => setViewMode('list')}
                onShare={() => setShareDoc(activeDoc)}
              />
            )}

            {viewMode === 'settings' && (
              <CompanySettingsForm
                initialSettings={companySettings}
                onSave={handleSaveCompanySettings}
              />
            )}
          </>
        )}
      </div>

      {/* Share Modal */}
      {shareDoc && (
        <DocumentShareModal
          document={shareDoc}
          company={companySettings}
          onClose={() => setShareDoc(null)}
        />
      )}
    </div>
  );
};

export default BillingPage;
