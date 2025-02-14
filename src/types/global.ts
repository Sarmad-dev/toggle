/* eslint no-var: 0 */
import { Server } from "socket.io";
import { NotificationType as PrismaNotificationType, Project, Team, User } from "@prisma/client";

declare global {
  let socketIO: Server | undefined;

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      socketIO: Server | undefined;
    }
  }

  var io: import("socket.io").Server;
  var httpServer: import("http").Server;
}

export type NotificationType = PrismaNotificationType;

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  projectId: string;
  createdAt: Date;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  replyTo?: {
    id: string;
    content: string;
    user: {
      username: string;
    };
  } | null;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  files?: {
    url: string;
    fileName: string;
    fileType: string;
  }[];
}

export interface OnlineUser {
  userId: string;
  username: string;
  lastSeen: Date;
}

export interface ProjectChat {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
}

export interface LemonSqueezyCheckout {
  event_name: string;
  data: {
    type: string;
    id: string;
    attributes: {
      store_id: number;
      variant_id: number;
      custom_price: number | null;
      customer_id: string;
      product_options: {
        name: string;
        description: string;
        media: string[];
        redirect_url: string;
        receipt_button_text: string;
        receipt_link_url: string;
        receipt_thank_you_note: string;
        enabled_variants: string[];
      };
      checkout_options: {
        embed: boolean;
        media: boolean;
        logo: boolean;
        desc: boolean;
        discount: boolean;
        skip_trial: boolean;
        subscription_preview: boolean;
        button_color: string;
      };
      checkout_data: {
        email: string;
        name: string;
        billing_address: string[];
        tax_number: string;
        discount_code: string;
        custom: string[];
        variant_quantities: string[];
      };
      expires_at: Date | null;
      created_at: Date;
      updated_at: Date;
      test_mode: boolean;
      url: boolean;
    };
    relationships: {
      store: {
        links: {
          related: string;
          self: string;
        };
        variant: {
          links: {
            related: string;
            self: string;
          };
        };
      };
      links: {
        self: string;
      };
    };
  };
  meta: {
    custom_data: {
      userId: string;
    };
  };
}

export type FilterType = {
  type: "projects" | "teams" | "billable";
  id?: string;
  chartType?: "bar" | "pie" | "line" | "area";
};

export interface Report {
  title: string;
  description: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface TimeEntry {
  date: string;
  hours: number;
}

export type ReportData = {
  totalHours: number;
  totalEarnings: number;
  activeProjects: number;
  timeEntries: TimeEntry[];
  totalMembers: number;
};

export interface FilteredChartData {
  labels: string[];
  values: number[];
}

export interface ChartOptions {
  responsive: boolean;
  plugins: {
    legend: {
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    title: {
      display: boolean;
      text: string;
    };
  };
}

export type TeamList = (Team & {
  members: { user: User }[];
  projects: Project[];
})