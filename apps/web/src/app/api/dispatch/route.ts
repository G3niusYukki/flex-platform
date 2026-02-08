import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') as 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'EVALUATED' | 'CANCELED' | 'DISPUTED') || 'PENDING';
    const orders = await prisma.order.findMany({
      where: { status, dispatchStatus: 'UNASSIGNED' },
      orderBy: { scheduledStart: 'asc' },
      take: 50,
    });
    const workers = await prisma.workerProfile.findMany({
      where: { isOnline: true },
      include: { user: { select: { id: true, phone: true, realName: true } } },
      take: 100,
    });
    return NextResponse.json({ success: true, data: { orders, workers } });
  } catch (error) {
    console.error('获取派单数据失败:', error);
    return NextResponse.json({ success: false, error: '获取派单数据失败' }, { status: 500 });
  }
}
