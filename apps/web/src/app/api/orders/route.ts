import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNo } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employerId, title, description, serviceCategory, skills, address, latitude, longitude, city, district, scheduledStart, scheduledEnd, salaryType, expectedSalary, urgencyLevel, requirements } = body;
    if (!employerId || !title || !description || !address || !salaryType || !expectedSalary) {
      return NextResponse.json({ success: false, error: '缺少必填字段' }, { status: 400 });
    }
    const order = await prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        employerId,
        title, description, serviceCategory, skills: skills || [], address, latitude, longitude, city, district,
        scheduledStart: new Date(scheduledStart),
        scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
        salaryType, expectedSalary: parseFloat(expectedSalary), urgencyLevel: urgencyLevel || 'NORMAL',
        requirements: requirements || {}, status: 'PENDING', dispatchStatus: 'UNASSIGNED',
      },
    });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('创建订单失败:', error);
    return NextResponse.json({ success: false, error: '创建订单失败' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (city) where.city = city;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { employer: { select: { id: true, realName: true, avatar: true } }, worker: { select: { id: true, realName: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);
    return NextResponse.json({ success: true, data: { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return NextResponse.json({ success: false, error: '获取订单列表失败' }, { status: 500 });
  }
}
