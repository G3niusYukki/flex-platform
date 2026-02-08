import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
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
        return {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.realName || user.phone,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
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
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
