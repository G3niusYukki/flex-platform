import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 },
      );
    }

    const profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            phone: true,
            email: true,
            realName: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const stats = await prisma.order.groupBy({
      by: ["status"],
      where: { workerId: session.user.id },
      _count: true,
      _sum: { finalSalary: true },
    });

    const orderStats = stats.reduce(
      (acc, curr) => {
        acc[curr.status] = {
          count: curr._count,
          totalEarnings: curr._sum.finalSalary?.toNumber() || 0,
        };
        return acc;
      },
      {} as Record<string, { count: number; totalEarnings: number }>,
    );

    return NextResponse.json({
      success: true,
      data: {
        profile,
        stats: orderStats,
      },
    });
  } catch (error) {
    console.error("Get worker profile error:", error);
    return NextResponse.json(
      { success: false, error: "获取个人资料失败" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      gender,
      age,
      serviceCategory,
      skills,
      workExperience,
      selfIntroduction,
      isOnline,
      onlineStatus,
    } = body;

    const profile = await prisma.workerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        gender,
        age,
        serviceCategory,
        skills,
        workExperience,
        selfIntroduction,
        isOnline: isOnline ?? false,
        onlineStatus: onlineStatus ?? "OFFLINE",
      },
      update: {
        gender,
        age,
        serviceCategory,
        skills,
        workExperience,
        selfIntroduction,
        isOnline,
        onlineStatus,
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Update worker profile error:", error);
    return NextResponse.json(
      { success: false, error: "更新个人资料失败" },
      { status: 500 },
    );
  }
}
