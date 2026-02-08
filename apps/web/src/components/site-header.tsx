'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Briefcase, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="text-lg">灵活用工</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">首页</Link>
          <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">职位列表</Link>
          {status === 'loading' ? (
            <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2"><User className="h-4 w-4" />个人中心</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />退出
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild><Link href="/login">登录</Link></Button>
              <Button size="sm" asChild><Link href="/register">注册</Link></Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
