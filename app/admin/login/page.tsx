"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_logged_in")) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Username atau password salah.");
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_name", result.data.name);
      if (result.data.session_id) {
        localStorage.setItem("admin_session_id", result.data.session_id);
      }
      router.replace("/admin/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login gagal.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans relative overflow-hidden admin-shell">
      {/* Abstract Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-600/20 blur-[100px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute -bottom-[30%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-blue-600/20 blur-[150px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Login Card - Glassmorphism */}
      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-8 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">

          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(99,102,241,0.4)] relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-6 scale-105 -z-10 blur-sm"></div>
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: "40px", fontVariationSettings: "'FILL' 1" }}
              >
                local_cafe
              </span>
            </div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">Caffe Shop</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Authentication Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-widest">
                Username
              </label>
              <div className="relative group">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  style={{ fontSize: "20px" }}
                >
                  person
                </span>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-bold mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  style={{ fontSize: "20px" }}
                >
                  lock
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-12 py-3.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium font-inter tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3.5 flex items-start gap-3 animate-fade-in-up">
                <span className="material-symbols-outlined text-rose-400 text-xl mt-0.5">error</span>
                <p className="text-rose-200 text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-sm transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 hover-lift"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="tracking-wide">Otentikasi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>login</span>
                  <span className="tracking-wide">Masuk Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Demo Access: <span className="text-slate-200 font-bold bg-slate-800 px-2 py-1 rounded-md ml-1">admin</span> <span className="mx-1 text-slate-600">/</span> <span className="text-slate-200 font-bold bg-slate-800 px-2 py-1 rounded-md">123456</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}