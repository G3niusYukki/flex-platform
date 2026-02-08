'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: '', password: '', confirmPassword: '', realName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { alert('两次密码不一致'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, password: formData.password, realName: formData.realName }),
      });
      const data = await res.json();
      if (data.success) { router.push('/login'); }
      else { alert(data.error || '注册失败'); }
    } catch { alert('注册失败'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">用户注册</h1>
        <p className="text-center text-slate-500 mb-8 text-sm">灵活用工平台</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">姓名</label>
            <input type="text" placeholder="请输入姓名" value={formData.realName} onChange={(e) => setFormData((p) => ({ ...p, realName: e.target.value }))} required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">手机号</label>
            <input type="tel" placeholder="请输入手机号" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">密码</label>
            <input type="password" placeholder="请输入密码" value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">确认密码</label>
            <input type="password" placeholder="请再次输入密码" value={formData.confirmPassword} onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))} required className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" />注册中...</> : '注册'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">已有账号？<Link href="/login" className="text-primary font-medium hover:underline">立即登录</Link></p>
      </div>
    </div>
  );
}
