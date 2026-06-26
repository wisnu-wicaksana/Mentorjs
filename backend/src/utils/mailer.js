const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  // 1. Dapatkan konfigurasi SMTP dari .env (jika ada)
  const smtpHost = process.env.SMTP_HOST || '';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpFrom = process.env.SMTP_FROM || '"MentorJS Admin" <no-reply@mentorjs.com>';

  // Selalu tampilkan OTP di konsol server sebagai fallback utama (sangat berguna untuk development/testing!)
  console.log('\n==================================================');
  console.log('                 VERIFIKASI EMAIL                 ');
  console.log(` Ke Email : ${email}`);
  console.log(` Kode OTP : ${otp}`);
  console.log('==================================================\n');

  // Jika tidak ada kredensial SMTP yang terkonfigurasi di .env, kita cukup cetak di log saja
  if (!smtpUser || !smtpPass) {
    console.log('[MAILER] Kredensial SMTP tidak lengkap di file .env. Kode OTP hanya dicetak ke terminal.');
    return { success: true, message: 'OTP dicetak ke terminal.' };
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
    });

    const mailOptions = {
      from: smtpFrom,
      to: email,
      subject: `[MentorJS] Kode Verifikasi OTP Anda: ${otp}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0;">
          <h2 style="color: #6d28d9; margin-bottom: 16px;">Verifikasi Akun MentorJS</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Halo,<br/><br/>
            Terima kasih telah mendaftar di <strong>MentorJS</strong>. Silakan masukkan kode verifikasi sekali pakai (OTP) berikut untuk menyelesaikan proses pendaftaran dan mengaktifkan akun Anda:
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6d28d9; background-color: #ede9fe; padding: 12px 24px; border-radius: 6px; border: 1px dashed #c084fc; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
            Kode OTP ini hanya berlaku selama <strong>15 menit</strong>. Jangan bagikan kode ini kepada siapa pun untuk menjaga keamanan akun Anda. Jika Anda tidak merasa mendaftar di MentorJS, abaikan saja email ini.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            &copy; 2026 MentorJS. Hak Cipta Dilindungi.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Email verifikasi berhasil dikirim ke ${email}. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAILER] Gagal mengirim email verifikasi ke ${email}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
