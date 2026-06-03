import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://borviddcrpbsqgivwlzt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvcnZpZGRjcnBic3FnaXZ3bHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDU5ODQsImV4cCI6MjA5NTQyMTk4NH0.04ttlYVbKn9u8JCe1hwohMwcrdplLzI_b6CMa1eMO5E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})