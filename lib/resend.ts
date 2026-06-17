import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = 'Portfolio App <noreply@resend.dev>'

export async function sendApprovalEmail(email: string, username: string, appUrl: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "You're approved! Your portfolio is live",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#6366f1">Your portfolio is live! 🎉</h1>
        <p>Great news — your account has been approved.</p>
        <p>Your portfolio is now live at: <a href="${appUrl}/${username}">${appUrl}/${username}</a></p>
        <p>Log in to your dashboard to customize it further.</p>
        <a href="${appUrl}/login" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Go to Dashboard</a>
      </div>
    `,
  })
}

export async function sendSuspensionEmail(email: string, reason?: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Your account has been suspended',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#ef4444">Account Suspended</h1>
        <p>Your portfolio account has been suspended.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you believe this is a mistake, please contact support.</p>
      </div>
    `,
  })
}

export async function sendReinstatementEmail(email: string, appUrl: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Your account has been reinstated',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#22c55e">Account Reinstated ✓</h1>
        <p>Your portfolio account is active again.</p>
        <a href="${appUrl}/login" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Log in</a>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, appUrl: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Thanks for signing up — your account is under review',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#6366f1">Welcome! 👋</h1>
        <p>Thanks for signing up for Portfolio App.</p>
        <p>Your account is currently under review. We'll email you once it's approved — usually within 24 hours.</p>
        <p>In the meantime, you can log in to check your status.</p>
        <a href="${appUrl}/login" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Check status</a>
      </div>
    `,
  })
}

export async function sendAdminCreatedEmail(email: string, password: string, appUrl: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Your portfolio account has been created',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h1 style="color:#6366f1">Account Created</h1>
        <p>An admin has created a portfolio account for you.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please log in and change your password immediately.</p>
        <a href="${appUrl}/login" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Log in now</a>
      </div>
    `,
  })
}

export async function sendContactEmail(
  ownerEmail: string,
  fromName: string,
  fromEmail: string,
  message: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ownerEmail,
    subject: `New message from ${fromName} via your portfolio`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2>New portfolio contact message</h2>
        <p><strong>From:</strong> ${fromName} (${fromEmail})</p>
        <hr/>
        <p style="white-space:pre-wrap">${message}</p>
        <hr/>
        <p style="color:#888;font-size:12px">Reply directly to this email to respond to ${fromName}.</p>
      </div>
    `,
    replyTo: fromEmail,
  })
}
