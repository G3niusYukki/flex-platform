'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Bug, Loader2 } from 'lucide-react';

export function DebugLoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-2 text-amber-700 font-medium hover:bg-amber-100 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bug className="h-4 w-4" />
      )}
      调试登录（一键进入）
    </button>
  );
}
