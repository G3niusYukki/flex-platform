import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalUsers,
      totalOrders,
      pendingDispatch,
      inProgress,
      todayNewUsers,
      todayNewOrders,
      completedToday,
      totalRevenue,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "IN_PROGRESS" } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({
        where: {
          status: "COMPLETED",
          completedAt: { gte: today },
        },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          type: "ORDER_PAY",
          status: "COMPLETED",
        },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          employer: { select: { realName: true, phone: true } },
          worker: { select: { realName: true, phone: true } },
        },
      }),
    ]);

    const orderStatusCounts = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });

    const stats = {
      userCount: totalUsers,
      orderCount: totalOrders,
      pendingDispatchCount: pendingDispatch,
      inProgressCount: inProgress,
      todayNewUsers,
      todayNewOrders,
      completedOrders: completedToday,
      totalRevenue: totalRevenue._sum.amount?.toNumber() || 0,
      orderStatusCounts: orderStatusCounts.reduce(
        (acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    const formattedOrders = recentOrders.map((order) => ({
      id: order.orderNo,
      title: order.title,
      employer: order.employer?.realName || order.employer?.phone || "未知",
      worker: order.worker?.realName || order.worker?.phone || "待接单",
      status: order.status,
      amount: order.finalSalary?.toNumber() || order.expectedSalary.toNumber(),
      createdAt: order.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentOrders: formattedOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, error: "获取数据失败" },
      { status: 500 },
    );
  }
}
