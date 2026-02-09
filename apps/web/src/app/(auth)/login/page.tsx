"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Loader2, Phone, Lock, ArrowRight, Sparkles,
  MessageSquare, Shield, Zap, Chrome
} from "lucide-react";

type LoginMode = "password" | "sms";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [mode, setMode] = useState<LoginMode>("sms");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    code: ""
  });

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
      setError("请输入正确的手机号");
      return;
    }

    setIsSendingCode(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      const data = await res.json();

      if (data.success) {
        // 开发环境显示验证码
        if (data.code) {
          setFormData(p => ({ ...p, code: data.code }));
        }
        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(c => {
            if (c <= 1) {
              clearInterval(timer);
              return 0;
            }
            return c - 1;
          });
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch {
      setError("发送失败，请稍后重试");
    } finally {
      setIsSendingCode(false);
    }
  };

  // 密码登录
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        phone: formData.phone,
        password: formData.password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) setError(result.error);
      else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 验证码登录
  const handleSmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("sms", {
        phone: formData.phone,
        code: formData.code,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) setError(result.error);
      else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // Google 登录
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  // 调试登录
  const handleDebugLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        phone: "13800138000",
        password: "123456",
        redirect: false,
        callbackUrl,
      });
      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("调试登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-purple-500/30 mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">AI 智能雇佣平台</h1>
        <p className="text-slate-500 mt-1">人类，是时候为 AI 工作了</p>
      </div>

      {/* 功能亮点 */}
      <div className="flex justify-center gap-6 mb-6 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-green-500" />
          <span>短信验证</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <span>AI 匹配</span>
        </div>
        <div className="flex items-center gap-1">
          <Chrome className="h-3.5 w-3.5 text-blue-500" />
          <span>一键登录</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6">
        {/* 登录方式切换 */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("sms")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${mode === "sms"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-1.5" />
            验证码登录
          </button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${mode === "password"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-700"
              }`}
          >
            <Lock className="h-4 w-4 inline mr-1.5" />
            密码登录
          </button>
        </div>

        <form onSubmit={mode === "sms" ? handleSmsLogin : handlePasswordLogin} className="space-y-5">
          {/* 手机号 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              手机号
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* 验证码 or 密码 */}
          {mode === "sms" ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="6位验证码"
                    value={formData.code}
                    onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                    required
                    maxLength={6}
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0}
                  className="px-4 py-3 bg-purple-100 text-purple-600 font-medium rounded-xl hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                >
                  {isSendingCode ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    "获取验证码"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-purple-700 active:from-violet-800 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                登录中...
              </>
            ) : (
              <>
                登录
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* 分隔线 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-400">或</span>
          </div>
        </div>

        {/* 第三方登录 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 border border-slate-200 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            使用 Google 登录
          </button>

          <button
            type="button"
            onClick={handleDebugLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 border-2 border-amber-200 text-amber-700 font-medium rounded-xl hover:bg-amber-50 active:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <span className="text-sm">🐛 调试登录（测试账号）</span>
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        还没有账号？
        <Link
          href="/register"
          className="text-purple-600 font-medium hover:text-purple-700 hover:underline ml-1"
        >
          立即注册
        </Link>
      </p>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-white px-4 py-8">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
