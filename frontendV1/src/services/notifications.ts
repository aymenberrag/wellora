import api from "./api";

export type NotificationItem = {
  id: number;
  type: string;
  severity: "info" | "warning" | "critical" | "success";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  url: string | null;
};

export type NotificationResponse = {
  count: number;
  unread_count: number;
  page: number;
  page_size: number;
  results: NotificationItem[];
};

export async function getNotifications(params: Record<string, string | number> = {}) {
  const response = await api.get<NotificationResponse>("/notifications/", { params });
  return response.data;
}

export async function markNotificationRead(id: number) {
  const response = await api.patch<NotificationItem>(`/notifications/${id}/read/`);
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.post<{ updated: number }>("/notifications/mark-all-read/");
  return response.data;
}
