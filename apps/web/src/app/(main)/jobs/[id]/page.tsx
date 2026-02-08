'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

type Order = {
  id: string, orderNo: string, title: string, description: string, serviceCategory: string, skills: string[],
  address: string, city: string | null, district: string | null, scheduledStart: string, scheduledEnd: string | null,
  expectedSalary: unknown, salaryType: string, status: string, urgencyLevel: string
};

const salaryTypeText: Record<string, string> = { HOURLY: '时薪', DAILY: '日薪', FIXED: '固定价格' };

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((res) => {
        if (res.status === 404) { router.replace('/jobs'); return null; }
        return res.json();
      })
      .then((data) => { if (data?.success && data.data) setOrder(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id, router]);

  if (loading || !order) {
    return <div className="container py-12"><div className="animate-pulse rounded-xl border bg-card p-8"><div className="h-8 w-2/3 rounded bg-muted" /><div className="mt-4 h-4 w-1/2 rounded bg-muted" /><div className="mt-6 h-24 w-full rounded bg-muted" /></div></div>;
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" asChild><Link href="/jobs" className="flex items-center gap-2 mb-6"><ArrowLeft className="h-4 w-4" />返回列表</Link></Button>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div><h1 className="text-2xl font-bold tracking-tight">{order.title}</h1><p className="text-muted-foreground mt-1">{order.serviceCategory} · 订单号 {order.orderNo}</p></div>
          <span className="rounded-full px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800">{order.status}</span>
        </CardHeader>
        <CardContent className="space-y-6">
          <div><h3 className="font-semibold mb-2">职位描述</h3><p className="text-muted-foreground whitespace-pre-wrap">{order.description}</p></div>
          {order.skills?.length > 0 && (
            <div><h3 className="font-semibold mb-2">所需技能</h3><div className="flex flex-wrap gap-2">{order.skills.map((skill) => (<span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{skill}</span>))}</div></div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div><p className="text-sm font-medium">工作地点</p><p className="text-sm text-muted-foreground">{[order.city, order.district, order.address].filter(Boolean).join(' ')}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div><p className="text-sm font-medium">计划开始</p><p className="text-sm text-muted-foreground">{formatDate(order.scheduledStart)}</p>{order.scheduledEnd && <p className="text-sm text-muted-foreground mt-0.5">计划结束：{formatDate(order.scheduledEnd)}</p>}</div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div><p className="text-sm font-medium">{salaryTypeText[order.salaryType] || order.salaryType}</p><p className="text-lg font-semibold text-primary">{formatCurrency(Number(order.expectedSalary))}</p></div>
            </div>
          </div>
          {order.status === 'PENDING' && (
            <div className="flex gap-4 pt-4">
              <Button asChild><Link href={`/login?callbackUrl=/jobs/${order.id}`}>登录后接单</Link></Button>
              <Button variant="outline" asChild><Link href="/register">注册账号</Link></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
