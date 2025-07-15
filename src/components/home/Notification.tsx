"use client";

import { AlertCircle, Bell, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NotificationService } from "@/services/notificationService";
import {
  PaginationParamsInput,
  NotificationFiltersInput,
} from "@/types/api/notification";
import { UserNotificationsResponse } from "@/types/api/notification";

interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time: string;
  read: boolean;
}

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const notificationService = new NotificationService();

  const fetchNotifications = async (
    pageNum: number,
    append: boolean = false
  ) => {
    setLoading(true);
    try {
      const params: PaginationParamsInput = { page: pageNum, limit: 10 };
      const filters: NotificationFiltersInput = {
        status: "SENT",
      };

      const response: UserNotificationsResponse =
        await notificationService.getUserNotifications(params, filters);

      const mappedNotifications: NotificationItem[] =
        response.userNotifications.data.map((n) => ({
          id: n.id,
          title: n.title,
          description: n.content,
          time: n.created_at,
          read: n.status === "READ",
        }));

      setNotifications((prev) =>
        append ? [...prev, ...mappedNotifications] : mappedNotifications
      );
      setTotal(response.userNotifications.total);
    } catch (err) {
      setError("Không thể tải thông báo");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length === 0) return;

      await notificationService.markMultipleNotificationsAsRead(unreadIds);

      setNotifications((prev) =>
        prev.map((n) => (unreadIds.includes(n.id) ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError("Không thể đánh dấu thông báo là đã đọc");
      console.error(err);

      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasMore = notifications.length < total;

  return (
    <div className="relative mt-1.5" ref={ref}>
      <button
        className="cursor-pointer relative p-2 rounded-full hover:bg-[#B5D8EB]/30 transition"
        onClick={() => setOpen((o) => !o)}
        aria-label="Thông báo"
      >
        <motion.span
          whileHover={{
            rotate: [0, -18, 18, -12, 12, -7, 7, 0],
            transition: { duration: 0.6 },
          }}
          style={{ display: "inline-block" }}
        >
          <Bell className="w-5 h-5" />
        </motion.span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-xl border text-black">
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="max-h-80 rounded-3xl overflow-y-auto scrollbar-hidden"
          >
            {loading && notifications.length === 0 && (
              <div className="p-4 text-gray-500 text-sm text-center">
                Đang tải...
              </div>
            )}
            {error && (
              <div className="p-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            {!loading && !error && notifications.length === 0 && (
              <div className="p-4 text-gray-500 text-sm text-center">
                Không có thông báo mới.
              </div>
            )}
            {!loading && (
              <>
                {unreadCount > 0 && (
                  <button
                    className="w-full py-2 text-center text-sm text-blue-500 hover:bg-gray-100 cursor-pointer"
                    onClick={markAllAsRead}
                  >
                    Đánh dấu tất cả là đã đọc
                  </button>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-3 items-start border-b last:border-0 
                      ${n.read ? "bg-white" : "bg-[#E6F8F2]"}`}
                  >
                    {n.read ? (
                      <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0 text-gray-300" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold">{n.title}</div>
                      {n.description && (
                        <div className="text-sm text-gray-600">
                          {n.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(n.time).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                ))}
                {hasMore && (
                  <button
                    className="w-full py-2 text-center text-sm text-blue-500 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? "Đang tải..." : "Xem thêm"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
