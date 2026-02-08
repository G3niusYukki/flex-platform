"use client";

import { signOut } from "next-auth/react";
import { LogOut, User, Bell, Search, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function AdminHeader() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "新用户注册",
      desc: "张三已成功注册为工人",
      time: "5分钟前",
      unread: true,
    },
    {
      id: 2,
      title: "订单完成",
      desc: "ORD001订单已完成结算",
      time: "15分钟前",
      unread: true,
    },
    {
      id: 3,
      title: "派单提醒",
      desc: "有3个订单待派单",
      time: "30分钟前",
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-lg px-6">
      <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
        <Menu className="h-5 w-5 text-slate-600" />
      </button>
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索用户、订单..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">消息通知</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${notif.unread ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? "bg-blue-500" : "bg-slate-300"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {notif.title}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {notif.desc}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100">
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                  查看全部
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {session?.user?.name || "管理员"}
            </p>
            <p className="text-xs text-slate-500">超级管理员</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30">
            {session?.user?.name?.[0] || "管"}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">退出</span>
        </button>
      </div>
    </header>
  );
}
