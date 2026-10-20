export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      account_activity: {
        Row: {
          actor_id: string
          amount: number | null
          balance_after: number | null
          created_at: string
          id: string
          kind: string
          reason: string
          user_id: string
        }
        Insert: {
          actor_id: string
          amount?: number | null
          balance_after?: number | null
          created_at?: string
          id?: string
          kind: string
          reason: string
          user_id: string
        }
        Update: {
          actor_id?: string
          amount?: number | null
          balance_after?: number | null
          created_at?: string
          id?: string
          kind?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_banners: {
        Row: {
          active: boolean
          created_at: string
          id: string
          storage_path: string
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          storage_path: string
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          storage_path?: string
          title?: string
        }
        Relationships: []
      }
      financial_ledger: {
        Row: {
          actor_id: string
          amount: number
          balance_after: number
          created_at: string
          id: string
          kind: string
          request_id: string
          user_id: string
        }
        Insert: {
          actor_id: string
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          kind: string
          request_id: string
          user_id: string
        }
        Update: {
          actor_id?: string
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          kind?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_ledger_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "payment_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_bonus_awards: {
        Row: {
          amount: number
          created_at: string
          id: string
          period: string
          phone: string
          user_id: string
          username: string
          vip_level: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          period: string
          phone: string
          user_id: string
          username: string
          vip_level: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          period?: string
          phone?: string
          user_id?: string
          username?: string
          vip_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "mystery_bonus_awards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateways: {
        Row: {
          account_number: string
          account_type: string
          active: boolean
          id: string
          method: string
          updated_at: string
        }
        Insert: {
          account_number: string
          account_type?: string
          active?: boolean
          id?: string
          method: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          account_type?: string
          active?: boolean
          id?: string
          method?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          account_number: string
          amount: number
          created_at: string
          id: string
          kind: string
          method: string
          payout_reference: string | null
          proof_path: string | null
          reserved: boolean
          review_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          account_number?: string
          amount: number
          created_at?: string
          id?: string
          kind: string
          method: string
          payout_reference?: string | null
          proof_path?: string | null
          reserved?: boolean
          review_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          amount?: number
          created_at?: string
          id?: string
          kind?: string
          method?: string
          payout_reference?: string | null
          proof_path?: string | null
          reserved?: boolean
          review_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_signals: {
        Row: {
          created_at: string
          device_id: string
          id: string
          ip: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string
          id?: string
          ip?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          ip?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_signals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number
          created_at: string
          flag_reason: string | null
          flagged: boolean
          handle: string | null
          id: string
          phone: string
          referral_code: string | null
          referred_by: string | null
          status: string
          username: string
          vip: boolean
          vip_level: number
        }
        Insert: {
          balance?: number
          created_at?: string
          flag_reason?: string | null
          flagged?: boolean
          handle?: string | null
          id: string
          phone?: string
          referral_code?: string | null
          referred_by?: string | null
          status?: string
          username?: string
          vip?: boolean
          vip_level?: number
        }
        Update: {
          balance?: number
          created_at?: string
          flag_reason?: string | null
          flagged?: boolean
          handle?: string | null
          id?: string
          phone?: string
          referral_code?: string | null
          referred_by?: string | null
          status?: string
          username?: string
          vip?: boolean
          vip_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          active: boolean
          category: string
          created_at: string
          details: string
          headline: string
          highlights: string[]
          id: string
          sort_order: number
          subline: string
          theme: string
          title: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          details?: string
          headline?: string
          highlights?: string[]
          id?: string
          sort_order?: number
          subline?: string
          theme?: string
          title: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          details?: string
          headline?: string
          highlights?: string[]
          id?: string
          sort_order?: number
          subline?: string
          theme?: string
          title?: string
        }
        Relationships: []
      }
      referral_milestones: {
        Row: {
          bonus: number
          valid_count: number
        }
        Insert: {
          bonus: number
          valid_count: number
        }
        Update: {
          bonus?: number
          valid_count?: number
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          amount: number
          created_at: string
          id: string
          kind: string
          milestone: number | null
          referred_id: string | null
          referrer_id: string
          source_request_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          kind: string
          milestone?: number | null
          referred_id?: string | null
          referrer_id: string
          source_request_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          kind?: string
          milestone?: number | null
          referred_id?: string | null
          referrer_id?: string
          source_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          qualified_at: string | null
          reason: string | null
          referred_id: string
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          qualified_at?: string | null
          reason?: string | null
          referred_id: string
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          qualified_at?: string | null
          reason?: string | null
          referred_id?: string
          referrer_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_notices: {
        Row: {
          active: boolean
          id: string
          message: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          id: string
          message?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          id?: string
          message?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vip_bonus_awards: {
        Row: {
          amount: number
          created_at: string
          id: string
          kind: string
          level: number
          period: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          kind: string
          level: number
          period: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          kind?: string
          level?: number
          period?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vip_bonus_awards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_tiers: {
        Row: {
          level: number
          monthly_bonus: number
          monthly_mission: number
          required_turnover: number
          upgrade_bonus: number
          weekly_bonus: number
          weekly_mission: number
        }
        Insert: {
          level: number
          monthly_bonus: number
          monthly_mission?: number
          required_turnover: number
          upgrade_bonus: number
          weekly_bonus: number
          weekly_mission: number
        }
        Update: {
          level?: number
          monthly_bonus?: number
          monthly_mission?: number
          required_turnover?: number
          upgrade_bonus?: number
          weekly_bonus?: number
          weekly_mission?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_account_balance: {
        Args: {
          _amount: number
          _operation: string
          _reason: string
          _request_id: string
          _user_id: string
        }
        Returns: undefined
      }
      credit_referral: {
        Args: {
          _amount: number
          _kind: string
          _milestone: number
          _msg: string
          _referred: string
          _referrer: string
          _req: string
        }
        Returns: boolean
      }
      credit_vip_bonus: {
        Args: {
          _amount: number
          _kind: string
          _label: string
          _level: number
          _period: string
          _user_id: string
        }
        Returns: boolean
      }
      distribute_mystery_bonus: { Args: never; Returns: number }
      distribute_referral_commission: { Args: never; Returns: number }
      distribute_vip_period_bonus: { Args: { _kind: string }; Returns: number }
      distribute_vip_yearly_bonus: { Args: never; Returns: number }
      edit_account: {
        Args: {
          _phone: string
          _reason: string
          _status: string
          _user_id: string
          _username: string
          _vip: boolean
        }
        Returns: undefined
      }
      evaluate_referral: { Args: { _referred: string }; Returns: undefined }
      freeze_referral_fraud: { Args: { _user: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_authorized_admin_email: {
        Args: { _confirmed_at: string; _email: string }
        Returns: boolean
      }
      locked_bonus_amount: { Args: { _user_id: string }; Returns: number }
      player_identity_taken: {
        Args: { _handle: string; _phone: string }
        Returns: boolean
      }
      player_login_email: { Args: { _identifier: string }; Returns: string }
      player_turnover: {
        Args: { _from: string; _to: string; _user_id: string }
        Returns: number
      }
      record_player_signal: {
        Args: { _device: string; _ip: string; _user_id: string }
        Returns: undefined
      }
      referral_fraud_reason: {
        Args: { _referred: string; _referrer: string }
        Returns: string
      }
      refresh_vip_level: { Args: { _user_id: string }; Returns: undefined }
      review_payment_request: {
        Args: {
          _decision: string
          _id: string
          _payout_reference?: string
          _reason: string
        }
        Returns: undefined
      }
      set_admin_role: {
        Args: { _enabled: boolean; _reason: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
