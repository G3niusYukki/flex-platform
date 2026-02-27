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

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "钱包不存在" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { walletId: wallet.id };
    if (type) where.type = type;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        wallet: {
          ...wallet,
          balance: wallet.balance.toNumber(),
          frozenBalance: wallet.frozenBalance.toNumber(),
        },
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    return NextResponse.json(
      { success: false, error: "获取钱包信息失败" },
      { status: 500 },
    );
  }
}

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
    const { amount, type } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "金额必须大于0" },
        { status: 400 },
      );
    }

    let wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: session.user.id },
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: type || "DEPOSIT",
        status: "PENDING",
        description: type === "WITHDRAW" ? "提现申请" : "充值",
      },
    });

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { success: false, error: "创建交易失败" },
      { status: 500 },
    );
  }
}
