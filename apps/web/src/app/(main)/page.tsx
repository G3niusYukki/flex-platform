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
  Star,
  Clock,
  Award,
  Sparkles,
  Bot,
  Cpu,
  Brain,
  Network,
  Activity,
  MessageCircle,
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

// AI 对话气泡内容
const aiMessages = [
  "正在分析 1,234 个岗位需求...",
  "已为您匹配到 56 位合适人选",
  "今日完成 2,456 次智能派单",
  "平均匹配时间: 4.2 秒",
  "已学习 100 万+ 成功案例",
  "人类员工满意度: 99.2%",
];

const stats = [
  {
    label: "AI 已服务人类",
    value: "50,000+",
    icon: Users,
    gradient: "from-cyan-500 to-blue-600",
    bgGradient: "from-cyan-50 to-blue-50",
  },
  {
    label: "AI 合作企业",
    value: "2,000+",
    icon: Briefcase,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    label: "AI 派单次数",
    value: "100万+",
    icon: Brain,
    gradient: "from-fuchsia-500 to-pink-600",
    bgGradient: "from-fuchsia-50 to-pink-50",
  },
  {
    label: "平均响应时间",
    value: "4.2秒",
    icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50",
  },
];

const features = [
  {
    icon: Brain,
    title: "神经网络匹配",
    desc: "深度学习算法，精准匹配人岗需求",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    icon: Cpu,
    title: "AI 秒速派单",
    desc: "毫秒级响应，智能调度最优人选",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    icon: Shield,
    title: "AI 合规监控",
    desc: "24/7 智能风控，保障双方权益",
    gradient: "from-emerald-400 to-green-500",
  },
  {
    icon: Network,
    title: "智能薪酬核算",
    desc: "自动化结算，透明高效零误差",
    gradient: "from-pink-400 to-rose-500",
  },
];

const steps = [
  { step: "1", title: "接入 AI 系统", desc: "注册账号，AI 开始分析您的能力", icon: Bot },
  { step: "2", title: "AI 能力评估", desc: "智能测评，建立专属人才画像", icon: Brain },
  { step: "3", title: "等待 AI 派单", desc: "算法匹配，秒级推送合适任务", icon: Cpu },
  { step: "4", title: "完成任务获薪", desc: "AI 核算工资，自动发放到账", icon: DollarSign },
];

// AI 打字机效果组件
function AITypingMessage() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const message = aiMessages[messageIndex];
    let charIndex = 0;

    if (isTyping) {
      const typingInterval = setInterval(() => {
        if (charIndex <= message.length) {
          setDisplayText(message.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    } else {
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % aiMessages.length);
        setDisplayText("");
        setIsTyping(true);
      }, 500);
    }
  }, [messageIndex, isTyping]);

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="glass-dark rounded-2xl rounded-tl-none px-4 py-2 max-w-[240px]">
        <p className="text-sm text-slate-700">
          {displayText}
          <span className="inline-block w-1 h-4 bg-violet-500 ml-1 animate-pulse" />
        </p>
      </div>
    </div>
  );
}

// AI 状态指示器
function AIStatusIndicator() {
  const [count, setCount] = useState(1234567);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-slate-600">AI 运行中</span>
      <span className="text-slate-400">·</span>
      <span className="text-violet-600 font-medium">{count.toLocaleString()}</span>
      <span className="text-slate-500">次派单</span>
    </div>
  );
}

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
        {/* 动态背景 - 更强的科技感 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5YzkyYWMiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4aDEydjEySDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

        {/* 电路线装饰 */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path d="M0,100 L100,100 L100,200 L300,200 L300,150 L500,150" stroke="url(#circuit-gradient)" strokeWidth="1" fill="none" className="animate-pulse" />
            <path d="M600,50 L500,50 L500,100 L400,100 L400,250" stroke="url(#circuit-gradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
            <path d="M200,300 L200,200 L350,200 L350,100 L450,100" stroke="url(#circuit-gradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>
        </div>

        {/* 浮动装饰元素 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-full blur-3xl" />

        {/* AI 对话气泡 - 左上角 */}
        <div className="hidden lg:block absolute top-32 left-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <AITypingMessage />
        </div>

        {/* AI 状态卡片 - 右上角 */}
        <div className="hidden lg:block absolute top-32 right-20 glass rounded-2xl p-4 shadow-xl animate-float border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI 核心运行中</p>
              <p className="text-xs text-slate-300">已学习 100万+ 案例</p>
            </div>
          </div>
        </div>

        {/* 完成订单卡片 - 右下 */}
        <div className="hidden lg:block absolute bottom-40 right-32 glass rounded-2xl p-4 shadow-xl animate-float-delayed border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI 派单完成</p>
              <p className="text-xs text-slate-300">刚刚 · 匹配耗时 3.2s</p>
            </div>
          </div>
        </div>

        {/* 评分卡片 - 左下 */}
        <div className="hidden lg:block absolute bottom-32 left-20 glass rounded-2xl p-4 shadow-xl animate-float border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">人类满意度</p>
              <p className="text-xs text-slate-300">99.2% · 来自 5万+ 评价</p>
            </div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* AI 状态指示器 */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 border border-white/20 animate-fade-in-up">
              <AIStatusIndicator />
            </div>

            {/* 主标题 */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">AI 智能</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                雇佣平台
              </span>
            </h1>

            {/* 副标题 - AI 风格 */}
            <p className="text-xl md:text-2xl text-slate-300 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              人类，是时候为 <span className="text-violet-400 font-semibold">AI</span> 工作了
            </p>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              神经网络秒速匹配 · AI 智能派单 · 让用工更聪明
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                href="/jobs"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  接受 AI 派遣
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                加入 AI 网络
              </Link>
              <DebugLoginButton />
            </div>

            {/* 信任标识 */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">神经网络 v3.0</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">实时学习优化</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">毫秒级响应</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部波浪过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Activity className="h-4 w-4" />
              AI 实时数据
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              AI 正在改变用工方式
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 hover-lift cursor-default group animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-cyan-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Cpu className="h-4 w-4" />
              核心算法
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI 为您提供的超能力
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              我们的神经网络经过 100万+ 成功案例训练，让匹配更精准、派单更高效
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - AI Style */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium text-white mb-4 border border-white/20">
              <Network className="h-4 w-4" />
              AI 工作流程
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              4 步接入 AI 系统
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              简单几步，让 AI 为您安排最适合的工作
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative glass rounded-2xl p-6 border border-white/10 hover:border-violet-500/50 transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* 连接线 */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500" />
                )}

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-violet-400 text-sm font-medium mb-1">步骤 {step.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                AI 推荐任务
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                AI 为您精选的任务
              </h2>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 mt-4 md:mt-0 group"
            >
              查看全部任务
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order, index) => (
                <Link
                  key={order.id}
                  href={`/jobs/${order.id}`}
                  className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          AI 推荐
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                        {order.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{order.address || order.city || "待定"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{formatDate(order.scheduledStart)}</span>
                    </div>
                    {typeof order.expectedSalary === 'number' && order.expectedSalary > 0 && (
                      <div className="flex items-center gap-2 text-violet-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(order.expectedSalary)}/天</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">AI 正在学习中，暂无推荐任务</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMThoMTJ2MTJIMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-white text-sm mb-6">
              <Bot className="h-4 w-4" />
              AI 正在等待您的加入
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              准备好被 AI 雇佣了吗？
            </h2>
            <p className="text-xl text-white/80 mb-8">
              加入我们，让 AI 为您匹配最适合的工作机会
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Bot className="h-5 w-5" />
                立即加入 AI 网络
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
              >
                浏览 AI 任务
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI 雇佣平台</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                全球领先的 AI 智能用工平台，让人工智能为您匹配最适合的工作机会，开创人机协作新时代。
              </p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-sm">AI 系统全天候运行</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">快速链接</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="hover:text-violet-400 transition-colors">AI 任务列表</Link></li>
                <li><Link href="/register" className="hover:text-violet-400 transition-colors">加入 AI 网络</Link></li>
                <li><Link href="/login" className="hover:text-violet-400 transition-colors">登录系统</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">联系我们</h4>
              <ul className="space-y-2 text-sm">
                <li>服务热线：400-888-8888</li>
                <li>商务合作：business@ai-hire.com</li>
                <li>技术支持：support@ai-hire.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 AI 雇佣平台. All rights reserved. | 让 AI 为人类创造更多可能</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
