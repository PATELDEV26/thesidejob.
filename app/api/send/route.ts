import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, role, building, source, anything } = body

        if (!name || !email || !building) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: ['thesidejobfive@gmail.com'],  // <-- Replace with your real email address
            replyTo: email,
            subject: `New Application: ${name}`,
            html: `
        <div style="font-family: monospace; background: #000; color: #fff; padding: 40px; max-width: 600px; margin: 0 auto; border: 1px solid #222;">
          <div style="color: #FF3B30; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 24px;">// New Application — Thesidejob</div>
          
          <h2 style="color: #fff; font-size: 24px; margin: 0 0 32px; letter-spacing: -1px;">${name}</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #111;">
              <td style="color: #555; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; padding: 16px 0 16px; width: 180px;">Email</td>
              <td style="color: #fff; font-size: 13px; padding: 16px 0;"><a href="mailto:${email}" style="color: #FF3B30;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #111;">
              <td style="color: #555; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; padding: 16px 0;">Role</td>
              <td style="color: #fff; font-size: 13px; padding: 16px 0;">${role || 'Not specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #111;">
              <td style="color: #555; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; padding: 16px 0; vertical-align: top;">Building</td>
              <td style="color: #fff; font-size: 13px; padding: 16px 0; line-height: 1.6;">${building}</td>
            </tr>
            <tr style="border-bottom: 1px solid #111;">
              <td style="color: #555; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; padding: 16px 0;">Found Us Via</td>
              <td style="color: #fff; font-size: 13px; padding: 16px 0;">${source || 'Not specified'}</td>
            </tr>
            ${anything ? `
            <tr style="border-bottom: 1px solid #111;">
              <td style="color: #555; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; padding: 16px 0; vertical-align: top;">Anything Else</td>
              <td style="color: #fff; font-size: 13px; padding: 16px 0; line-height: 1.6;">${anything}</td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin-top: 32px; padding: 16px; background: #0a0a0a; border-left: 3px solid #FF3B30;">
            <p style="color: #555; font-size: 11px; letter-spacing: 2px; margin: 0;">SUBMITTED VIA THESIDEJOB.CO APPLICATION FORM</p>
          </div>
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
