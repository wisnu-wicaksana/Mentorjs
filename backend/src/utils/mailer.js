const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
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

  // Tampilkan OTP di konsol jika di lingkungan development, ATAU jika SMTP belum dikonfigurasi secara asli (sehingga butuh disalin dari terminal)
  if (!isProduction || hasNoSMTP) {
    console.log('\n==================================================');
    console.log('                 VERIFIKASI EMAIL                 ');
    console.log(` Ke Email : ${email}`);
    console.log(` Kode OTP : ${otp}`);
    console.log('==================================================\n');
  }

  // Jika tidak ada kredensial SMTP yang terkonfigurasi di .env atau masih berupa placeholder bawaan
  if (hasNoSMTP) {
    if (isProduction) {
      console.error('[MAILER] Kredensial SMTP tidak terkonfigurasi atau masih berupa placeholder! Gagal mengirim email verifikasi di production.');
      return { success: false, error: 'SMTP tidak terkonfigurasi.' };
    }
    console.log('[MAILER] Kredensial SMTP tidak lengkap atau berupa placeholder di file .env. Kode OTP dicetak ke terminal karena bukan produk.');
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
      connectionTimeout: 5000, // Timeout koneksi 5 detik
      greetingTimeout: 5000,   // Timeout sambutan SMTP 5 detik
      socketTimeout: 5000,     // Timeout soket 5 detik
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
    // Cetak OTP ke konsol server sebagai fallback jika pengiriman email gagal
    console.log('\n==================================================');
    console.log('      FALLBACK: VERIFIKASI EMAIL (GAGAL SMTP)     ');
    console.log(` Ke Email : ${email}`);
    console.log(` Kode OTP : ${otp}`);
    console.log('==================================================\n');
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
