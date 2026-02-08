"use client";

import { useEffect, useState } from "react";
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
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "合作企业",
    value: "2,000+",
    icon: Briefcase,
    color: "from-green-500 to-green-600",
  },
  {
    label: "成功派单",
    value: "100万+",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "平均薪资",
    value: "¥280/天",
    icon: DollarSign,
    color: "from-orange-500 to-orange-600",
  },
];

const features = [
  { icon: Zap, title: "智能派单", desc: "AI 算法精准匹配，最快 5 分钟响应" },
  { icon: Shield, title: "安全保障", desc: "实名认证+资金托管+评价体系" },
  {
    icon: CheckCircle,
    title: "薪资保障",
    desc: "日结周结灵活结算，平台垫付无忧",
  },
  { icon: TrendingUp, title: "成长体系", desc: "技能培训+信用积累+晋升通道" },
];

const steps = [
  { step: "1", title: "注册账号", desc: "选择身份类型，完善基本信息" },
  { step: "2", title: "实名认证", desc: "上传证件信息，平台审核验证" },
  { step: "3", title: "接单工作", desc: "浏览职位信息，一键接单上岗" },
  { step: "4", title: "获取收益", desc: "完成工作结算，薪资自动到账" },
];

export default function HomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.data) setOrders(data.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-28">
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              平台服务全面升级 · 新用户首单立减 50 元
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              灵活用工
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                高效对接
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              专业的灵活用工服务平台，连接优质雇主与工人，让用工更简单、更高效、更安全
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                浏览职位
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                免费注册
              </Link>
              <DebugLoginButton />
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" /> 免费注册
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" /> 实名认证
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" /> 日结薪资
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}
                />
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg mb-4`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              平台核心优势
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              四大优势，让用工更简单
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative inline-flex p-3 rounded-xl bg-blue-100 text-blue-600 mb-5">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="relative text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="relative text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              快速开始
            </h2>
            <p className="mt-4 text-lg text-slate-600">四步即可上岗赚钱</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                )}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold shadow-lg shadow-blue-500/30 mb-4 hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              立即开始你的灵活就业之旅
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              注册即享新手礼包，绑定银行卡即可接单
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                免费注册
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all duration-300"
              >
                浏览职位
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              最新职位
            </h2>
            <p className="mt-1 text-slate-500">热门职位等你来抢</p>
          </div>
          <Link
            href="/jobs"
            className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            查看全部
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 animate-pulse"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="h-6 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="h-4 w-1/2 rounded bg-slate-200 mb-4" />
                <div className="space-y-2">
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
                className="group block bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {order.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                  >
                    {getOrderStatusText(order.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {order.serviceCategory}
                  </span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                  {order.description}
                </p>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">
                      {order.city || order.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{formatDate(order.scheduledStart)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-green-600">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-lg">
                      {formatCurrency(Number(order.expectedSalary))}
                    </span>
                  </div>
                  <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    详情 <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500">暂无职位，敬请期待</p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              去职位列表 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold text-white">
                灵活用工平台
              </span>
            </div>
            <p className="text-sm">© 2024 灵活用工平台 版权所有</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
