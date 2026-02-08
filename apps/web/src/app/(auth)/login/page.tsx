"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2, Bug } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ phone: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError("登录失败");
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
        用户登录
      </h1>
      <p className="text-center text-slate-500 mb-8 text-sm">灵活用工平台</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            手机号
          </label>
          <input
            type="tel"
            placeholder="请输入手机号"
            value={formData.phone}
            onChange={(e) =>
              setFormData((p) => ({ ...p, phone: e.target.value }))
            }
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            密码
          </label>
          <input
            type="password"
            placeholder="请输入密码"
            value={formData.password}
            onChange={(e) =>
              setFormData((p) => ({ ...p, password: e.target.value }))
            }
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              登录中...
            </>
          ) : (
            "登录"
          )}
        </button>
      </form>
      <button
        type="button"
        onClick={handleDebugLogin}
        disabled={isLoading}
        className="mt-4 w-full py-2 px-4 border-2 border-amber-400 text-amber-700 font-medium rounded-lg hover:bg-amber-50 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Bug className="h-4 w-4" />
        调试登录（一键进入）
      </button>
      <p className="mt-6 text-center text-sm text-slate-500">
        还没有账号？
        <Link
          href="/register"
          className="text-primary font-medium hover:underline"
        >
          立即注册
        </Link>
      </p>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
