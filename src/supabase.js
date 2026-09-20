import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
export const supabasePublic = supabase
export const supabaseAdmin = supabase
