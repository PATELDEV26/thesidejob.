"use client";

import { useState, useEffect } from 'react';

export default function NovaSiftCheckout() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { subscription_id, key_id } = await response.json();

      const options = {
        key: key_id,
        subscription_id: subscription_id,
        name: 'NovaSift',
        description: 'Pro Monthly Subscription',
        image: 'https://thesidejob.tech/novasift-logo.png',
        prefill: { email: email.trim() },
        theme: { color: '#6366f1' },
        handler: function (response: any) {
          setPaymentSuccess(true);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div style={{ padding: "24px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "16px", textAlign: "center" }}>
        <h4 style={{ color: "#10b981", fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>🎉 Payment Successful!</h4>
        <p style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: 1.5 }}>
          Your NovaSift Pro license key has been sent to <strong>{email}</strong>.
          <br/>Please check your inbox (and spam folder) in the next 1-2 minutes.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '16px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          outline: 'none'
        }}
      />
      {error && <div style={{ color: '#ef4444', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>{error}</div>}
      
      <button
        onClick={handleSubscribe}
        disabled={loading || !scriptLoaded || !email.trim()}
        style={{
          display: "block",
          width: '100%',
          textAlign: "center",
          padding: "16px",
          background: "#6366f1",
          borderRadius: "100px",
          fontFamily: "var(--font-syne)",
          fontWeight: "bold",
          color: "#fff",
          textDecoration: "none",
          border: 'none',
          cursor: loading || !scriptLoaded || !email.trim() ? 'not-allowed' : 'pointer',
          opacity: loading || !scriptLoaded || !email.trim() ? 0.6 : 1
        }}
      >
        {loading ? 'Opening Checkout...' : 'Subscribe Now'}
      </button>
    </div>
  );
}
