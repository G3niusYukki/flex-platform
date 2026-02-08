'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, Bug } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ phone: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        phone: formData.phone,
        password: formData.password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setError('登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        phone: 'admin',
        password: 'admin123',
        redirect: false,
        callbackUrl: '/admin/dashboard',
      });
      if (result?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setError('调试登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">管理后台登录</h1>
        <p className="text-center text-slate-500 mb-8 text-sm">使用管理员账号和密码登录</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">账号</label>
            <input
              type="text"
              placeholder="admin"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
            <input
              type="password"
              placeholder="admin123"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />登录中...</> : '登录'}
          </button>
        </form>
        <button
          type="button"
          onClick={handleDebugLogin}
          disabled={isLoading}
          className="mt-4 w-full py-2 px-4 border-2 border-amber-400 text-amber-700 font-medium rounded-lg hover:bg-amber-50 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Bug className="h-4 w-4" />调试登录（一键进入）
        </button>
      </div>
    </div>
  );
}
