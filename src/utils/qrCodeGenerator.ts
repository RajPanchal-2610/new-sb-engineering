import QRCode from 'qrcode';

export const buildUpiPaymentUrl = (params: {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
}): string => {
  const { upiId, payeeName, amount, transactionNote } = params;
  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanAmount = amount > 0 ? amount.toFixed(2) : '';
  const cleanNote = encodeURIComponent(transactionNote.trim());

  let url = `upi://pay?pa=${cleanUpi}&pn=${cleanName}&cu=INR`;
  if (cleanAmount) {
    url += `&am=${cleanAmount}`;
  }
  if (cleanNote) {
    url += `&tn=${cleanNote}`;
  }
  return url;
};

export const generateQrCodeDataUrl = async (
  text: string,
  options?: { width?: number; margin?: number }
): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 200,
      margin: options?.margin ?? 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    return '';
  }
};
