export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          trading_preferences: Json
          risk_tolerance: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          trading_preferences?: Json
          risk_tolerance?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          trading_preferences?: Json
          risk_tolerance?: string
          created_at?: string
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          name: string
          total_value: number
          total_pnl: number
          total_pnl_percent: number
          available_cash: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          total_value?: number
          total_pnl?: number
          total_pnl_percent?: number
          available_cash?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          total_value?: number
          total_pnl?: number
          total_pnl_percent?: number
          available_cash?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          portfolio_id: string
          symbol: string
          quantity: number
          average_price: number
          current_price: number
          pnl: number
          pnl_percent: number
          market_value: number
          position_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          symbol: string
          quantity: number
          average_price: number
          current_price?: number
          pnl?: number
          pnl_percent?: number
          market_value?: number
          position_type?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          symbol?: string
          quantity?: number
          average_price?: number
          current_price?: number
          pnl?: number
          pnl_percent?: number
          market_value?: number
          position_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          portfolio_id: string
          symbol: string
          trade_type: string
          quantity: number
          price: number
          total_amount: number
          fees: number
          status: string
          strategy_id: string | null
          execution_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          symbol: string
          trade_type: string
          quantity: number
          price: number
          total_amount: number
          fees?: number
          status?: string
          strategy_id?: string | null
          execution_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          symbol?: string
          trade_type?: string
          quantity?: number
          price?: number
          total_amount?: number
          fees?: number
          status?: string
          strategy_id?: string | null
          execution_time?: string | null
          created_at?: string
        }
      }
      strategies: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          strategy_type: string
          status: string
          parameters: Json
          performance: Json
          backtest_results: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          strategy_type?: string
          status?: string
          parameters?: Json
          performance?: Json
          backtest_results?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          strategy_type?: string
          status?: string
          parameters?: Json
          performance?: Json
          backtest_results?: Json
          created_at?: string
          updated_at?: string
        }
      }
      market_data: {
        Row: {
          symbol: string
          price: number
          change_amount: number
          change_percent: number
          volume: number
          high_24h: number
          low_24h: number
          market_cap: number | null
          last_updated: string
        }
        Insert: {
          symbol: string
          price: number
          change_amount?: number
          change_percent?: number
          volume?: number
          high_24h?: number
          low_24h?: number
          market_cap?: number | null
          last_updated?: string
        }
        Update: {
          symbol?: string
          price?: number
          change_amount?: number
          change_percent?: number
          volume?: number
          high_24h?: number
          low_24h?: number
          market_cap?: number | null
          last_updated?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message_type: string
          content: string
          suggestions: Json
          context: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message_type: string
          content: string
          suggestions?: Json
          context?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message_type?: string
          content?: string
          suggestions?: Json
          context?: Json
          created_at?: string
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