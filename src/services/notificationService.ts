import { notificationRepository } from "@/database/repositories/artifactRepository";

export const notificationService = {
  async listRecent(limit = 20) {
    return notificationRepository.findRecent(limit);
  },

  async getUnreadCount() {
    return notificationRepository.findUnreadCount();
  },

  async markAsRead(id: string) {
    return notificationRepository.markAsRead(id);
  },

  async markAllAsRead() {
    return notificationRepository.markAllAsRead();
  },
};
