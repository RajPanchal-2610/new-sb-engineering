import { supabase } from '../supabaseClient';
import type { BillingDocument, CompanySettings, DocumentType } from '../types/billingTypes';
import { DEFAULT_COMPANY_SETTINGS } from '../types/billingTypes';

// --- COMPANY SETTINGS ---
export const getCompanySettings = async (): Promise<CompanySettings> => {
  try {
    const { data, error } = await supabase
      .from('billing_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching company settings from Supabase:', error);
      return DEFAULT_COMPANY_SETTINGS;
    }

    if (!data) {
      return DEFAULT_COMPANY_SETTINGS;
    }

    const fetched = data as Partial<CompanySettings>;

    return {
      ...DEFAULT_COMPANY_SETTINGS,
      ...fetched,
      show_bank_details:
        fetched.show_bank_details !== undefined && fetched.show_bank_details !== null
          ? Boolean(fetched.show_bank_details)
          : (DEFAULT_COMPANY_SETTINGS.show_bank_details ?? true),
      show_terms_and_conditions:
        fetched.show_terms_and_conditions !== undefined && fetched.show_terms_and_conditions !== null
          ? Boolean(fetched.show_terms_and_conditions)
          : (DEFAULT_COMPANY_SETTINGS.show_terms_and_conditions ?? true),
      show_hsn_column:
        fetched.show_hsn_column !== undefined && fetched.show_hsn_column !== null
          ? Boolean(fetched.show_hsn_column)
          : (DEFAULT_COMPANY_SETTINGS.show_hsn_column ?? true),
      show_qty_column:
        fetched.show_qty_column !== undefined && fetched.show_qty_column !== null
          ? Boolean(fetched.show_qty_column)
          : (DEFAULT_COMPANY_SETTINGS.show_qty_column ?? true),
      show_unit_column:
        fetched.show_unit_column !== undefined && fetched.show_unit_column !== null
          ? Boolean(fetched.show_unit_column)
          : (DEFAULT_COMPANY_SETTINGS.show_unit_column ?? true),
      show_rate_column:
        fetched.show_rate_column !== undefined && fetched.show_rate_column !== null
          ? Boolean(fetched.show_rate_column)
          : (DEFAULT_COMPANY_SETTINGS.show_rate_column ?? true),
      show_tax_column:
        fetched.show_tax_column !== undefined && fetched.show_tax_column !== null
          ? Boolean(fetched.show_tax_column)
          : (DEFAULT_COMPANY_SETTINGS.show_tax_column ?? true),
    };
  } catch (err) {
    console.error('Failed to get company settings:', err);
    return DEFAULT_COMPANY_SETTINGS;
  }
};

export const saveCompanySettings = async (settings: CompanySettings): Promise<CompanySettings> => {
  const existing = await getCompanySettings();

  const payload = {
    company_name: settings.company_name,
    tagline: settings.tagline,
    gstin: settings.gstin,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    city_state_zip: settings.city_state_zip,
    logo_url: settings.logo_url,
    bank_name: settings.bank_name,
    account_number: settings.account_number,
    ifsc_code: settings.ifsc_code,
    branch: settings.branch,
    upi_id: settings.upi_id,
    default_terms: settings.default_terms,
    show_bank_details: settings.show_bank_details !== false,
    show_terms_and_conditions: settings.show_terms_and_conditions !== false,
    show_hsn_column: settings.show_hsn_column !== false,
    show_qty_column: settings.show_qty_column !== false,
    show_unit_column: settings.show_unit_column !== false,
    show_rate_column: settings.show_rate_column !== false,
    show_tax_column: settings.show_tax_column !== false,
    updated_at: new Date().toISOString(),
  };

  if (existing.id) {
    const { data, error } = await supabase
      .from('billing_settings')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company settings in Supabase:', error);
      throw error;
    }
    return { ...settings, ...data };
  } else {
    const { data, error } = await supabase
      .from('billing_settings')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error inserting company settings in Supabase:', error);
      throw error;
    }
    return { ...settings, ...data };
  }
};

// --- GET ALL DOCUMENTS ---
export const getDocuments = async (typeFilter?: DocumentType): Promise<BillingDocument[]> => {
  try {
    let query = supabase
      .from('billing_documents')
      .select('*, items:billing_items(*)')
      .order('created_at', { ascending: false });

    if (typeFilter) {
      query = query.eq('document_type', typeFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching documents from Supabase:', error);
      return [];
    }

    return (data || []).map((doc: any) => ({
      ...doc,
      items: doc.items || [],
    })) as BillingDocument[];
  } catch (err) {
    console.error('Failed to get documents:', err);
    return [];
  }
};

// --- GET SINGLE DOCUMENT ---
export const getDocumentById = async (id: string): Promise<BillingDocument | null> => {
  try {
    const { data, error } = await supabase
      .from('billing_documents')
      .select('*, items:billing_items(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching document by id from Supabase:', error);
      return null;
    }

    if (!data) return null;

    return {
      ...data,
      items: data.items || [],
    } as BillingDocument;
  } catch (err) {
    console.error('Failed to get document by id:', err);
    return null;
  }
};

// --- SAVE / UPDATE DOCUMENT ---
export const saveDocument = async (document: BillingDocument): Promise<BillingDocument> => {
  const isNew = !document.id;
  const now = new Date().toISOString();

  const { items, ...headerData } = document;

  const payload = {
    document_type: headerData.document_type,
    document_number: headerData.document_number,
    status: headerData.status,
    issue_date: headerData.issue_date,
    due_date: headerData.due_date || headerData.issue_date || '',
    reference_no: headerData.reference_no || '',
    client_name: headerData.client_name || '',
    client_company: headerData.client_company || '',
    client_gstin: headerData.client_gstin || '',
    client_phone: headerData.client_phone || '',
    client_email: headerData.client_email || '',
    client_address: headerData.client_address || '',
    subtotal: Number(headerData.subtotal) || 0,
    total_tax: Number(headerData.total_tax) || 0,
    total_discount: Number(headerData.total_discount) || 0,
    round_off: Number(headerData.round_off) || 0,
    grand_total: Number(headerData.grand_total) || 0,
    notes: headerData.notes || '',
    terms: headerData.terms || '',
    converted_from_id: headerData.converted_from_id || null,
    updated_at: now,
  };

  let savedDocId = document.id;

  if (isNew) {
    const { data: newDoc, error: insertError } = await supabase
      .from('billing_documents')
      .insert([{ ...payload, created_at: headerData.created_at || now }])
      .select()
      .single();

    if (insertError || !newDoc) {
      console.error('Error inserting document into Supabase:', insertError);
      throw insertError || new Error('Failed to insert document into Supabase');
    }
    savedDocId = newDoc.id;
  } else {
    const { error: updateError } = await supabase
      .from('billing_documents')
      .update(payload)
      .eq('id', savedDocId!);

    if (updateError) {
      console.error('Error updating document in Supabase:', updateError);
      throw updateError;
    }
  }

  // Handle line items
  if (!isNew && savedDocId) {
    await supabase.from('billing_items').delete().eq('document_id', savedDocId);
  }

  if (items && items.length > 0 && savedDocId) {
    const itemPayloads = items.map((it, idx) => ({
      document_id: savedDocId,
      description: it.description,
      hsn_sac: it.hsn_sac || '',
      quantity: Number(it.quantity) || 1,
      unit: it.unit || 'Pcs',
      rate: Number(it.rate) || 0,
      discount_percent: Number(it.discount_percent) || 0,
      tax_percent: Number(it.tax_percent) || 0,
      amount: Number(it.amount) || 0,
      sort_order: idx,
    }));

    const { error: itemsError } = await supabase.from('billing_items').insert(itemPayloads);
    if (itemsError) {
      console.error('Error inserting billing items into Supabase:', itemsError);
    }
  }

  const resultDoc = await getDocumentById(savedDocId!);
  if (!resultDoc) {
    throw new Error('Failed to retrieve saved document from Supabase');
  }
  return resultDoc;
};

// --- DELETE DOCUMENT ---
export const deleteDocument = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('billing_documents').delete().eq('id', id);
  if (error) {
    console.error('Error deleting document from Supabase:', error);
    return false;
  }
  return true;
};

// --- GENERATE NEXT DOCUMENT NUMBER ---
export const generateNextDocumentNumber = async (type: DocumentType): Promise<string> => {
  const prefix = type === 'quotation' ? 'SBE-QT' : 'SBE-INV';
  const year = new Date().getFullYear();
  const allDocs = await getDocuments(type);

  // Find max sequence number for this year
  let maxSeq = 0;
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`, 'i');

  allDocs.forEach((d) => {
    const match = d.document_number?.match(pattern);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `${prefix}-${year}-${nextSeq}`;
};

// --- CONVERT QUOTATION TO INVOICE ---
export const convertQuotationToInvoice = async (quotationId: string): Promise<BillingDocument> => {
  const quotation = await getDocumentById(quotationId);
  if (!quotation) throw new Error('Quotation not found');

  const newInvNumber = await generateNextDocumentNumber('invoice');
  const today = new Date().toISOString().split('T')[0] || '';
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 15);
  const dueDate = dueDateObj.toISOString().split('T')[0] || '';

  const newInvoice: BillingDocument = {
    document_type: 'invoice',
    document_number: newInvNumber,
    status: 'draft',
    issue_date: today,
    due_date: dueDate,
    reference_no: quotation.document_number || '',
    client_name: quotation.client_name || '',
    client_company: quotation.client_company || '',
    client_gstin: quotation.client_gstin || '',
    client_phone: quotation.client_phone || '',
    client_email: quotation.client_email || '',
    client_address: quotation.client_address || '',
    subtotal: quotation.subtotal || 0,
    total_tax: quotation.total_tax || 0,
    total_discount: quotation.total_discount || 0,
    round_off: quotation.round_off || 0,
    grand_total: quotation.grand_total || 0,
    notes: quotation.notes || '',
    terms: quotation.terms || '',
    items: quotation.items || [],
    converted_from_id: quotation.id || quotationId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const savedInvoice = await saveDocument(newInvoice);

  // Mark quotation as accepted
  await saveDocument({
    ...quotation,
    status: 'accepted',
  });

  return savedInvoice;
};

