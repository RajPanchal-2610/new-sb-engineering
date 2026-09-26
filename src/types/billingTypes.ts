export type DocumentType = 'quotation' | 'invoice';

export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'paid' | 'cancelled' | 'overdue';

export interface LineItem {
  id?: string;
  document_id?: string;
  description: string;
  hsn_sac?: string;
  quantity?: number | string;
  unit?: string;
  rate: number;
  tax_percent?: number;
  amount: number;
  sort_order?: number;
}

export interface CompanySettings {
  id?: string;
  company_name: string;
  tagline: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  city_state_zip: string;
  logo_url: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch: string;
  upi_id: string;
  default_terms: string;
  show_bank_details?: boolean;
  show_terms_and_conditions?: boolean;
  show_hsn_column?: boolean;
  show_qty_column?: boolean;
  show_unit_column?: boolean;
  show_rate_column?: boolean;
  show_tax_column?: boolean;
}

export interface BillingDocument {
  id?: string;
  document_type: DocumentType;
  document_number: string;
  status: DocumentStatus;
  issue_date: string;
  due_date: string;
  reference_no: string;
  client_name: string;
  client_company: string;
  client_gstin: string;
  client_phone: string;
  client_email: string;
  client_address: string;
  subtotal: number;
  total_tax: number;
  total_discount?: number;
  round_off: number;
  grand_total: number;
  notes: string;
  terms: string;
  converted_from_id?: string;
  show_bank_details?: boolean;
  show_terms_and_conditions?: boolean;
  show_hsn_column?: boolean;
  show_qty_column?: boolean;
  show_unit_column?: boolean;
  show_rate_column?: boolean;
  show_tax_column?: boolean;
  items: LineItem[];
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  company_name: 'SB Engineering',
  tagline: 'Precision Engineering, Metal Fabrication & Industrial Services',
  gstin: '24ABCDE1234F1Z5',
  phone: '+91 98765 43210',
  email: 'info@sbengineering.com',
  address: 'Plot No. 42, GIDC Industrial Estate, Makarpura',
  city_state_zip: 'Vadodara, Gujarat - 390010',
  logo_url: '',
  bank_name: 'HDFC Bank',
  account_number: '50200012345678',
  ifsc_code: 'HDFC0001234',
  branch: 'Makarpura Branch, Vadodara',
  upi_id: 'sbengineering@hdfcbank',
  default_terms: '1. 50% Advance payment required along with Purchase Order.\n2. Balance 50% against delivery / dispatch.\n3. Taxes extra as applicable (GST 18%).\n4. Quotation valid for 30 days from date of issue.',
  show_bank_details: true,
  show_terms_and_conditions: true,
  show_hsn_column: true,
  show_qty_column: true,
  show_unit_column: true,
  show_rate_column: true,
  show_tax_column: true,
};
