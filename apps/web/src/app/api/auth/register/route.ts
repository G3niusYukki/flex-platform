import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { phone, password, realName } = await request.json();
    if (!phone || !password) return NextResponse.json({ success: false, error: '手机号和密码必填' }, { status: 400 });
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) return NextResponse.json({ success: false, error: '手机号已注册' }, { status: 400 });
    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: { phone, passwordHash, realName: realName || phone, status: 'ACTIVE', userType: 'WORKER' },
    });
    return NextResponse.json({ success: true, data: { id: user.id, phone: user.phone } });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json({ success: false, error: '注册失败' }, { status: 500 });
  }
}
