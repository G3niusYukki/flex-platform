'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">派单管理</h1>
        <p className="text-muted-foreground">管理待派单订单，支持手动或自动派单</p>
      </div>
      <div className="rounded-xl border bg-card p-12 text-center">
        <Send className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">派单功能开发中</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          派单模块将支持：查看待派单订单、筛选附近工人、手动/自动派单、派单历史查询。
        </p>
        <Link href="/admin/dashboard/orders?dispatchStatus=UNASSIGNED" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          查看待派单订单
        </Link>
      </div>
    </div>
  );
}
