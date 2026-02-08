import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: '未授权' }, { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const status = searchParams.get('status');
  const dispatchStatus = searchParams.get('dispatchStatus');
  try {
    const where: Record<string, unknown> = {};
    if (status && ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'EVALUATED', 'CANCELED', 'DISPUTED'].includes(status)) where.status = status;
    if (dispatchStatus && ['UNASSIGNED', 'PENDING_ACCEPT', 'ASSIGNED', 'REJECTED', 'TIMEOUT'].includes(dispatchStatus)) where.dispatchStatus = dispatchStatus;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { employer: { select: { id: true, phone: true, realName: true } }, worker: { select: { id: true, phone: true, realName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({ orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: '获取订单列表失败' }, { status: 500 });
  }
}
