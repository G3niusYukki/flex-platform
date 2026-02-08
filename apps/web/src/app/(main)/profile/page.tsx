'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login?callbackUrl=/profile');
    if (status !== 'loading') setLoading(false);
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated' || loading) {
    return <div className="container py-12 flex items-center justify-center min-h-[400px]"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-8"><h1 className="text-2xl font-bold tracking-tight">个人资料</h1><p className="text-muted-foreground mt-1">管理您的账户信息</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />基本信息</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium text-muted-foreground">昵称/姓名</label><p className="text-lg font-medium">{session?.user?.name || '未设置'}</p></div>
          <div><label className="text-sm font-medium text-muted-foreground">邮箱</label><p className="text-lg">{session?.user?.email || '未绑定'}</p></div>
          <p className="text-sm text-muted-foreground">完整个人资料编辑功能开发中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
