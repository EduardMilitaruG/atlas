export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          id: string
          message: string
          triggered_at: string
          type: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          message: string
          triggered_at?: string
          type: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          message?: string
          triggered_at?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          applied_at: string
          company: string
          created_at: string
          id: string
          last_update: string | null
          link: string | null
          notes: string | null
          role: string
          status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'ghosted'
          user_id: string
        }
        Insert: {
          applied_at: string
          company: string
          created_at?: string
          id?: string
          last_update?: string | null
          link?: string | null
          notes?: string | null
          role: string
          status?: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'ghosted'
          user_id: string
        }
        Update: {
          applied_at?: string
          company?: string
          created_at?: string
          id?: string
          last_update?: string | null
          link?: string | null
          notes?: string | null
          role?: string
          status?: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'ghosted'
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          awarded_at: string
          created_at: string
          id: string
          type: string
          user_id: string
          week_start: string | null
        }
        Insert: {
          awarded_at?: string
          created_at?: string
          id?: string
          type: string
          user_id: string
          week_start?: string | null
        }
        Update: {
          awarded_at?: string
          created_at?: string
          id?: string
          type?: string
          user_id?: string
          week_start?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string | null
          category: 'technical' | 'philosophy' | 'self_help' | 'fiction' | null
          created_at: string
          current_page: number | null
          finished_at: string | null
          id: string
          rating: number | null
          started_at: string | null
          title: string
          total_pages: number | null
          user_id: string
        }
        Insert: {
          author?: string | null
          category?: 'technical' | 'philosophy' | 'self_help' | 'fiction' | null
          created_at?: string
          current_page?: number | null
          finished_at?: string | null
          id?: string
          rating?: number | null
          started_at?: string | null
          title: string
          total_pages?: number | null
          user_id: string
        }
        Update: {
          author?: string | null
          category?: 'technical' | 'philosophy' | 'self_help' | 'fiction' | null
          created_at?: string
          current_page?: number | null
          finished_at?: string | null
          id?: string
          rating?: number | null
          started_at?: string | null
          title?: string
          total_pages?: number | null
          user_id?: string
        }
        Relationships: []
      }
      chess_ratings: {
        Row: {
          created_at: string
          id: string
          rapid_elo: number
          rated_on: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rapid_elo: number
          rated_on: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rapid_elo?: number
          rated_on?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          cigarettes_count: number | null
          created_at: string
          hard_thing_done: boolean | null
          hard_thing_text: string | null
          id: string
          last_caffeine_time: string | null
          log_date: string
          mood: number | null
          notes: string | null
          protein_grams: number | null
          sleep_hours: number | null
          sleep_quality: number | null
          steps_count: number | null
          stress: number | null
          submitted_at: string | null
          user_id: string
          water_glasses: number | null
        }
        Insert: {
          cigarettes_count?: number | null
          created_at?: string
          hard_thing_done?: boolean | null
          hard_thing_text?: string | null
          id?: string
          last_caffeine_time?: string | null
          log_date: string
          mood?: number | null
          notes?: string | null
          protein_grams?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          steps_count?: number | null
          stress?: number | null
          submitted_at?: string | null
          user_id: string
          water_glasses?: number | null
        }
        Update: {
          cigarettes_count?: number | null
          created_at?: string
          hard_thing_done?: boolean | null
          hard_thing_text?: string | null
          id?: string
          last_caffeine_time?: string | null
          log_date?: string
          mood?: number | null
          notes?: string | null
          protein_grams?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          steps_count?: number | null
          stress?: number | null
          submitted_at?: string | null
          user_id?: string
          water_glasses?: number | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount_eur: number
          category: 'food' | 'transport' | 'gym' | 'personal' | 'other'
          created_at: string
          expense_date: string
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          amount_eur: number
          category: 'food' | 'transport' | 'gym' | 'personal' | 'other'
          created_at?: string
          expense_date: string
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          amount_eur?: number
          category?: 'food' | 'transport' | 'gym' | 'personal' | 'other'
          created_at?: string
          expense_date?: string
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      eye_observations: {
        Row: {
          created_at: string
          drift_noticed: boolean
          id: string
          notes: string | null
          observed_on: string
          triggers: 'fatigue' | 'alcohol' | 'screens' | 'none' | null
          user_id: string
        }
        Insert: {
          created_at?: string
          drift_noticed?: boolean
          id?: string
          notes?: string | null
          observed_on: string
          triggers?: 'fatigue' | 'alcohol' | 'screens' | 'none' | null
          user_id: string
        }
        Update: {
          created_at?: string
          drift_noticed?: boolean
          id?: string
          notes?: string | null
          observed_on?: string
          triggers?: 'fatigue' | 'alcohol' | 'screens' | 'none' | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          category: string | null
          created_at: string
          current_value: number | null
          deadline: string | null
          id: string
          metric: string | null
          status: 'active' | 'done' | 'abandoned'
          target_value: number | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          id?: string
          metric?: string | null
          status?: 'active' | 'done' | 'abandoned'
          target_value?: number | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          id?: string
          metric?: string | null
          status?: 'active' | 'done' | 'abandoned'
          target_value?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          habit_id: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          habit_id: string
          id?: string
          log_date: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          category: 'mind' | 'body' | 'work' | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          target_per_week: number
          user_id: string
        }
        Insert: {
          category?: 'mind' | 'body' | 'work' | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          target_per_week?: number
          user_id: string
        }
        Update: {
          category?: 'mind' | 'body' | 'work' | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          target_per_week?: number
          user_id?: string
        }
        Relationships: []
      }
      income: {
        Row: {
          amount_eur: number
          created_at: string
          id: string
          income_date: string
          source: string
          user_id: string
        }
        Insert: {
          amount_eur: number
          created_at?: string
          id?: string
          income_date: string
          source: string
          user_id: string
        }
        Update: {
          amount_eur?: number
          created_at?: string
          id?: string
          income_date?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string
          didnt_go_well: string | null
          entry_date: string
          free_form: string | null
          grateful_for: string | null
          id: string
          user_id: string
          went_well: string | null
        }
        Insert: {
          created_at?: string
          didnt_go_well?: string | null
          entry_date: string
          free_form?: string | null
          grateful_for?: string | null
          id?: string
          user_id: string
          went_well?: string | null
        }
        Update: {
          created_at?: string
          didnt_go_well?: string | null
          entry_date?: string
          free_form?: string | null
          grateful_for?: string | null
          id?: string
          user_id?: string
          went_well?: string | null
        }
        Relationships: []
      }
      looksmax_log: {
        Row: {
          created_at: string
          flossed: boolean
          id: string
          log_date: string
          posture_exercises: boolean
          skincare_am: boolean
          skincare_pm: boolean
          user_id: string
          whitening: boolean
        }
        Insert: {
          created_at?: string
          flossed?: boolean
          id?: string
          log_date: string
          posture_exercises?: boolean
          skincare_am?: boolean
          skincare_pm?: boolean
          user_id: string
          whitening?: boolean
        }
        Update: {
          created_at?: string
          flossed?: boolean
          id?: string
          log_date?: string
          posture_exercises?: boolean
          skincare_am?: boolean
          skincare_pm?: boolean
          user_id?: string
          whitening?: boolean
        }
        Relationships: []
      }
      monthly_reviews: {
        Row: {
          created_at: string
          id: string
          month_start: string
          one_to_add: string | null
          one_to_drop: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          month_start: string
          one_to_add?: string | null
          one_to_drop?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          month_start?: string
          one_to_add?: string | null
          one_to_drop?: string | null
          user_id?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          back_url: string | null
          bodyweight_kg: number | null
          created_at: string
          front_url: string | null
          id: string
          notes: string | null
          side_url: string | null
          taken_at: string
          user_id: string
        }
        Insert: {
          back_url?: string | null
          bodyweight_kg?: number | null
          created_at?: string
          front_url?: string | null
          id?: string
          notes?: string | null
          side_url?: string | null
          taken_at: string
          user_id: string
        }
        Update: {
          back_url?: string | null
          bodyweight_kg?: number | null
          created_at?: string
          front_url?: string | null
          id?: string
          notes?: string | null
          side_url?: string | null
          taken_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          book_id: string
          created_at: string
          id: string
          minutes: number
          pages_read: number | null
          session_date: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          minutes: number
          pages_read?: number | null
          session_date: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          minutes?: number
          pages_read?: number | null
          session_date?: string
          user_id?: string
        }
        Relationships: []
      }
      social_log: {
        Row: {
          created_at: string
          id: string
          in_person_interactions: number
          log_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          in_person_interactions?: number
          log_date: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          in_person_interactions?: number
          log_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      supplements_log: {
        Row: {
          created_at: string
          creatine: boolean
          finasteride: boolean
          id: string
          log_date: string
          magnesium: boolean
          minox_am: boolean
          minox_pm: boolean
          omega3: boolean
          user_id: string
          vitamin_d: boolean
        }
        Insert: {
          created_at?: string
          creatine?: boolean
          finasteride?: boolean
          id?: string
          log_date: string
          magnesium?: boolean
          minox_am?: boolean
          minox_pm?: boolean
          omega3?: boolean
          user_id: string
          vitamin_d?: boolean
        }
        Update: {
          created_at?: string
          creatine?: boolean
          finasteride?: boolean
          id?: string
          log_date?: string
          magnesium?: boolean
          minox_am?: boolean
          minox_pm?: boolean
          omega3?: boolean
          user_id?: string
          vitamin_d?: boolean
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          created_at: string
          id: string
          one_change: string | null
          trend_text: string | null
          user_id: string
          week_start: string
          what_broke: string | null
          what_worked: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          one_change?: string | null
          trend_text?: string | null
          user_id: string
          week_start: string
          what_broke?: string | null
          what_worked?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          one_change?: string | null
          trend_text?: string | null
          user_id?: string
          week_start?: string
          what_broke?: string | null
          what_worked?: string | null
        }
        Relationships: []
      }
      weight_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
      workout_sets: {
        Row: {
          created_at: string
          exercise: string
          id: string
          reps: number | null
          rpe: number | null
          set_number: number
          user_id: string
          weight_kg: number | null
          workout_id: string
        }
        Insert: {
          created_at?: string
          exercise: string
          id?: string
          reps?: number | null
          rpe?: number | null
          set_number: number
          user_id: string
          weight_kg?: number | null
          workout_id: string
        }
        Update: {
          created_at?: string
          exercise?: string
          id?: string
          reps?: number | null
          rpe?: number | null
          set_number?: number
          user_id?: string
          weight_kg?: number | null
          workout_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          duration_min: number | null
          id: string
          notes: string | null
          type: 'push' | 'pull' | 'legs' | 'cardio' | 'rest'
          user_id: string
          workout_date: string
        }
        Insert: {
          created_at?: string
          duration_min?: number | null
          id?: string
          notes?: string | null
          type: 'push' | 'pull' | 'legs' | 'cardio' | 'rest'
          user_id: string
          workout_date: string
        }
        Update: {
          created_at?: string
          duration_min?: number | null
          id?: string
          notes?: string | null
          type?: 'push' | 'pull' | 'legs' | 'cardio' | 'rest'
          user_id?: string
          workout_date?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
