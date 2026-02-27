import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "请先登录" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { orderId, action, reason } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "订单不存在" },
        { status: 404 },
      );
    }

    if (action === "accept") {
      if (order.status !== "PENDING") {
        return NextResponse.json(
          { success: false, error: "订单状态不正确" },
          { status: 400 },
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "ACCEPTED",
          workerId: session.user.id,
        },
      });

      await prisma.dispatchRecord.create({
        data: {
          orderId,
          workerId: session.user.id,
          dispatchType: "WORKER_ACCEPT",
          status: "ACCEPTED",
          priorityScore: 100,
          acceptDeadline: new Date(),
          dispatchedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, data: updatedOrder });
    }

    if (action === "reject") {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PENDING",
        },
      });

      await prisma.dispatchRecord.create({
        data: {
          orderId,
          workerId: session.user.id,
          dispatchType: "WORKER_ACCEPT",
          status: "REJECTED",
          rejectReason: reason,
          priorityScore: 100,
          acceptDeadline: new Date(),
        },
      });

      return NextResponse.json({ success: true, data: updatedOrder });
    }

    if (action === "start") {
      if (order.status !== "ACCEPTED") {
        return NextResponse.json(
          { success: false, error: "订单状态不正确" },
          { status: 400 },
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "IN_PROGRESS",
          actualStart: new Date(),
        },
      });

      return NextResponse.json({ success: true, data: updatedOrder });
    }

    if (action === "complete") {
      if (order.status !== "IN_PROGRESS") {
        return NextResponse.json(
          { success: false, error: "订单状态不正确" },
          { status: 400 },
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "COMPLETED",
          actualEnd: new Date(),
          completedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, data: updatedOrder });
    }

    if (action === "cancel") {
      if (order.status === "COMPLETED" || order.status === "EVALUATED") {
        return NextResponse.json(
          { success: false, error: "已完成订单无法取消" },
          { status: 400 },
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "CANCELED",
        },
      });

      return NextResponse.json({ success: true, data: updatedOrder });
    }

    return NextResponse.json(
      { success: false, error: "无效的操作" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Order action error:", error);
    return NextResponse.json(
      { success: false, error: "操作失败" },
      { status: 500 },
    );
  }
}
