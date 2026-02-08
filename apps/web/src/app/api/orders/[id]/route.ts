import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { employer: { select: { id: true, realName: true, avatar: true } }, worker: { select: { id: true, realName: true, avatar: true } } },
    });
    if (!order) return NextResponse.json({ success: false, error: '订单不存在' }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    return NextResponse.json({ success: false, error: '获取订单详情失败' }, { status: 500 });
  }
}
