import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { verifyCode } from "@/lib/sms";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    // 密码登录
    CredentialsProvider({
      id: "credentials",
      name: "密码登录",
      credentials: {
        phone: { label: "手机号", type: "tel" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password)
          throw new Error("请输入手机号和密码");
        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });
        if (!user) throw new Error("用户不存在");
        if (user.status !== "ACTIVE") throw new Error("账户状态异常");
        const isPasswordValid = await compare(
          credentials.password,
          user.passwordHash || "",
        );
        if (!isPasswordValid) throw new Error("密码错误");

        // 更新最后登录时间
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.realName || user.phone,
          image: user.avatar,
          userType: user.userType,
        };
      },
    }),
    // 验证码登录
    CredentialsProvider({
      id: "sms",
      name: "验证码登录",
      credentials: {
        phone: { label: "手机号", type: "tel" },
        code: { label: "验证码", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code)
          throw new Error("请输入手机号和验证码");

        // 验证验证码
        const verifyResult = verifyCode(credentials.phone, credentials.code);
        if (!verifyResult.success) {
          throw new Error(verifyResult.message);
        }

        // 查找或创建用户
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) {
          // 新用户自动注册
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              status: "ACTIVE",
              userType: "WORKER",
            },
          });
        }

        if (user.status !== "ACTIVE") throw new Error("账户状态异常");

        // 更新最后登录时间
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.realName || user.phone,
          image: user.avatar,
          userType: user.userType,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = (user as { userType?: string }).userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
      }
      return session;
    },
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userType?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    userType?: string;
  }
}
