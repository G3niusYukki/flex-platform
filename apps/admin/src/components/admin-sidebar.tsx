"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Send,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/dashboard/users", label: "用户管理", icon: Users },
  { href: "/admin/dashboard/orders", label: "订单管理", icon: Package },
  { href: "/admin/dashboard/dispatch", label: "派单管理", icon: Send },
];

const bottomNavItems = [
  { href: "#", label: "数据报表", icon: BarChart3 },
  { href: "#", label: "系统设置", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-lg shadow-blue-500/30">
          管
        </div>
        <div>
          <span className="font-semibold text-white text-lg">灵活用工</span>
          <p className="text-xs text-slate-400">管理后台</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
        <div className="pt-6 pb-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            系统
          </p>
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
            <Shield className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              超级管理员
            </p>
            <p className="text-xs text-slate-400">在线</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
