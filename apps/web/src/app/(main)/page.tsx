"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Users,
  Briefcase,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";
import { DebugLoginButton } from "@/components/debug-login-button";
import {
  formatCurrency,
  formatDate,
  getOrderStatusText,
  getOrderStatusColor,
} from "@/lib/utils";

type Order = {
  id: string;
  orderNo: string;
  title: string;
  description: string;
  serviceCategory: string;
  address: string;
  city: string | null;
  scheduledStart: string;
  expectedSalary: unknown;
  status: string;
};

const stats = [
  {
    label: "注册工人",
    value: "50,000+",
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    label: "合作企业",
    value: "2,000+",
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    label: "成功派单",
    value: "100万+",
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    label: "平均薪资",
    value: "¥280/天",
    icon: DollarSign,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
  },
];

const features = [
  {
    icon: Zap,
    title: "智能派单",
    desc: "AI 算法精准匹配，最快 5 分钟响应",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "安全保障",
    desc: "实名认证+资金托管+评价体系",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    icon: Award,
    title: "薪资保障",
    desc: "日结周结灵活结算，平台垫付无忧",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    icon: TrendingUp,
    title: "成长体系",
    desc: "技能培训+信用积累+晋升通道",
    gradient: "from-purple-400 to-pink-500",
  },
];

const steps = [
  { step: "1", title: "注册账号", desc: "选择身份类型，完善基本信息", icon: Users },
  { step: "2", title: "实名认证", desc: "上传证件信息，平台审核验证", icon: Shield },
  { step: "3", title: "接单工作", desc: "浏览职位信息，一键接单上岗", icon: Briefcase },
  { step: "4", title: "获取收益", desc: "完成工作结算，薪资自动到账", icon: DollarSign },
];

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetch("/api/orders?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.data) setOrders(data.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* 动态背景 */}
        <div className="absolute inset-0 gradient-hero animate-gradient" />
        <div className="absolute inset-0 bg-grid" />

        {/* 浮动装饰元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-float-slow" />

        {/* 装饰卡片 */}
        <div className="hidden lg:block absolute top-32 right-20 glass rounded-2xl p-4 shadow-xl animate-float">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">订单已完成</p>
              <p className="text-xs text-slate-500">刚刚 · +¥280</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-32 left-20 glass rounded-2xl p-4 shadow-xl animate-float-delayed">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">5.0 好评</p>
              <p className="text-xs text-slate-500">来自雇主赵先生</p>
            </div>
          </div>
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* 标签 */}
            <div
              className={`inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-sm font-medium text-slate-700 mb-8 shadow-lg transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>平台服务全面升级</span>
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              <span className="text-blue-600 font-semibold">新用户首单立减 50 元</span>
            </div>

            {/* 标题 */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <span className="text-slate-900">灵活用工</span>
              <br />
              <span className="text-gradient">高效对接平台</span>
            </h1>

            {/* 副标题 */}
            <p
              className={`mt-8 text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              连接优质雇主与工人，让用工更简单、更高效、更安全
            </p>

            {/* 按钮组 */}
            <div
              className={`mt-12 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <Link
                href="/jobs"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 btn-shine"
              >
                浏览职位
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                免费注册
              </Link>
              <DebugLoginButton />
            </div>

            {/* 信任标识 */}
            <div
              className={`mt-12 flex items-center justify-center gap-8 text-sm text-slate-500 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                免费注册
              </span>
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                实名认证
              </span>
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                日结薪资
              </span>
            </div>
          </div>
        </div>

        {/* 底部波浪 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.bgGradient} p-8 hover-lift cursor-default`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 装饰圆形 */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 group-hover:scale-150 transition-transform duration-500`}
                />

                {/* 图标 */}
                <div
                  className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <stat.icon className="h-7 w-7" />
                </div>

                {/* 数值 */}
                <p className="relative text-4xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </p>
                <p className="relative text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots" />

        <div className="container relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
              <Zap className="h-4 w-4" />
              核心优势
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              四大优势，让用工更简单
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              专业的技术与服务，为您保驾护航
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover-lift gradient-border"
              >
                {/* 图标 */}
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>

                {/* 悬停箭头 */}
                <div className="mt-6 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  了解更多 <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-4">
              <Clock className="h-4 w-4" />
              快速开始
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              四步即可上岗赚钱
            </h2>
            <p className="text-xl text-slate-600">
              简单流程，快速上手
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* 连接线 */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 rounded-full" />

            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center group">
                {/* 步骤数字 */}
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                  {/* 外圈 */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 group-hover:scale-110 transition-transform duration-500" />
                  {/* 内圈 */}
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300">
                    <span className="text-3xl font-bold text-white">{item.step}</span>
                  </div>
                </div>

                {/* 图标 */}
                <div className="inline-flex p-3 rounded-xl bg-slate-100 text-slate-600 mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-300">
                  <item.icon className="h-5 w-5" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* 背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 bg-grid opacity-10" />

        {/* 装饰 */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              立即开始你的灵活就业之旅
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              注册即享新手礼包，绑定银行卡即可接单
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 btn-shine"
              >
                免费注册
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-300"
              >
                浏览职位
              </Link>
            </div>

            {/* 统计数据 */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">24h</p>
                <p className="text-blue-200 mt-1">快速响应</p>
              </div>
              <div className="text-center border-x border-white/20">
                <p className="text-4xl font-bold text-white">99.9%</p>
                <p className="text-blue-200 mt-1">资金安全</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">4.9</p>
                <p className="text-blue-200 mt-1">用户评分</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700 mb-4">
                <Briefcase className="h-4 w-4" />
                热门推荐
              </span>
              <h2 className="text-4xl font-bold text-slate-900">最新职位</h2>
              <p className="mt-2 text-slate-600">热门职位等你来抢</p>
            </div>
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              查看全部
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white p-8 shadow-lg animate-pulse"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
                    <div className="h-7 w-20 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-5 w-1/2 rounded-lg bg-slate-200 mb-6" />
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/jobs/${order.id}`}
                  className="group block bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 hover-lift gradient-border"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {order.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getOrderStatusColor(order.status)}`}
                    >
                      {getOrderStatusText(order.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-100">
                      {order.serviceCategory}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {order.description}
                  </p>

                  <div className="space-y-3 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="truncate">{order.city || order.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <span>{formatDate(order.scheduledStart)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(Number(order.expectedSalary))}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      详情 <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-xl text-slate-500 mb-4">暂无职位，敬请期待</p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
              >
                去职位列表 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />

        <div className="container relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">灵活用工平台</span>
                <p className="text-sm text-slate-500">高效对接 · 安全可靠</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm">
              <Link href="/jobs" className="hover:text-white transition-colors">职位列表</Link>
              <Link href="/register" className="hover:text-white transition-colors">免费注册</Link>
              <Link href="/login" className="hover:text-white transition-colors">登录</Link>
            </div>

            {/* Copyright */}
            <p className="text-sm">© 2024 灵活用工平台 版权所有</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
