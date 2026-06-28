const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp, type = 'verify') => {
  // 1. Dapatkan konfigurasi SMTP dari .env 
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpFrom = process.env.SMTP_FROM || '"MentorJS Admin" <no-reply@mentorjs.com>';

  // Jika tidak ada kredensial SMTP yang terkonfigurasi di .env atau masih berupa placeholder bawaan
  const isPlaceholder = smtpUser.includes('email-anda') || smtpPass.includes('sandi-aplikasi');
  const isProduction = process.env.NODE_ENV === 'production';
  const hasNoSMTP = !smtpUser || !smtpPass || isPlaceholder;

  const isReset = type === 'reset';
  const subject = isReset 
    ? `[MentorJS] Password Reset OTP Code: ${otp}` 
    : `[MentorJS] Verification OTP Code: ${otp}`;

  // Tampilkan OTP di konsol jika di lingkungan development, ATAU jika SMTP belum dikonfigurasi secara asli (sehingga butuh disalin dari terminal)
  if (!isProduction || hasNoSMTP) {
    console.log('\n==================================================');
    console.log(`            EMAIL VERIFICATION (${type.toUpperCase()})           `);
    console.log(` To Email : ${email}`);
    console.log(` OTP Code : ${otp}`);
    console.log('==================================================\n');
  }

  // Jika tidak ada kredensial SMTP yang terkonfigurasi di .env atau masih berupa placeholder bawaan
  if (hasNoSMTP) {
    if (isProduction) {
      console.error('[MAILER] SMTP credentials are not configured or are placeholder! Failed to send email in production.');
      return { success: false, error: 'SMTP not configured.' };
    }
    console.log('[MAILER] SMTP credentials are not fully configured in .env. OTP code has been printed to the terminal console.');
    return { success: true, message: 'OTP printed to terminal.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true untuk port 465, false untuk port lainnya
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 5000, // Timeout koneksi 5 detik
      greetingTimeout: 5000,   // Timeout sambutan SMTP 5 detik
      socketTimeout: 5000,     // Timeout soket 5 detik
    });

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
          <h2 style="color: #6d28d9; margin-bottom: 16px;">${isReset ? 'Reset Password' : 'Verify Account'} - MentorJS</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Hello,<br/><br/>
            ${isReset 
              ? 'You requested a password reset for your <strong>MentorJS</strong> account. Please use the following One-Time Password (OTP) to complete the password reset process:'
              : 'Thank you for registering at <strong>MentorJS</strong>. Please enter the following One-Time Password (OTP) to complete your registration process and activate your account:'
            }
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6d28d9; background-color: #ede9fe; padding: 12px 24px; border-radius: 6px; border: 1px dashed #c084fc; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
            This OTP code is valid for <strong>15 minutes</strong>. Do not share this code with anyone to maintain the security of your account. If you did not request this, you can safely ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            &copy; 2026 MentorJS. All Rights Reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Verification email sent to ${email}. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAILER] Failed to send verification email to ${email}:`, error.message);
    // Cetak OTP ke konsol server sebagai fallback jika pengiriman email gagal
    console.log('\n==================================================');
    console.log(`    FALLBACK: EMAIL VERIFICATION (SMTP FAILED)    `);
    console.log(` To Email : ${email}`);
    console.log(` OTP Code : ${otp}`);
    console.log('==================================================\n');
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
