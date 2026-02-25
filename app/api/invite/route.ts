import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, ideaTitle } = body

    if (!email) {
      return NextResponse.json({ error: 'Missing email field' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Can be customized if they have an active domain
      to: [email],
      subject: "You're invited to Thesidejob Hacker House 🔴",
      html: `
        <div style="font-family: monospace; background: #000; color: #fff; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <h2 style="color: #FF3B30; font-size: 24px; margin: 0 0 32px; letter-spacing: -1px; font-family: sans-serif; font-weight: 900;">You're invited to Thesidejob Hacker House 🔴</h2>
          
          <p style="color: #ccc; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Hey ${name || 'there'},<br><br>
            Your idea <strong>"${ideaTitle || 'Awesome Idea'}"</strong> was selected.<br>
            We'd love to invite you to the hacker house this weekend to build it.
          </p>
          
          <div style="margin: 32px 0; padding: 16px; background: #0a0a0a; border-left: 3px solid #FF3B30;">
            <p style="color: #fff; font-size: 13px; margin: 0 0 8px;"><strong>LOCATION</strong></p>
            <p style="color: #888; font-size: 13px; margin: 0;">Thesidejob HQ, Vadodara, GJ</p>
          </div>

          <p style="color: #555; font-size: 13px; margin-top: 32px;">
            — The TSJ Team
          </p>
        </div>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
