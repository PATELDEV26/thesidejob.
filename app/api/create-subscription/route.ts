import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const planId = process.env.RAZORPAY_PLAN_ID;

    if (!keyId || !keySecret || !planId) {
      console.error('Missing Razorpay credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // 10 years
      notes: { email }
    });

    return NextResponse.json({
      subscription_id: subscription.id,
      key_id: keyId
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
