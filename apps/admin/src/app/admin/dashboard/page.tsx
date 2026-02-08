"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Send,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  userCount: number;
  orderCount: number;
  pendingDispatchCount: number;
  inProgressCount: number;
  todayNewUsers: number;
  todayNewOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

const statCards = [
  {
    key: "userCount",
    label: "用户总数",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    trend: "+12%",
    trendUp: true,
  },
  {
    key: "orderCount",
    label: "订单总数",
    icon: Package,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    trend: "+8%",
    trendUp: true,
  },
  {
    key: "pendingDispatchCount",
    label: "待派单",
    icon: Send,
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    trend: "-5%",
    trendUp: false,
  },
  {
    key: "completedOrders",
    label: "今日完成",
    icon: Activity,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    trend: "+15%",
    trendUp: true,
  },
];

const recentOrders = [
  {
    id: "ORD001",
    title: "仓库分拣员",
    user: "张三",
    status: "进行中",
    amount: 280,
    time: "10:30",
  },
  {
    id: "ORD002",
    title: "餐厅服务员",
    user: "李四",
    status: "待派单",
    amount: 250,
    time: "10:15",
  },
  {
    id: "ORD003",
    title: "活动引导员",
    user: "王五",
    status: "已完成",
    amount: 300,
    time: "09:45",
  },
  {
    id: "ORD004",
    title: "快递配送员",
    user: "赵六",
    status: "进行中",
    amount: 320,
    time: "09:30",
  },
  {
    id: "ORD005",
    title: "展会工作人员",
    user: "钱七",
    status: "待派单",
    amount: 280,
    time: "09:00",
  },
];

const quickActions = [
  {
    icon: Users,
    label: "用户管理",
    href: "/admin/dashboard/users",
    color: "bg-blue-500",
  },
  {
    icon: Package,
    label: "订单管理",
    href: "/admin/dashboard/orders",
    color: "bg-purple-500",
  },
  {
    icon: Send,
    label: "派单管理",
    href: "/admin/dashboard/dispatch",
    color: "bg-amber-500",
  },
  { icon: DollarSign, label: "财务管理", href: "#", color: "bg-green-500" },
  { icon: Calendar, label: "日程安排", href: "#", color: "bg-pink-500" },
  { icon: Clock, label: "数据报表", href: "#", color: "bg-indigo-500" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    userCount: 12847,
    orderCount: 35621,
    pendingDispatchCount: 156,
    inProgressCount: 423,
    todayNewUsers: 89,
    todayNewOrders: 234,
    completedOrders: 189,
    totalRevenue: 2894500,
  });
  const [loading, setLoading] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + "万";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return "¥" + num.toLocaleString();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据概览</h1>
          <p className="text-slate-500 mt-1">实时监控平台运营数据</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">数据更新时间：刚刚</span>
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors">
            <Calendar className="h-4 w-4" />
            今日数据
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 animate-pulse"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-200 mb-4" />
              <div className="h-4 w-24 rounded bg-slate-200 mb-2" />
              <div className="h-8 w-32 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.key}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}
              />
              <div className="flex items-start justify-between">
                <div className={`inline-flex p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon
                    className={`h-6 w-6 bg-gradient-to-r ${stat.color} text-white`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trendUp ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {stat.key === "userCount"
                    ? formatNumber(stats.userCount)
                    : stat.key === "orderCount"
                      ? formatNumber(stats.orderCount)
                      : stat.key === "pendingDispatchCount"
                        ? stats.pendingDispatchCount
                        : stat.key === "completedOrders"
                          ? stats.completedOrders
                          : 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                实时订单
              </span>
              <a
                href="/admin/dashboard/orders"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                查看全部 <ArrowUpRight className="h-4 w-4" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      订单编号
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      订单标题
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      用户
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      状态
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      金额
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                      时间
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-blue-600">
                        {order.id}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-900">
                        {order.title}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {order.user}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            order.status === "进行中"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "待派单"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-green-600">
                        ¥{order.amount}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500">
                        {order.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900">
              快捷操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="group flex flex-col items-center justify-center gap-3 rounded-xl bg-slate-50 p-4 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
                >
                  <div
                    className={`p-3 rounded-xl ${action.color} shadow-lg shadow-opacity-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {action.label}
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">今日收入</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(125680)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+18.2%</span>
              <span className="text-slate-500">较昨日</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">新增用户</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.todayNewUsers}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+23%</span>
              <span className="text-slate-500">较昨日</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">新增订单</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.todayNewOrders}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-slate-500">较昨日</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
