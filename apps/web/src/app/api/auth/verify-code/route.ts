import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/lib/sms';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone, code } = body;

        // 验证参数
        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
            return NextResponse.json(
                { success: false, message: '请输入正确的手机号' },
                { status: 400 }
            );
        }

        if (!code || !/^\d{6}$/.test(code)) {
            return NextResponse.json(
                { success: false, message: '请输入6位数字验证码' },
                { status: 400 }
            );
        }

        // 验证验证码
        const result = verifyCode(phone, code);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
            });
        } else {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('验证码校验失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}
