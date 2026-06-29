import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyRazorpaySignature, generateLicenseKey } from '@/lib/razorpay';
import { sendLicenseEmail, sendPaymentFailedEmail } from '@/lib/resend';

// Initialize Supabase Admin client to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    if (!verifyRazorpaySignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Idempotency check
    const { data: existingLog } = await supabase
      .from('webhook_logs')
      .select('id')
      .eq('razorpay_event_id', event.id)
      .single();

    if (existingLog) {
      return NextResponse.json({ status: 'already_processed' }, { status: 200 });
    }

    switch (event.event) {
      case 'payment.captured':
        await handleLifetimePurchase(event.payload.payment.entity);
        break;
      
      case 'subscription.charged':
        await handleMonthlyPayment(event.payload.subscription.entity, event.payload.payment.entity);
        break;
      
      case 'subscription.cancelled':
        await handleCancellation(event.payload.subscription.entity);
        break;
      
      case 'payment.failed':
        await handleFailedPayment(event.payload.payment.entity);
        break;
    }

    // Log the event
    await supabase.from('webhook_logs').insert({
      event_type: event.event,
      razorpay_event_id: event.id,
      payload: event
    });

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleLifetimePurchase(payment: any) {
  const email = payment.email;
  const name = payment.contact || email.split('@')[0];
  
  const licenseKey = generateLicenseKey();
  
  await supabase.from('licenses').insert({
    license_key: licenseKey,
    customer_email: email,
    customer_name: name,
    plan_type: 'lifetime',
    razorpay_payment_id: payment.id,
    max_activations: 2
  });
  
  await sendLicenseEmail({ email, name, licenseKey, plan: 'lifetime' });
}

async function handleMonthlyPayment(subscription: any, payment: any) {
  const email = payment.email;
  const name = payment.contact || email.split('@')[0];
  const subId = subscription.id;
  
  const { data: existing } = await supabase
    .from('licenses')
    .select('*')
    .eq('razorpay_subscription_id', subId)
    .single();
  
  if (existing) {
    const newExpiry = new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('licenses')
      .update({ expires_at: newExpiry, is_revoked: false })
      .eq('razorpay_subscription_id', subId);
    return;
  }
  
  const licenseKey = generateLicenseKey();
  const expiresAt = new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString();
  
  await supabase.from('licenses').insert({
    license_key: licenseKey,
    customer_email: email,
    customer_name: name,
    plan_type: 'monthly',
    razorpay_payment_id: payment.id,
    razorpay_subscription_id: subId,
    expires_at: expiresAt,
    max_activations: 2
  });
  
  await sendLicenseEmail({ email, name, licenseKey, plan: 'monthly' });
}

async function handleCancellation(subscription: any) {
  await supabase.from('licenses')
    .update({ razorpay_subscription_id: null })
    .eq('razorpay_subscription_id', subscription.id);
}

async function handleFailedPayment(payment: any) {
  await sendPaymentFailedEmail(payment.email);
}
