/* eslint no-var: 0 */
import {
  NotificationType as PrismaNotificationType,
  Project as PrismaProject,
  TaskPriority,
  Team,
  User,
} from "@prisma/client";

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
    event_name: string;
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

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

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
      position: "top" | "bottom" | "left" | "right";
    };
    title: {
      display: boolean;
      text: string;
    };
  };
}

export type TeamList = Team & {
  members: { user: User }[];
  projects: PrismaProject[];
};

export interface ProjectWithDetails {
  id: string;
  name: string;
  description: string;
  teamId: string | "none";
  billable: boolean;
  billableAmount: number;
  color: string;
  team: {
    id: string;
    name: string;
  } | null;
  members: {
    user: {
      id: string;
      username: string;
    };
  }[];
  _count: {
    tasks: number;
    members: number;
    timeEntries: number;
  };
}

export interface TimeEntryColumn {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  project: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  billable: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string | null;
  client: { 
    id: string;
    name: string;
  } | null;
  _count: {
    tasks: number;
    timeEntries: number;
    members: number;
  };
  userId: string;
  billable: boolean;
  team: {
    id: string;
    name: string;
  } | null;
}

export interface Task {
  id: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: Date | null;
  priority: TaskPriority;
  projectId: string;
  assignedTo: string | null;
  assignedToAll: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string;
  } | null;
}