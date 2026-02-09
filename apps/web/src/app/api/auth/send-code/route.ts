import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/sms';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone } = body;

        // 验证手机号格式
        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
            return NextResponse.json(
                { success: false, message: '请输入正确的手机号' },
                { status: 400 }
            );
        }

        // 发送验证码
        const result = await sendVerificationCode(phone);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                // 开发环境返回验证码，生产环境不返回
                ...(process.env.NODE_ENV === 'development' && { code: result.code }),
            });
        } else {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 429 }
            );
        }
    } catch (error) {
        console.error('发送验证码失败:', error);
        return NextResponse.json(
            { success: false, message: '服务器错误' },
            { status: 500 }
        );
    }
}
