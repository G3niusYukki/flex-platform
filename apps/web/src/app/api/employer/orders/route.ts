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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { employerId: session.user.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          worker: {
            select: { id: true, realName: true, avatar: true, phone: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const stats = await prisma.order.groupBy({
      by: ["status"],
      where: { employerId: session.user.id },
      _count: true,
      _sum: { finalSalary: true },
    });

    const statusCounts = stats.reduce(
      (acc, curr) => {
        acc[curr.status] = {
          count: curr._count,
          totalSpent: curr._sum.finalSalary?.toNumber() || 0,
        };
        return acc;
      },
      {} as Record<string, { count: number; totalSpent: number }>,
    );

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: statusCounts,
      },
    });
  } catch (error) {
    console.error("Get employer orders error:", error);
    return NextResponse.json(
      { success: false, error: "获取订单列表失败" },
      { status: 500 },
    );
  }
}
