import crypto from 'crypto';

export function verifyRazorpaySignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

export function generateLicenseKey(): string {
  // Generates: NOVA-XXXX-XXXX-XXXX-XXXX
  // Each X is an uppercase alphanumeric character (0-9, A-Z)
  // Exclude confusing characters: 0, O, I, 1
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segment = () => Array.from({ length: 4 }, () => 
    chars[Math.floor(Math.random() * chars.length)]).join('');
  
  return `NOVA-${segment()}-${segment()}-${segment()}-${segment()}`;
}
