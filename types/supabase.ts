export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      gifts: {
        Row: {
          created_at: string | null
          description: string | null
          gifted: boolean
          id: number
          inquiry_id: number | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gifted?: boolean
          id?: number
          inquiry_id?: number | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gifted?: boolean
          id?: number
          inquiry_id?: number | null
          profile_id?: string | null
        }
      }
      inquiries: {
        Row: {
          created_at: string | null
          g_occasion: string | null
          g_price_high: number | null
          g_price_low: number | null
          id: number
          profile_id: string | null
          r_age: string | null
          r_hobbies: string | null
          r_interests: string | null
          r_occupation: string | null
          r_relationship: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          g_occasion?: string | null
          g_price_high?: number | null
          g_price_low?: number | null
          id?: number
          profile_id?: string | null
          r_age?: string | null
          r_hobbies?: string | null
          r_interests?: string | null
          r_occupation?: string | null
          r_relationship?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          g_occasion?: string | null
          g_price_high?: number | null
          g_price_low?: number | null
          id?: number
          profile_id?: string | null
          r_age?: string | null
          r_hobbies?: string | null
          r_interests?: string | null
          r_occupation?: string | null
          r_relationship?: string | null
          title?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
