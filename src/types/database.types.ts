export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          body: string
          couple_id: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          garment_id: string | null
          id: string
          outfit_id: string | null
          tip_id: string | null
        }
        Insert: {
          author_id: string
          body: string
          couple_id: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          garment_id?: string | null
          id?: string
          outfit_id?: string | null
          tip_id?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          couple_id?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          garment_id?: string | null
          id?: string
          outfit_id?: string | null
          tip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_tip_id_fkey"
            columns: ["tip_id"]
            isOneToOne: false
            referencedRelation: "tips"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_invites: {
        Row: {
          code: string
          couple_id: string
          created_by: string | null
          expires_at: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          couple_id: string
          created_by?: string | null
          expires_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          couple_id?: string
          created_by?: string | null
          expires_at?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "couple_invites_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_invites_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_invites_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_members: {
        Row: {
          couple_id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          couple_id: string
          joined_at?: string
          user_id: string
        }
        Update: {
          couple_id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_members_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "couple_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          anniversary: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string | null
        }
        Insert: {
          anniversary?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          anniversary?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "couples_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      garments: {
        Row: {
          brand: string | null
          care_instructions: string | null
          category: Database["public"]["Enums"]["garment_category"]
          colors: string[]
          couple_id: string
          created_at: string
          cutout_path: string | null
          deleted_at: string | null
          fabric: string | null
          id: string
          is_staple: boolean
          last_worn_on: string | null
          name: string
          notes: string | null
          occasions: Database["public"]["Enums"]["occasion"][]
          owner_id: string
          photo_path: string | null
          primary_color: string | null
          product_url: string | null
          purchase_date: string | null
          purchase_price: number | null
          receipt_path: string | null
          return_deadline: string | null
          seasons: Database["public"]["Enums"]["season"][]
          size: string | null
          status: Database["public"]["Enums"]["garment_status"]
          store: string | null
          subcategory: string | null
          thumb_path: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility"]
          wear_count: number
        }
        Insert: {
          brand?: string | null
          care_instructions?: string | null
          category: Database["public"]["Enums"]["garment_category"]
          colors?: string[]
          couple_id: string
          created_at?: string
          cutout_path?: string | null
          deleted_at?: string | null
          fabric?: string | null
          id?: string
          is_staple?: boolean
          last_worn_on?: string | null
          name: string
          notes?: string | null
          occasions?: Database["public"]["Enums"]["occasion"][]
          owner_id: string
          photo_path?: string | null
          primary_color?: string | null
          product_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          receipt_path?: string | null
          return_deadline?: string | null
          seasons?: Database["public"]["Enums"]["season"][]
          size?: string | null
          status?: Database["public"]["Enums"]["garment_status"]
          store?: string | null
          subcategory?: string | null
          thumb_path?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility"]
          wear_count?: number
        }
        Update: {
          brand?: string | null
          care_instructions?: string | null
          category?: Database["public"]["Enums"]["garment_category"]
          colors?: string[]
          couple_id?: string
          created_at?: string
          cutout_path?: string | null
          deleted_at?: string | null
          fabric?: string | null
          id?: string
          is_staple?: boolean
          last_worn_on?: string | null
          name?: string
          notes?: string | null
          occasions?: Database["public"]["Enums"]["occasion"][]
          owner_id?: string
          photo_path?: string | null
          primary_color?: string | null
          product_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          receipt_path?: string | null
          return_deadline?: string | null
          seasons?: Database["public"]["Enums"]["season"][]
          size?: string | null
          status?: Database["public"]["Enums"]["garment_status"]
          store?: string | null
          subcategory?: string | null
          thumb_path?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility"]
          wear_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "garments_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          couple_id: string | null
          created_at: string
          id: string
          payload: Json
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          couple_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          couple_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      outfit_items: {
        Row: {
          garment_id: string
          outfit_id: string
          position: number
        }
        Insert: {
          garment_id: string
          outfit_id: string
          position?: number
        }
        Update: {
          garment_id?: string
          outfit_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "outfit_items_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfit_items_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
        ]
      }
      outfits: {
        Row: {
          canvas: Json | null
          couple_id: string
          cover_path: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          id: string
          mood: string | null
          note: string | null
          occasion: Database["public"]["Enums"]["occasion"] | null
          plan_id: string | null
          status: Database["public"]["Enums"]["outfit_status"]
          title: string | null
          updated_at: string
          visibility: Database["public"]["Enums"]["visibility"]
          wearer_id: string
          worn_on: string | null
        }
        Insert: {
          canvas?: Json | null
          couple_id: string
          cover_path?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          id?: string
          mood?: string | null
          note?: string | null
          occasion?: Database["public"]["Enums"]["occasion"] | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["outfit_status"]
          title?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility"]
          wearer_id: string
          worn_on?: string | null
        }
        Update: {
          canvas?: Json | null
          couple_id?: string
          cover_path?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          id?: string
          mood?: string | null
          note?: string | null
          occasion?: Database["public"]["Enums"]["occasion"] | null
          plan_id?: string | null
          status?: Database["public"]["Enums"]["outfit_status"]
          title?: string | null
          updated_at?: string
          visibility?: Database["public"]["Enums"]["visibility"]
          wearer_id?: string
          worn_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outfits_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_wearer_id_fkey"
            columns: ["wearer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          couple_id: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          dress_code: string | null
          ends_at: string | null
          google_event_id: string | null
          id: string
          kind: Database["public"]["Enums"]["plan_kind"]
          lat: number | null
          lng: number | null
          notes: string | null
          place: string | null
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          dress_code?: string | null
          ends_at?: string | null
          google_event_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["plan_kind"]
          lat?: number | null
          lng?: number | null
          notes?: string | null
          place?: string | null
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          dress_code?: string | null
          ends_at?: string | null
          google_event_id?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["plan_kind"]
          lat?: number | null
          lng?: number | null
          notes?: string | null
          place?: string | null
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accent_color: string
          avatar_path: string | null
          created_at: string
          display_name: string
          id: string
          locale: string
          theme: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          avatar_path?: string | null
          created_at?: string
          display_name: string
          id: string
          locale?: string
          theme?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          avatar_path?: string | null
          created_at?: string
          display_name?: string
          id?: string
          locale?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          keys: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          keys: Json
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          keys?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string
          outfit_id: string
          rater_id: string
          score: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          outfit_id: string
          rater_id: string
          score: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          outfit_id?: string
          rater_id?: string
          score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          couple_id: string
          created_at: string
          emoji: string
          garment_id: string | null
          id: string
          outfit_id: string | null
          user_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          emoji: string
          garment_id?: string | null
          id?: string
          outfit_id?: string | null
          user_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          emoji?: string
          garment_id?: string | null
          id?: string
          outfit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tips: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["garment_category"] | null
          couple_id: string
          created_at: string
          currency: string
          deleted_at: string | null
          for_user_id: string
          hidden_until: string | null
          id: string
          image_path: string | null
          note: string | null
          price: number | null
          priority: number
          reserved_by: string | null
          status: Database["public"]["Enums"]["tip_status"]
          store: string | null
          target_price: number | null
          title: string
          updated_at: string
          url: string | null
          visibility: Database["public"]["Enums"]["visibility"]
        }
        Insert: {
          author_id: string
          category?: Database["public"]["Enums"]["garment_category"] | null
          couple_id: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          for_user_id: string
          hidden_until?: string | null
          id?: string
          image_path?: string | null
          note?: string | null
          price?: number | null
          priority?: number
          reserved_by?: string | null
          status?: Database["public"]["Enums"]["tip_status"]
          store?: string | null
          target_price?: number | null
          title: string
          updated_at?: string
          url?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["garment_category"] | null
          couple_id?: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          for_user_id?: string
          hidden_until?: string | null
          id?: string
          image_path?: string | null
          note?: string | null
          price?: number | null
          priority?: number
          reserved_by?: string | null
          status?: Database["public"]["Enums"]["tip_status"]
          store?: string | null
          target_price?: number | null
          title?: string
          updated_at?: string
          url?: string | null
          visibility?: Database["public"]["Enums"]["visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "tips_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_for_user_id_fkey"
            columns: ["for_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tips_reserved_by_fkey"
            columns: ["reserved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wear_log: {
        Row: {
          couple_id: string
          garment_id: string
          id: string
          outfit_id: string | null
          user_id: string | null
          worn_on: string
        }
        Insert: {
          couple_id: string
          garment_id: string
          id?: string
          outfit_id?: string | null
          user_id?: string | null
          worn_on?: string
        }
        Update: {
          couple_id?: string
          garment_id?: string
          id?: string
          outfit_id?: string | null
          user_id?: string | null
          worn_on?: string
        }
        Relationships: [
          {
            foreignKeyName: "wear_log_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wear_log_garment_id_fkey"
            columns: ["garment_id"]
            isOneToOne: false
            referencedRelation: "garments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wear_log_outfit_id_fkey"
            columns: ["outfit_id"]
            isOneToOne: false
            referencedRelation: "outfits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wear_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_couple: {
        Args: { p_anniversary?: string; p_name?: string }
        Returns: string
      }
      create_invite: { Args: never; Returns: string }
      current_couple_id: { Args: never; Returns: string }
      generate_invite_code: { Args: never; Returns: string }
      is_couple_member: {
        Args: { p_couple_id: string; p_user_id: string }
        Returns: boolean
      }
      is_partner_of: { Args: { p_couple_id: string }; Returns: boolean }
      join_couple: { Args: { p_code: string }; Returns: string }
    }
    Enums: {
      garment_category:
        | "top"
        | "bottom"
        | "dress"
        | "outerwear"
        | "shoes"
        | "bag"
        | "accessory"
        | "underwear"
        | "sport"
        | "other"
      garment_status:
        | "clean"
        | "laundry"
        | "lent"
        | "repair"
        | "stored"
        | "sold"
      occasion:
        | "casual"
        | "date"
        | "dinner"
        | "party"
        | "work"
        | "sport"
        | "travel"
        | "formal"
        | "other"
      outfit_status: "draft" | "proposed" | "accepted" | "rejected" | "worn"
      plan_kind: "date" | "dinner" | "trip" | "party" | "event" | "other"
      season: "spring" | "summer" | "autumn" | "winter" | "all"
      tip_status: "idea" | "reserved" | "bought" | "discarded"
      visibility: "private" | "couple" | "surprise"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      garment_category: [
        "top",
        "bottom",
        "dress",
        "outerwear",
        "shoes",
        "bag",
        "accessory",
        "underwear",
        "sport",
        "other",
      ],
      garment_status: ["clean", "laundry", "lent", "repair", "stored", "sold"],
      occasion: [
        "casual",
        "date",
        "dinner",
        "party",
        "work",
        "sport",
        "travel",
        "formal",
        "other",
      ],
      outfit_status: ["draft", "proposed", "accepted", "rejected", "worn"],
      plan_kind: ["date", "dinner", "trip", "party", "event", "other"],
      season: ["spring", "summer", "autumn", "winter", "all"],
      tip_status: ["idea", "reserved", "bought", "discarded"],
      visibility: ["private", "couple", "surprise"],
    },
  },
} as const

