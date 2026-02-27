import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "未授权" }, { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "20", 10)),
  );
  const userType = searchParams.get("userType");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  try {
    const where: Record<string, unknown> = { userType: { not: "ADMIN" } };
    if (userType && ["WORKER", "EMPLOYER"].includes(userType))
      where.userType = userType;
    if (
      status &&
      ["PENDING", "ACTIVE", "INACTIVE", "SUSPENDED"].includes(status)
    )
      where.status = status;
    if (search?.trim()) {
      where.OR = [
        { phone: { contains: search, mode: "insensitive" } },
        { realName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          phone: true,
          email: true,
          realName: true,
          avatar: true,
          userType: true,
          status: true,
          createdAt: true,
          lastLoginAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    return NextResponse.json({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "未授权" }, { status: 401 });

  try {
    const body = await request.json();
    const { userId, status, realName } = body;

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (realName !== undefined) updateData.realName = realName;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 });
  }
}
