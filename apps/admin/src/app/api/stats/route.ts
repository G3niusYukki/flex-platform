import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 });
  try {
    const [userCount, orderCount, pendingDispatchCount, inProgressCount] = await Promise.all([
      prisma.user.count({ where: { userType: { not: 'ADMIN' } } }),
      prisma.order.count(),
      prisma.order.count({ where: { dispatchStatus: 'UNASSIGNED', status: 'PENDING' } }),
      prisma.order.count({ where: { status: { in: ['ACCEPTED', 'IN_PROGRESS'] } } }),
    ]);
    return NextResponse.json({ userCount, orderCount, pendingDispatchCount, inProgressCount });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}
