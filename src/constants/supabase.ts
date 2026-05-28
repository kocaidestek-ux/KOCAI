import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://borviddcrpbsqgivwlzt.supabase.co'
const supabaseAnonKey = 'sb_publishable_GtvLnLzeaiohSbqiCBPpig_5cD3USz6'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})