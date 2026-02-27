import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { registerDeviceToken, unregisterDeviceToken } from "@/lib/push";

/**
 * POST - 注册设备 Token
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "请先登录" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { token, platform } = body as {
      token: string;
      platform: "ios" | "android" | "web";
    };

    if (!token || !platform) {
      return NextResponse.json(
        { success: false, message: "缺少必要参数" },
        { status: 400 },
      );
    }

    await registerDeviceToken(session.user.id, token, platform);

    return NextResponse.json({
      success: true,
      message: "设备注册成功",
    });
  } catch (error) {
    console.error("注册设备失败:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - 注销设备 Token
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "请先登录" },
        { status: 401 },
      );
    }

    await unregisterDeviceToken(session.user.id);

    return NextResponse.json({
      success: true,
      message: "设备注销成功",
    });
  } catch (error) {
    console.error("注销设备失败:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 },
    );
  }
}
