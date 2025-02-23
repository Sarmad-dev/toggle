import { supabase } from "@/lib/supabase/client";
import { ChatMessage, Notification } from "@prisma/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";

export class RealtimeManager {
  private static channels: Map<string, RealtimeChannel> = new Map();

  static async subscribeToProject(projectId: string, userId: string, callbacks: {
    onMessage?: (message: ChatMessage) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPresenceChange?: (presence: any) => void;
  }) {
    if (this.channels.has(projectId)) {
      return;
    }

    const channel = supabase.channel(`project:${projectId}`, {
      config: {
        broadcast: { ack: true },
        presence: { key: userId }
      }
    })
    .on('system', { event: 'error' }, (error) => {
      console.error('Realtime error:', error);
      channel.subscribe();
    });

    // Subscribe to messages
    channel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        callbacks.onMessage?.(payload);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        callbacks.onPresenceChange?.(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('join', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('leave', key, leftPresences);
      });

    await channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    this.channels.set(projectId, channel);
  }

  static async subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
    const channel = supabase.channel(`notifications:${userId}`);

    channel
      .on('broadcast', { event: 'notification' }, ({ payload }) => {
        onNotification(payload);
        toast.message("New Notification", {
          description: payload.content,
        });
      });

    await channel.subscribe();
    this.channels.set(`notifications:${userId}`, channel);
  }

  static async unsubscribeFromProject(projectId: string) {
    const channel = this.channels.get(projectId);
    if (channel) {
      await channel.unsubscribe();
      this.channels.delete(projectId);
    }
  }

  static async unsubscribeFromNotifications(userId: string) {
    const channel = this.channels.get(`notifications:${userId}`);
    if (channel) {
      await channel.unsubscribe();
      this.channels.delete(`notifications:${userId}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async sendMessage(projectId: string, message: any) {
    const channel = this.channels.get(projectId);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'message',
        payload: message,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async sendNotification(userId: string, notification: any) {
    const channel = this.channels.get(`notifications:${userId}`);
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'notification',
        payload: notification,
      });
    }
  }
} 