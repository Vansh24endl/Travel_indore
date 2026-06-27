import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

async function getTransporter() {
    if (transporter) return transporter

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const secure = process.env.SMTP_SECURE === 'true'
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (host && user && pass) {
        console.log(`[EMAIL] Configuring SMTP transporter for host: ${host}:${port}`)
        transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass
            }
        })
    } else {
        console.log('[EMAIL] SMTP credentials not provided. Initializing simulated JSON transport.')
        transporter = nodemailer.createTransport({
            jsonTransport: true
        })
    }

    return transporter
}

export async function sendOTPEmail(email: string, otp: string) {
    try {
        const mailTransporter = await getTransporter()
        const isMock = !process.env.SMTP_HOST

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Indore Explorer" <noreply@indoreexplorer.com>',
            to: email.toLowerCase().trim(),
            subject: `${otp} is your verification code for Indore Explorer`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; max-width: 550px; margin: 40px auto; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05); background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; tracking-spacing: -0.025em;">Indore Explorer</h2>
                        <p style="color: #64748b; font-size: 14px; margin: 5px 0 0 0;">Account Security Verification</p>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 25px;" />
                    <p style="font-size: 16px; line-height: 1.6; color: #334155;">Hello,</p>
                    <p style="font-size: 16px; line-height: 1.6; color: #334155;">We received a request to recover your Indore Explorer account password. Use the verification code below to set up a new password. This code will expire in 15 minutes.</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <div style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #4f46e5; border: 2px dashed #818cf8; padding: 12px 30px; background-color: #eef2ff; border-radius: 12px; font-family: monospace;">
                            ${otp}
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; line-height: 1.5; color: #64748b;">If you did not make this request, please safely ignore this email. Your password will remain unchanged.</p>
                    <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 30px; margin-bottom: 20px;" />
                    <div style="text-align: center;">
                        <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; ${new Date().getFullYear()} Indore Explorer. All rights reserved.</p>
                    </div>
                </div>
            `
        }

        const info = await mailTransporter.sendMail(mailOptions)

        if (isMock) {
            console.log('\n┌────────────────────────────────────────────────────────┐');
            console.log(`│ [EMAIL SIMULATOR] Recipient: ${email.toLowerCase().trim()}`);
            console.log(`│ [EMAIL SIMULATOR] OTP Code:  ${otp}`);
            console.log(`│ [EMAIL SIMULATOR] (SMTP configuration not detected)    │`);
            console.log('└────────────────────────────────────────────────────────┘\n');
        } else {
            console.log(`[EMAIL] OTP sent successfully to ${email}. Message ID: ${info.messageId}`)
        }

        return info
    } catch (error) {
        console.error('[EMAIL] Failed to send OTP email:', error)
        throw new Error('Could not send verification email. Please try again.')
    }
}
