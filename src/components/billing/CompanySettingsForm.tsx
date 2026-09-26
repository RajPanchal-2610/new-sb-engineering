import React, { useState } from 'react';
import type { CompanySettings } from '../../types/billingTypes';
import { Save, Building, CreditCard, FileText, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface Props {
  initialSettings: CompanySettings;
  onSave: (settings: CompanySettings) => Promise<void>;
}

export const CompanySettingsForm: React.FC<Props> = ({ initialSettings, onSave }) => {
  const [settings, setSettings] = useState<CompanySettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please choose a smaller logo image.');
      return;
    }

    setUploadingLogo(true);
    try {
      // 1. Attempt upload to Supabase Storage bucket 'project-images'
      const fileExt = file.name.split('.').pop();
      const fileName = `logos/company_logo_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, { upsert: true });

      if (!uploadError) {
        const publicUrl = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName).data.publicUrl;

        setSettings((prev) => ({ ...prev, logo_url: publicUrl }));
        setUploadingLogo(false);
        return;
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback to Data URL:', err);
    }

    // 2. Fallback to Data URL encoding if Supabase Storage is unavailable
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSettings((prev) => ({ ...prev, logo_url: dataUrl }));
      setUploadingLogo(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await onSave(settings);
      setSuccessMsg('Company details saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Company Profile & Billing Settings</h2>
          <p className="text-xs sm:text-sm text-gray-500">Configure business information shown on your Quotations and Invoices</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-red-700 hover:to-amber-700 transition shadow-sm disabled:opacity-50 w-full sm:w-auto shrink-0"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Basic Company Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b pb-2">
          <Building className="w-5 h-5 text-red-600" />
          <span>Basic Information</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={settings.company_name}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tagline / Subtitle</label>
            <input
              type="text"
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">GSTIN Number</label>
            <input
              type="text"
              name="gstin"
              value={settings.gstin}
              onChange={handleChange}
              placeholder="e.g. 24ABCDE1234F1Z5"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>

          {/* Logo Upload Section */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase">Company Logo</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition">
              {settings.logo_url ? (
                <div className="relative group shrink-0">
                  <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center min-w-32 h-16">
                    <img src={settings.logo_url} alt="Company Logo Preview" className="max-h-12 max-w-44 object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, logo_url: '' }))}
                    title="Remove Logo"
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 text-gray-400 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-2 flex-grow">
                <div className="flex flex-wrap items-center gap-3">
                  <label className={`cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-xs transition shadow-sm ${uploadingLogo ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 text-red-600" />
                    )}
                    <span>{uploadingLogo ? 'Uploading Logo...' : 'Upload Logo Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>
                  {settings.logo_url && (
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, logo_url: '' }))}
                      className="text-xs font-medium text-red-600 hover:text-red-700 transition"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">Supports PNG, JPG, SVG or WebP (Max 2MB). Recommended aspect ratio ~ 2:1.</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Street Address</label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City, State & Pincode</label>
            <input
              type="text"
              name="city_state_zip"
              value={settings.city_state_zip}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bank & Payment Details */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>Bank Account & Payment Details</span>
          </div>
          <label className="inline-flex items-center cursor-pointer gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
            <input
              type="checkbox"
              name="show_bank_details"
              checked={settings.show_bank_details !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_bank_details: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">Show Bank Details on Invoice & Quotation</span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Bank Name</label>
            <input
              type="text"
              name="bank_name"
              value={settings.bank_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Number</label>
            <input
              type="text"
              name="account_number"
              value={settings.account_number}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">IFSC Code</label>
            <input
              type="text"
              name="ifsc_code"
              value={settings.ifsc_code}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Branch Name</label>
            <input
              type="text"
              name="branch"
              value={settings.branch}
              onChange={handleChange}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">UPI ID / VPA</label>
            <input
              type="text"
              name="upi_id"
              value={settings.upi_id}
              onChange={handleChange}
              placeholder="sbengineering@upi"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Line Item Table Columns Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-base font-semibold text-gray-800 border-b pb-2">
          <FileText className="w-5 h-5 text-red-600" />
          <span>Line Item Table Columns Configuration</span>
        </div>
        <p className="text-xs text-gray-500">
          Choose which columns to show or hide when creating and printing Quotations and Invoices.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_qty_column !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_qty_column: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">Quantity (Qty) Column</span>
              <span className="text-[11px] text-gray-500">Show item quantity input</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_unit_column !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_unit_column: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">Unit Column</span>
              <span className="text-[11px] text-gray-500">Show unit of measurement (Pcs, Nos, Kg, etc.)</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_rate_column !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_rate_column: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">Rate Column</span>
              <span className="text-[11px] text-gray-500">Show unit rate (if disabled, enter Amount directly)</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_tax_column !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_tax_column: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">GST / Tax % Column</span>
              <span className="text-[11px] text-gray-500">Show item GST percentage input</span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-100/70 transition cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_hsn_column !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_hsn_column: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">HSN / SAC Code Column</span>
              <span className="text-[11px] text-gray-500">Show HSN/SAC code input</span>
            </div>
          </label>
        </div>
      </div>

      {/* Default Terms & Conditions */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
            <FileText className="w-5 h-5 text-red-600" />
            <span>Default Terms & Conditions</span>
          </div>
          <label className="inline-flex items-center cursor-pointer gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
            <input
              type="checkbox"
              name="show_terms_and_conditions"
              checked={settings.show_terms_and_conditions !== false}
              onChange={(e) => setSettings((prev) => ({ ...prev, show_terms_and_conditions: e.target.checked }))}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">Show Terms & Conditions on Invoice & Quotation</span>
          </label>
        </div>
        <div>
          <textarea
            name="default_terms"
            rows={4}
            value={settings.default_terms}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm font-mono"
            placeholder="Enter standard terms and conditions..."
          />
        </div>
      </div>
    </form>
  );
};
