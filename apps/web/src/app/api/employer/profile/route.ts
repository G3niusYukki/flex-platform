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

    const profile = await prisma.employerProfile.findUnique({
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

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get employer profile error:", error);
    return NextResponse.json(
      { success: false, error: "获取企业资料失败" },
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
    const { companyName, contactPerson, contactPhone, licenseImage, verified } =
      body;

    const profile = await prisma.employerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName,
        contactPerson,
        contactPhone,
        licenseImage,
        verified: verified ?? false,
      },
      update: {
        companyName,
        contactPerson,
        contactPhone,
        licenseImage,
        verified,
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("Update employer profile error:", error);
    return NextResponse.json(
      { success: false, error: "更新企业资料失败" },
      { status: 500 },
    );
  }
}
