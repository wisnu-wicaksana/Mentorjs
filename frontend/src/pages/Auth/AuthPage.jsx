import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Mail, Lock, User, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AuthPage = ({ onLoginSuccess, onBackToHome }) => {
  const { login, register, verifyOTP, resendOTP } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);
  
  // States untuk Input Form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // States untuk OTP Verification
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // States untuk Status Loading, Error, & Sukses
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Penanganan Submit Form (Login / Registrasi)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (isLoginTab) {
      // Panggil aksi login
      const result = await login(email, password);
      if (result.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else if (result.unverified) {
        setOtpEmail(result.email || email);
        setIsOtpStep(true);
        setSuccessMsg(result.message || 'Masukkan kode verifikasi yang dikirim ke email Anda.');
        setLoading(false);
      } else {
        setErrorMsg(result.message);
        setLoading(false);
      }
    } else {
      // Panggil aksi registrasi
      if (username.trim().length < 3) {
        setErrorMsg('Username minimal harus 3 karakter.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok. Harap periksa kembali penulisan kata sandi Anda.');
        setLoading(false);
        return;
      }
      const result = await register(username, email, password);
      if (result.success) {
        if (onLoginSuccess) onLoginSuccess();
      } else if (result.unverified) {
        setOtpEmail(result.email || email);
        setIsOtpStep(true);
        setSuccessMsg(result.message || 'Akun terdaftar! Masukkan OTP yang dikirim ke email Anda.');
        setLoading(false);
      } else {
        setErrorMsg(result.message);
        setLoading(false);
      }
    }
  };

  // Penanganan Verifikasi OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (otpCode.trim().length !== 6) {
      setErrorMsg('Kode OTP harus terdiri dari 6 digit angka.');
      setLoading(false);
      return;
    }

    const result = await verifyOTP(otpEmail, otpCode);
    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMsg(result.message);
      setLoading(false);
    }
  };

  // Penanganan Kirim Ulang OTP
  const handleResendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const result = await resendOTP(otpEmail);
    if (result.success) {
      setSuccessMsg(result.message || 'Kode OTP baru telah dikirim.');
    } else {
      setErrorMsg(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-center items-center relative overflow-hidden px-4 select-none">
      
      {/* Efek Latar Belakang Gradien Glowing */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Kontainer Card Form Glassmorphism */}
      <div className="w-full max-w-md bg-slate-900/60 border border-gray-800/80 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Judul & Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-[10px] uppercase font-bold tracking-wider mb-3">
            <Sparkles size={12} />
            <span>MentorJS AI Platform</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            {isOtpStep ? 'Verifikasi Akun' : 'Aura Mentor'}
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {isOtpStep 
              ? `Masukkan 6-digit kode verifikasi yang telah dikirim ke ${otpEmail}` 
              : 'Belajar JavaScript secara interaktif dengan Socratic AI Mentor'}
          </p>
        </div>

        {/* Banner Pesan Sukses */}
        {successMsg && (
          <div className="mb-5 p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-xs text-emerald-400 flex items-start gap-2.5 select-text">
            <span className="shrink-0 text-emerald-500 text-sm mt-0.5 font-bold">✓</span>
            <div className="flex-1 text-left leading-relaxed">
              <span className="font-bold block mb-0.5">Sukses:</span>
              {successMsg}
            </div>
          </div>
        )}

        {/* Banner Pesan Error */}
        {errorMsg && (
          <div className="mb-5 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-xs text-red-400 flex items-start gap-2.5 select-text">
            <span className="shrink-0 text-red-500 text-sm mt-0.5">⚠️</span>
            <div className="flex-1 text-left leading-relaxed">
              <span className="font-bold block mb-0.5">Gagal:</span>
              {errorMsg}
            </div>
          </div>
        )}

        {isOtpStep ? (
          /* FORM VERIFIKASI OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block text-center">
                Masukkan Kode OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} // Hanya terima angka
                  placeholder="123456"
                  className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 py-3 rounded-lg text-xl font-bold tracking-[0.75em] text-center text-white placeholder-gray-800 transition-all outline-none font-mono"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={loading || otpCode.length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifikasi...</span>
                </span>
              ) : (
                'Verifikasi Akun'
              )}
            </Button>

            <div className="flex justify-between items-center mt-6 text-xs px-1">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors cursor-pointer select-none"
                disabled={loading}
              >
                Kirim Ulang OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOtpStep(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                  setOtpCode('');
                }}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer select-none"
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </form>
        ) : (
          /* FORM LOGIN / REGISTRASI BIASA */
          <>
            {/* Tab Switcher (Login / Register) */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-gray-900 mb-6">
              <button
                type="button"
                onClick={() => { setIsLoginTab(true); setErrorMsg(''); setSuccessMsg(''); setConfirmPassword(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  isLoginTab 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <LogIn size={13} />
                <span>Masuk</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginTab(false); setErrorMsg(''); setSuccessMsg(''); setConfirmPassword(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  !isLoginTab 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <UserPlus size={13} />
                <span>Daftar</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Username (Hanya untuk Register) */}
              {!isLoginTab && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <User size={15} />
                    </span>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Masukkan nama pengguna..."
                      className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-10 pr-4 py-2.5 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Alamat Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="budi@example.com"
                    className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-10 pr-4 py-2.5 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Kata Sandi</label>
                <div className="relative flex items-center">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-10 pr-10 py-2.5 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-violet-400 transition-colors cursor-pointer"
                    title={showPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </div>

              {/* Input Konfirmasi Password (Hanya untuk Register) */}
              {!isLoginTab && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Konfirmasi Kata Sandi</label>
                  <div className="relative flex items-center">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <Lock size={15} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-10 pr-10 py-2.5 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                    />
                     <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-violet-400 transition-colors cursor-pointer"
                    title={showPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"}
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  </div>
                </div>
              )}

              {/* Tombol Aksi Submit */}
              <Button
                type="submit"
                className="w-full mt-2"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </span>
                ) : isLoginTab ? (
                  'Masuk Sekarang'
                ) : (
                  'Buat Akun'
                )}
              </Button>
            </form>
          </>
        )}

        {onBackToHome && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-gray-500 hover:text-violet-400 transition-colors cursor-pointer select-none"
            >
              &larr; Kembali ke Beranda
            </button>
          </div>
        )}

      </div>
      
    </div>
  );
};
