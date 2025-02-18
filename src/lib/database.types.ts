export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _ProjectToTag: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_ProjectToTag_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_ProjectToTag_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      _TagToTask: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_TagToTask_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_TagToTask_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["id"]
          },
        ]
      }
      _TagToTimeEntry: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_TagToTimeEntry_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_TagToTimeEntry_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "TimeEntry"
            referencedColumns: ["id"]
          },
        ]
      }
      Account: {
        Row: {
          access_token: string | null
          createdAt: string
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          updatedAt: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          createdAt?: string
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          updatedAt: string
          userId: string
        }
        Update: {
          access_token?: string | null
          createdAt?: string
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ChatMessage: {
        Row: {
          content: string
          createdAt: string
          fileName: string | null
          fileType: string | null
          fileUrl: string | null
          id: string
          projectId: string
          replyToId: string | null
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          fileName?: string | null
          fileType?: string | null
          fileUrl?: string | null
          id: string
          projectId: string
          replyToId?: string | null
          userId: string
        }
        Update: {
          content?: string
          createdAt?: string
          fileName?: string | null
          fileType?: string | null
          fileUrl?: string | null
          id?: string
          projectId?: string
          replyToId?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ChatMessage_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ChatMessage_replyToId_fkey"
            columns: ["replyToId"]
            isOneToOne: false
            referencedRelation: "ChatMessage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ChatMessage_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Client: {
        Row: {
          address: string | null
          createdAt: string
          email: string | null
          id: string
          name: string
          orgId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          address?: string | null
          createdAt?: string
          email?: string | null
          id: string
          name: string
          orgId: string
          updatedAt: string
          userId: string
        }
        Update: {
          address?: string | null
          createdAt?: string
          email?: string | null
          id?: string
          name?: string
          orgId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Client_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Client_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Invoice: {
        Row: {
          address: string
          amount: number
          clientEmail: string | null
          clientName: string
          createdAt: string
          dueDate: string
          id: string
          number: string
          status: Database["public"]["Enums"]["InvoiceStatus"]
          updatedAt: string
          userId: string
        }
        Insert: {
          address: string
          amount: number
          clientEmail?: string | null
          clientName: string
          createdAt?: string
          dueDate: string
          id: string
          number: string
          status?: Database["public"]["Enums"]["InvoiceStatus"]
          updatedAt: string
          userId: string
        }
        Update: {
          address?: string
          amount?: number
          clientEmail?: string | null
          clientName?: string
          createdAt?: string
          dueDate?: string
          id?: string
          number?: string
          status?: Database["public"]["Enums"]["InvoiceStatus"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Invoice_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Notification: {
        Row: {
          createdAt: string
          data: string | null
          id: string
          message: string
          read: boolean
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string
        }
        Insert: {
          createdAt?: string
          data?: string | null
          id: string
          message: string
          read?: boolean
          title: string
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string
        }
        Update: {
          createdAt?: string
          data?: string | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notification_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Organization: {
        Row: {
          createdAt: string
          id: string
          name: string
          settings: Json | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          settings?: Json | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          settings?: Json | null
          updatedAt?: string
        }
        Relationships: []
      }
      Project: {
        Row: {
          billable: boolean
          billableAmount: number | null
          clientId: string | null
          color: string | null
          createdAt: string
          description: string | null
          id: string
          managerId: string
          name: string
          teamId: string | null
          updatedAt: string
          userId: string | null
        }
        Insert: {
          billable?: boolean
          billableAmount?: number | null
          clientId?: string | null
          color?: string | null
          createdAt?: string
          description?: string | null
          id: string
          managerId: string
          name: string
          teamId?: string | null
          updatedAt: string
          userId?: string | null
        }
        Update: {
          billable?: boolean
          billableAmount?: number | null
          clientId?: string | null
          color?: string | null
          createdAt?: string
          description?: string | null
          id?: string
          managerId?: string
          name?: string
          teamId?: string | null
          updatedAt?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Project_clientId_fkey"
            columns: ["clientId"]
            isOneToOne: false
            referencedRelation: "Client"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_managerId_fkey"
            columns: ["managerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Project_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ProjectInvitation: {
        Row: {
          createdAt: string
          id: string
          invitedById: string
          projectId: string
          status: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          invitedById: string
          projectId: string
          status?: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          invitedById?: string
          projectId?: string
          status?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ProjectInvitation_invitedById_fkey"
            columns: ["invitedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectInvitation_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectInvitation_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ProjectMember: {
        Row: {
          id: string
          joinedAt: string
          projectId: string
          role: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Insert: {
          id: string
          joinedAt?: string
          projectId: string
          role?: Database["public"]["Enums"]["Role"]
          userId: string
        }
        Update: {
          id?: string
          joinedAt?: string
          projectId?: string
          role?: Database["public"]["Enums"]["Role"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ProjectMember_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ProjectMember_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Subscription: {
        Row: {
          cancelAtPeriodEnd: boolean
          createdAt: string
          currentPeriodEnd: string | null
          id: string
          lemonSqueezyId: string | null
          plan: Database["public"]["Enums"]["SubscriptionPlan"]
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt: string
          userId: string
        }
        Insert: {
          cancelAtPeriodEnd?: boolean
          createdAt?: string
          currentPeriodEnd?: string | null
          id: string
          lemonSqueezyId?: string | null
          plan: Database["public"]["Enums"]["SubscriptionPlan"]
          status: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt: string
          userId: string
        }
        Update: {
          cancelAtPeriodEnd?: boolean
          createdAt?: string
          currentPeriodEnd?: string | null
          id?: string
          lemonSqueezyId?: string | null
          plan?: Database["public"]["Enums"]["SubscriptionPlan"]
          status?: Database["public"]["Enums"]["SubscriptionStatus"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Subscription_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Tag: {
        Row: {
          color: string | null
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          color?: string | null
          createdAt?: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          color?: string | null
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Task: {
        Row: {
          assignedTo: string | null
          assignedToAll: boolean
          createdAt: string
          description: string | null
          dueDate: string | null
          id: string
          name: string
          priority: Database["public"]["Enums"]["TaskPriority"]
          projectId: string
          status: string
          updatedAt: string
        }
        Insert: {
          assignedTo?: string | null
          assignedToAll?: boolean
          createdAt?: string
          description?: string | null
          dueDate?: string | null
          id: string
          name: string
          priority?: Database["public"]["Enums"]["TaskPriority"]
          projectId: string
          status?: string
          updatedAt: string
        }
        Update: {
          assignedTo?: string | null
          assignedToAll?: boolean
          createdAt?: string
          description?: string | null
          dueDate?: string | null
          id?: string
          name?: string
          priority?: Database["public"]["Enums"]["TaskPriority"]
          projectId?: string
          status?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Task_assignedTo_fkey"
            columns: ["assignedTo"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Task_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
        ]
      }
      Team: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          leaderId: string | null
          managerId: string | null
          name: string
          orgId: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          leaderId?: string | null
          managerId?: string | null
          name: string
          orgId?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          leaderId?: string | null
          managerId?: string | null
          name?: string
          orgId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Team_leaderId_fkey"
            columns: ["leaderId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Team_managerId_fkey"
            columns: ["managerId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Team_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      TeamInvitation: {
        Row: {
          createdAt: string
          id: string
          invitedById: string
          status: string
          teamId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          invitedById: string
          status?: string
          teamId: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          invitedById?: string
          status?: string
          teamId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamInvitation_invitedById_fkey"
            columns: ["invitedById"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamInvitation_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamInvitation_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      TeamMember: {
        Row: {
          createdAt: string
          id: string
          role: Database["public"]["Enums"]["TeamRole"]
          teamId: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          role?: Database["public"]["Enums"]["TeamRole"]
          teamId: string
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          role?: Database["public"]["Enums"]["TeamRole"]
          teamId?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TeamMember_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TeamMember_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      TimeEntry: {
        Row: {
          billable: boolean
          createdAt: string
          description: string | null
          duration: number | null
          endTime: string | null
          id: string
          invoiceId: string | null
          projectId: string
          startTime: string
          taskId: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          billable?: boolean
          createdAt?: string
          description?: string | null
          duration?: number | null
          endTime?: string | null
          id: string
          invoiceId?: string | null
          projectId: string
          startTime: string
          taskId?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          billable?: boolean
          createdAt?: string
          description?: string | null
          duration?: number | null
          endTime?: string | null
          id?: string
          invoiceId?: string | null
          projectId?: string
          startTime?: string
          taskId?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TimeEntry_invoiceId_fkey"
            columns: ["invoiceId"]
            isOneToOne: false
            referencedRelation: "Invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TimeEntry_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TimeEntry_taskId_fkey"
            columns: ["taskId"]
            isOneToOne: false
            referencedRelation: "Task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TimeEntry_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailVerified: string | null
          id: string
          image: string | null
          lastActive: string | null
          lemonSqueezyCustomerId: string | null
          lemonSqueezySubscriptionId: string | null
          name: string | null
          orgId: string | null
          password: string | null
          plan: string
          preferences: Json | null
          role: Database["public"]["Enums"]["UserRole"]
          stripeId: string | null
          updatedAt: string
          username: string
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: string | null
          id: string
          image?: string | null
          lastActive?: string | null
          lemonSqueezyCustomerId?: string | null
          lemonSqueezySubscriptionId?: string | null
          name?: string | null
          orgId?: string | null
          password?: string | null
          plan?: string
          preferences?: Json | null
          role?: Database["public"]["Enums"]["UserRole"]
          stripeId?: string | null
          updatedAt: string
          username: string
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: string | null
          id?: string
          image?: string | null
          lastActive?: string | null
          lemonSqueezyCustomerId?: string | null
          lemonSqueezySubscriptionId?: string | null
          name?: string | null
          orgId?: string | null
          password?: string | null
          plan?: string
          preferences?: Json | null
          role?: Database["public"]["Enums"]["UserRole"]
          stripeId?: string | null
          updatedAt?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_orgId_fkey"
            columns: ["orgId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      InvitationStatus: "PENDING" | "ACCEPTED" | "DECLINED"
      InvoiceStatus:
        | "DRAFT"
        | "SENT"
        | "PAID"
        | "OVERDUE"
        | "CANCELLED"
        | "PENDING"
      NotificationType:
        | "PROJECT_INVITATION"
        | "INVITATION_ACCEPTED"
        | "INVITATION_DECLINED"
        | "TASK_ASSIGNED"
        | "TASK_STATUS_CHANGED"
        | "PROJECT_MEMBER_ADDED"
        | "TEAM_INVITATION"
        | "TEAM_MEMBER_ADDED"
      Priority: "LOW" | "MEDIUM" | "HIGH"
      Role: "MANAGER" | "MEMBER"
      SubscriptionPlan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE"
      SubscriptionStatus: "ACTIVE" | "CANCELED" | "EXPIRED" | "TRIAL"
      TaskPriority: "LOW" | "MEDIUM" | "HIGH"
      TaskStatus: "TODO" | "IN_PROGRESS" | "COMPLETED"
      TeamRole: "OWNER" | "ADMIN" | "MEMBER"
      UserRole: "ADMIN" | "USER" | "MANAGER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
