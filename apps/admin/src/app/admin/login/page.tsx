"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Shield, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
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
        callbackUrl: "/admin/dashboard",
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        phone: "admin",
        password: "admin123",
        redirect: false,
        callbackUrl: "/admin/dashboard",
      });
      if (result?.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("调试登录失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">管理后台</h1>
          <p className="text-slate-400 mt-1">系统管理员登录</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-900/50 border border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                账号
              </label>
              <input
                type="text"
                placeholder="请输入管理员账号"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none"
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  进入后台
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDebugLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 border-2 border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              <span className="text-sm">🐛 调试登录</span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <a
            href="/login"
            className="text-slate-400 hover:text-white transition-colors"
          >
            返回用户登录
          </a>
        </p>
      </div>
    </div>
  );
}
