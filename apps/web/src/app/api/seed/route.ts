import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

// 初始化测试用户的API端点
// GET /api/seed - 创建测试用户供调试登录使用
export async function GET(request: NextRequest) {
    try {
        // 创建管理员账号
        const adminPhone = "admin";
        const adminPassword = "admin123";
        const adminPasswordHash = await hash(adminPassword, 12);

        const admin = await prisma.user.upsert({
            where: { phone: adminPhone },
            update: {
                passwordHash: adminPasswordHash,
                status: "ACTIVE",
                userType: "ADMIN"
            },
            create: {
                phone: adminPhone,
                passwordHash: adminPasswordHash,
                userType: "ADMIN",
                status: "ACTIVE",
                realName: "管理员",
            },
        });

        // 创建测试用户（前端调试登录用）
        const testPhone = "13800138000";
        const testPassword = "123456";
        const testPasswordHash = await hash(testPassword, 12);

        const testUser = await prisma.user.upsert({
            where: { phone: testPhone },
            update: {
                passwordHash: testPasswordHash,
                status: "ACTIVE"
            },
            create: {
                phone: testPhone,
                passwordHash: testPasswordHash,
                userType: "WORKER",
                status: "ACTIVE",
                realName: "测试用户",
            },
        });

        return NextResponse.json({
            success: true,
            message: "测试用户创建成功",
            users: {
                admin: {
                    phone: "admin",
                    password: "admin123",
                    type: "管理员（admin用）"
                },
                testUser: {
                    phone: "13800138000",
                    password: "123456",
                    type: "测试用户（web用）"
                }
            }
        });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "创建失败"
            },
            { status: 500 }
        );
    }
}
