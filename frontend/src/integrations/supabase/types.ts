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
      activities: {
        Row: {
          action: string
          category: string
          created_at: string
          details: string | null
          id: number
          level: Database["public"]["Enums"]["activity_level"]
          target: string
          user_name: string
        }
        Insert: {
          action: string
          category: string
          created_at?: string
          details?: string | null
          id?: number
          level: Database["public"]["Enums"]["activity_level"]
          target: string
          user_name: string
        }
        Update: {
          action?: string
          category?: string
          created_at?: string
          details?: string | null
          id?: number
          level?: Database["public"]["Enums"]["activity_level"]
          target?: string
          user_name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          products_count: number | null
          slug: string
          sort_order: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          products_count?: number | null
          slug: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          products_count?: number | null
          slug?: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          category: string | null
          created_at: string
          end_date: string
          id: string
          max_discount: number | null
          min_order: number | null
          name: string
          start_date: string
          status: string
          type: string
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          end_date: string
          id: string
          max_discount?: number | null
          min_order?: number | null
          name: string
          start_date?: string
          status?: string
          type: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          end_date?: string
          id?: string
          max_discount?: number | null
          min_order?: number | null
          name?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          clicks: number | null
          created_at: string
          id: string
          name: string
          opens: number | null
          status: Database["public"]["Enums"]["email_template_status"]
          subject: string
          type: Database["public"]["Enums"]["email_template_type"]
          updated_at: string
        }
        Insert: {
          body: string
          clicks?: number | null
          created_at?: string
          id?: string
          name: string
          opens?: number | null
          status?: Database["public"]["Enums"]["email_template_status"]
          subject: string
          type: Database["public"]["Enums"]["email_template_type"]
          updated_at?: string
        }
        Update: {
          body?: string
          clicks?: number | null
          created_at?: string
          id?: string
          name?: string
          opens?: number | null
          status?: Database["public"]["Enums"]["email_template_status"]
          subject?: string
          type?: Database["public"]["Enums"]["email_template_type"]
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          cost_per_unit: number | null
          created_at: string
          created_by: string | null
          id: string
          movement_type: string
          product_id: string
          quantity: number
          reason: string
          reference_id: string | null
          total_cost: number | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: string
          product_id: string
          quantity: number
          reason: string
          reference_id?: string | null
          total_cost?: number | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: string
          product_id?: string
          quantity?: number
          reason?: string
          reference_id?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_products: {
        Row: {
          category: string | null
          cost: number
          created_at: string
          current_stock: number
          id: string
          max_stock: number
          min_stock: number
          name: string
          sell_price: number
          sku: string
          status: string
          supplier: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cost?: number
          created_at?: string
          current_stock?: number
          id?: string
          max_stock?: number
          min_stock?: number
          name: string
          sell_price?: number
          sku: string
          status?: string
          supplier?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cost?: number
          created_at?: string
          current_stock?: number
          id?: string
          max_stock?: number
          min_stock?: number
          name?: string
          sell_price?: number
          sku?: string
          status?: string
          supplier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string | null
          created_at: string
          customer_email: string
          customer_name: string
          id: string
          items: number
          order_date: string
          payment_method: string | null
          phone: string | null
          status: Database["public"]["Enums"]["order_status"]
          total: number
          tracking_number: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          id: string
          items: number
          order_date: string
          payment_method?: string | null
          phone?: string | null
          status: Database["public"]["Enums"]["order_status"]
          total: number
          tracking_number?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          id?: string
          items?: number
          order_date?: string
          payment_method?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          tracking_number?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          date_added: string | null
          description: string | null
          id: number
          image: string | null
          name: string
          original_price: number | null
          price: number
          rating: number | null
          reviews: number | null
          sales: number | null
          sku: string | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          stock: number
          tags: string[] | null
          variants: Json | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          date_added?: string | null
          description?: string | null
          id?: never
          image?: string | null
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          reviews?: number | null
          sales?: number | null
          sku?: string | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          tags?: string[] | null
          variants?: Json | null
        }
        Update: {
          category?: string | null
          created_at?: string
          date_added?: string | null
          description?: string | null
          id?: never
          image?: string | null
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          reviews?: number | null
          sales?: number | null
          sku?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          tags?: string[] | null
          variants?: Json | null
        }
        Relationships: []
      }
      return_items: {
        Row: {
          id: number
          product_id: string
          product_name: string
          quantity: number
          quantity_to_return: number
          reason: string
          return_id: string
          return_type: Database["public"]["Enums"]["return_type"]
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: number
          product_id: string
          product_name: string
          quantity: number
          quantity_to_return: number
          reason: string
          return_id: string
          return_type: Database["public"]["Enums"]["return_type"]
          total_price: number
          unit_price: number
        }
        Update: {
          id?: number
          product_id?: string
          product_name?: string
          quantity?: number
          quantity_to_return?: number
          reason?: string
          return_id?: string
          return_type?: Database["public"]["Enums"]["return_type"]
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          customer: string
          id: string
          order_id: string
          request_date: string
          status: Database["public"]["Enums"]["return_status"]
          total_refund_amount: number
        }
        Insert: {
          created_at?: string
          customer: string
          id: string
          order_id: string
          request_date: string
          status: Database["public"]["Enums"]["return_status"]
          total_refund_amount: number
        }
        Update: {
          created_at?: string
          customer?: string
          id?: string
          order_id?: string
          request_date?: string
          status?: Database["public"]["Enums"]["return_status"]
          total_refund_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_email: string
          customer_name: string
          helpful_count: number | null
          id: string
          is_verified: boolean | null
          product_name: string
          rating: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          product_name: string
          rating: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          helpful_count?: number | null
          id?: string
          is_verified?: boolean | null
          product_name?: string
          rating?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          cost: number
          created_at: string
          customer: string
          destination: string | null
          estimated_delivery: string | null
          id: string
          order_id: string
          origin: string | null
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string | null
        }
        Insert: {
          carrier?: string | null
          cost?: number
          created_at?: string
          customer: string
          destination?: string | null
          estimated_delivery?: string | null
          id: string
          order_id: string
          origin?: string | null
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string | null
        }
        Update: {
          carrier?: string | null
          cost?: number
          created_at?: string
          customer?: string
          destination?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          origin?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          category: string
          contact_person: string
          country: string | null
          created_at: string
          email: string
          id: string
          name: string
          payment_terms: string | null
          phone: string | null
          products_supplied: number | null
          rating: number | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          category: string
          contact_person: string
          country?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          payment_terms?: string | null
          phone?: string | null
          products_supplied?: number | null
          rating?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string
          contact_person?: string
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          payment_terms?: string | null
          phone?: string | null
          products_supplied?: number | null
          rating?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          customer_email: string
          customer_name: string
          description: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          customer_email: string
          customer_name: string
          description?: string | null
          id?: string
          priority: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          last_login: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_level: "INFO" | "WARN" | "ERROR"
      email_template_status: "Activo" | "Borrador" | "Archivado"
      email_template_type: "Marketing" | "Transaccional"
      order_status:
        | "Completado"
        | "Pendiente"
        | "Enviado"
        | "Procesando"
        | "Cancelado"
      product_status: "Activo" | "Inactivo" | "Agotado"
      return_status: "Aprobado" | "Pendiente" | "Rechazado" | "Procesando"
      return_type: "Reembolso" | "Intercambio"
      shipment_status: "Preparando" | "En tránsito" | "Entregado" | "Problema"
      user_role: "Admin" | "Editor" | "Viewer"
      user_status: "Activo" | "Inactivo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_level: ["INFO", "WARN", "ERROR"],
      email_template_status: ["Activo", "Borrador", "Archivado"],
      email_template_type: ["Marketing", "Transaccional"],
      order_status: [
        "Completado",
        "Pendiente",
        "Enviado",
        "Procesando",
        "Cancelado",
      ],
      product_status: ["Activo", "Inactivo", "Agotado"],
      return_status: ["Aprobado", "Pendiente", "Rechazado", "Procesando"],
      return_type: ["Reembolso", "Intercambio"],
      shipment_status: ["Preparando", "En tránsito", "Entregado", "Problema"],
      user_role: ["Admin", "Editor", "Viewer"],
      user_status: ["Activo", "Inactivo"],
    },
  },
} as const
