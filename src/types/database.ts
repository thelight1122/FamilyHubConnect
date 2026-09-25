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
      accountability_sessions: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          common_ground: string
          door: string
          family_id: string
          id: string
          opened_at: string
          opened_by: string | null
          status: string
          topic: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          common_ground?: string
          door: string
          family_id: string
          id?: string
          opened_at?: string
          opened_by?: string | null
          status?: string
          topic: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          common_ground?: string
          door?: string
          family_id?: string
          id?: string
          opened_at?: string
          opened_by?: string | null
          status?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "accountability_sessions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          actor: string | null
          created_at: string
          family_id: string | null
          id: number
          operation: string
          row_id: string | null
          table_name: string
        }
        Insert: {
          actor?: string | null
          created_at?: string
          family_id?: string | null
          id?: never
          operation: string
          row_id?: string | null
          table_name: string
        }
        Update: {
          actor?: string | null
          created_at?: string
          family_id?: string | null
          id?: never
          operation?: string
          row_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      chores: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          family_id: string
          id: string
          points: number
          title: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          family_id: string
          id?: string
          points?: number
          title: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          family_id?: string
          id?: string
          points?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "chores_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      constitution_amendments: {
        Row: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          family_id: string
          id: string
          proposal: string
          proposed_by: string
          rationale: string
          status: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          family_id: string
          id?: string
          proposal: string
          proposed_by: string
          rationale?: string
          status?: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          family_id?: string
          id?: string
          proposal?: string
          proposed_by?: string
          rationale?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "constitution_amendments_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      constitution_rules: {
        Row: {
          body: string
          created_at: string
          family_id: string
          id: string
          position: number
        }
        Insert: {
          body: string
          created_at?: string
          family_id: string
          id?: string
          position?: number
        }
        Update: {
          body?: string
          created_at?: string
          family_id?: string
          id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "constitution_rules_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      constitution_signatures: {
        Row: {
          family_id: string
          signed_at: string
          user_id: string
        }
        Insert: {
          family_id: string
          signed_at?: string
          user_id: string
        }
        Update: {
          family_id?: string
          signed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "constitution_signatures_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      constitution_values: {
        Row: {
          created_at: string
          description: string
          family_id: string
          id: string
          position: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          family_id: string
          id?: string
          position?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          family_id?: string
          id?: string
          position?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "constitution_values_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_posts: {
        Row: {
          author_id: string
          caption: string
          created_at: string
          duration_seconds: number | null
          family_id: string
          id: string
          kind: string
          media_path: string | null
        }
        Insert: {
          author_id?: string
          caption?: string
          created_at?: string
          duration_seconds?: number | null
          family_id: string
          id?: string
          kind: string
          media_path?: string | null
        }
        Update: {
          author_id?: string
          caption?: string
          created_at?: string
          duration_seconds?: number | null
          family_id?: string
          id?: string
          kind?: string
          media_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_posts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      family_constitution: {
        Row: {
          family_id: string
          mission: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          family_id: string
          mission?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          family_id?: string
          mission?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_constitution_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: true
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          code: string
          created_at: string
          created_by: string | null
          display_name: string
          email: string | null
          expires_at: string
          family_id: string
          id: string
          revoked_at: string | null
          role: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          display_name: string
          email?: string | null
          expires_at?: string
          family_id: string
          id?: string
          revoked_at?: string | null
          role: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          display_name?: string
          email?: string | null
          expires_at?: string
          family_id?: string
          id?: string
          revoked_at?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_invites_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          created_at: string
          display_name: string
          family_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          family_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          family_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      health_logs: {
        Row: {
          created_by: string | null
          family_id: string
          id: string
          kind: string
          logged_at: string
          member_id: string
          note: string
        }
        Insert: {
          created_by?: string | null
          family_id: string
          id?: string
          kind: string
          logged_at?: string
          member_id: string
          note?: string
        }
        Update: {
          created_by?: string | null
          family_id?: string
          id?: string
          kind?: string
          logged_at?: string
          member_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      invite_attempts: {
        Row: {
          created_at: string
          id: number
          succeeded: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          succeeded: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          id?: never
          succeeded?: boolean
          user_id?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount_cents: number
          created_at: string
          created_by: string | null
          family_id: string
          id: string
          kind: string
          loan_id: string | null
          member_id: string
          note: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          created_by?: string | null
          family_id: string
          id?: string
          kind: string
          loan_id?: string | null
          member_id: string
          note?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          created_by?: string | null
          family_id?: string
          id?: string
          kind?: string
          loan_id?: string | null
          member_id?: string
          note?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loan_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_requests: {
        Row: {
          amount_cents: number
          borrower_id: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          family_id: string
          id: string
          purpose: string
          status: string
        }
        Insert: {
          amount_cents: number
          borrower_id: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          family_id: string
          id?: string
          purpose: string
          status?: string
        }
        Update: {
          amount_cents?: number
          borrower_id?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          family_id?: string
          id?: string
          purpose?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_requests_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_items: {
        Row: {
          created_at: string
          detail: string
          due_on: string | null
          family_id: string
          handled_at: string | null
          id: string
          monthly_cost_cents: number | null
          section: string
          title: string
        }
        Insert: {
          created_at?: string
          detail?: string
          due_on?: string | null
          family_id: string
          handled_at?: string | null
          id?: string
          monthly_cost_cents?: number | null
          section: string
          title: string
        }
        Update: {
          created_at?: string
          detail?: string
          due_on?: string | null
          family_id?: string
          handled_at?: string | null
          id?: string
          monthly_cost_cents?: number | null
          section?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_items_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          active: boolean
          created_at: string
          dose: string
          family_id: string
          id: string
          member_id: string
          name: string
          schedule: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dose?: string
          family_id: string
          id?: string
          member_id: string
          name: string
          schedule?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dose?: string
          family_id?: string
          id?: string
          member_id?: string
          name?: string
          schedule?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_feedings: {
        Row: {
          family_id: string
          id: string
          label: string
          pet_id: string
          time_of_day: string
        }
        Insert: {
          family_id: string
          id?: string
          label: string
          pet_id: string
          time_of_day: string
        }
        Update: {
          family_id?: string
          id?: string
          label?: string
          pet_id?: string
          time_of_day?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_feedings_pet_id_family_id_fkey"
            columns: ["pet_id", "family_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      pet_walks: {
        Row: {
          distance_km: number | null
          family_id: string
          id: string
          minutes: number
          pet_id: string
          walked_at: string
          walked_by: string
        }
        Insert: {
          distance_km?: number | null
          family_id: string
          id?: string
          minutes: number
          pet_id: string
          walked_at?: string
          walked_by?: string
        }
        Update: {
          distance_km?: number | null
          family_id?: string
          id?: string
          minutes?: number
          pet_id?: string
          walked_at?: string
          walked_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_walks_pet_id_family_id_fkey"
            columns: ["pet_id", "family_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      pets: {
        Row: {
          birth_date: string | null
          created_at: string
          family_id: string
          id: string
          name: string
          species: string
          weight_kg: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          family_id: string
          id?: string
          name: string
          species?: string
          weight_kg?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          family_id?: string
          id?: string
          name?: string
          species?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          family_id: string
          id: string
          label: string
          position: number
          post_id: string
        }
        Insert: {
          family_id: string
          id?: string
          label: string
          position?: number
          post_id: string
        }
        Update: {
          family_id?: string
          id?: string
          label?: string
          position?: number
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_post_id_family_id_fkey"
            columns: ["post_id", "family_id"]
            isOneToOne: false
            referencedRelation: "creator_posts"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          family_id: string
          option_id: string
          post_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          family_id: string
          option_id: string
          post_id: string
          voter_id?: string
        }
        Update: {
          created_at?: string
          family_id?: string
          option_id?: string
          post_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_post_id_fkey"
            columns: ["option_id", "post_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id", "post_id"]
          },
          {
            foreignKeyName: "poll_votes_post_id_family_id_fkey"
            columns: ["post_id", "family_id"]
            isOneToOne: false
            referencedRelation: "creator_posts"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          family_id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          family_id: string
          post_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          family_id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_family_id_fkey"
            columns: ["post_id", "family_id"]
            isOneToOne: false
            referencedRelation: "creator_posts"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string
          family_id: string
          id: string
          points: number
          title: string
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          points: number
          title: string
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          points?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_goals: {
        Row: {
          created_at: string
          family_id: string
          id: string
          member_id: string
          target_cents: number
          title: string
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          member_id: string
          target_cents: number
          title: string
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          member_id?: string
          target_cents?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_goals_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      session_accounts: {
        Row: {
          body: string
          created_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_accounts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "accountability_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          session_id: string
          user_id: string
        }
        Insert: {
          session_id: string
          user_id: string
        }
        Update: {
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "accountability_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_records: {
        Row: {
          acknowledged_at: string | null
          available_after: string
          created_at: string
          engine: string
          id: string
          observations: Json
          reflection: string
          session_id: string
          subject_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          available_after?: string
          created_at?: string
          engine: string
          id?: string
          observations: Json
          reflection?: string
          session_id: string
          subject_id: string
        }
        Update: {
          acknowledged_at?: string | null
          available_after?: string
          created_at?: string
          engine?: string
          id?: string
          observations?: Json
          reflection?: string
          session_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "accountability_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      team_checklist: {
        Row: {
          critical: boolean
          family_id: string
          id: string
          label: string
          packed: boolean
          team_id: string
        }
        Insert: {
          critical?: boolean
          family_id: string
          id?: string
          label: string
          packed?: boolean
          team_id: string
        }
        Update: {
          critical?: boolean
          family_id?: string
          id?: string
          label?: string
          packed?: boolean
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_checklist_team_id_family_id_fkey"
            columns: ["team_id", "family_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      team_contacts: {
        Row: {
          email: string
          family_id: string
          id: string
          name: string
          phone: string
          role: string
          team_id: string
        }
        Insert: {
          email?: string
          family_id: string
          id?: string
          name: string
          phone?: string
          role?: string
          team_id: string
        }
        Update: {
          email?: string
          family_id?: string
          id?: string
          name?: string
          phone?: string
          role?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_contacts_team_id_family_id_fkey"
            columns: ["team_id", "family_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      team_events: {
        Row: {
          family_id: string
          id: string
          kind: string
          location: string
          starts_at: string
          team_id: string
          title: string
        }
        Insert: {
          family_id: string
          id?: string
          kind?: string
          location?: string
          starts_at: string
          team_id: string
          title: string
        }
        Update: {
          family_id?: string
          id?: string
          kind?: string
          location?: string
          starts_at?: string
          team_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_events_team_id_family_id_fkey"
            columns: ["team_id", "family_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      team_messages: {
        Row: {
          attachment_path: string | null
          author_id: string
          body: string
          created_at: string
          family_id: string
          id: string
          team_id: string
        }
        Insert: {
          attachment_path?: string | null
          author_id?: string
          body?: string
          created_at?: string
          family_id: string
          id?: string
          team_id: string
        }
        Update: {
          attachment_path?: string | null
          author_id?: string
          body?: string
          created_at?: string
          family_id?: string
          id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_team_id_family_id_fkey"
            columns: ["team_id", "family_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          family_id: string
          id: string
          league: string
          name: string
          record: string
        }
        Insert: {
          created_at?: string
          family_id: string
          id?: string
          league?: string
          name: string
          record?: string
        }
        Update: {
          created_at?: string
          family_id?: string
          id?: string
          league?: string
          name?: string
          record?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_entries: {
        Row: {
          author_id: string
          body: string
          created_at: string
          family_id: string
          id: string
          kind: string
          occurred_on: string
          photo_path: string | null
          title: string
          visibility: string
        }
        Insert: {
          author_id?: string
          body?: string
          created_at?: string
          family_id: string
          id?: string
          kind: string
          occurred_on?: string
          photo_path?: string | null
          title?: string
          visibility?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          family_id?: string
          id?: string
          kind?: string
          occurred_on?: string
          photo_path?: string | null
          title?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_entries_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_appointments: {
        Row: {
          family_id: string
          id: string
          pet_id: string
          reason: string
          scheduled_at: string
        }
        Insert: {
          family_id: string
          id?: string
          pet_id: string
          reason: string
          scheduled_at: string
        }
        Update: {
          family_id?: string
          id?: string
          pet_id?: string
          reason?: string
          scheduled_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_appointments_pet_id_family_id_fkey"
            columns: ["pet_id", "family_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id", "family_id"]
          },
        ]
      }
    }
    Views: {
      member_balances: {
        Row: {
          balance_cents: number | null
          family_id: string | null
          member_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_family_invite: { Args: { invite_code: string }; Returns: Json }
      acknowledge_session_record: {
        Args: { personal_reflection: string; target_record_id: string }
        Returns: {
          acknowledged_at: string | null
          available_after: string
          created_at: string
          engine: string
          id: string
          observations: Json
          reflection: string
          session_id: string
          subject_id: string
        }
        SetofOptions: {
          from: "*"
          to: "session_records"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      close_accountability_session: {
        Args: { agreed_common_ground: string; target_session_id: string }
        Returns: {
          closed_at: string | null
          closed_by: string | null
          common_ground: string
          door: string
          family_id: string
          id: string
          opened_at: string
          opened_by: string | null
          status: string
          topic: string
        }
        SetofOptions: {
          from: "*"
          to: "accountability_sessions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_family_invite: {
        Args: {
          invite_email?: string
          invite_name: string
          invite_role: string
          target_family_id: string
        }
        Returns: {
          accepted_at: string | null
          accepted_by: string | null
          code: string
          created_at: string
          created_by: string | null
          display_name: string
          email: string | null
          expires_at: string
          family_id: string
          id: string
          revoked_at: string | null
          role: string
        }
        SetofOptions: {
          from: "*"
          to: "family_invites"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decide_amendment: {
        Args: { adopt: boolean; target_amendment_id: string }
        Returns: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          family_id: string
          id: string
          proposal: string
          proposed_by: string
          rationale: string
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "constitution_amendments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decide_loan: {
        Args: { approve: boolean; target_loan_id: string }
        Returns: {
          amount_cents: number
          borrower_id: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          family_id: string
          id: string
          purpose: string
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "loan_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      open_accountability_session: {
        Args: {
          participant_ids: string[]
          session_door: string
          session_topic: string
          target_family_id: string
        }
        Returns: {
          closed_at: string | null
          closed_by: string | null
          common_ground: string
          door: string
          family_id: string
          id: string
          opened_at: string
          opened_by: string | null
          status: string
          topic: string
        }
        SetofOptions: {
          from: "*"
          to: "accountability_sessions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_chore_completed: {
        Args: { completed: boolean; target_chore_id: string }
        Returns: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          family_id: string
          id: string
          points: number
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "chores"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      withdraw_amendment: {
        Args: { target_amendment_id: string }
        Returns: {
          created_at: string
          decided_at: string | null
          decided_by: string | null
          family_id: string
          id: string
          proposal: string
          proposed_by: string
          rationale: string
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "constitution_amendments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      withdraw_loan: {
        Args: { target_loan_id: string }
        Returns: {
          amount_cents: number
          borrower_id: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          family_id: string
          id: string
          purpose: string
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "loan_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

