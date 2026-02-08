import Link from 'next/link';
import { DebugLoginButton } from '@/components/debug-login-button';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <main className="text-center space-y-8 p-8">
        <h1 className="text-3xl font-bold text-slate-900">灵活用工平台 - 管理后台</h1>
        <p className="text-slate-600 max-w-md">欢迎使用管理后台，请登录后进入管理界面</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/admin/login" className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
            管理员登录
          </Link>
          <DebugLoginButton />
          <Link href={process.env.NEXT_PUBLIC_WEB_URL || "/"} className="inline-block px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100">
            用户端
          </Link>
        </div>
      </main>
    </div>
  );
}
