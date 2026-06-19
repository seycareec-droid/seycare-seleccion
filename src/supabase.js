import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON
const SUPABASE_SERVICE = process.env.REACT_APP_SUPABASE_SERVICE

// Cliente público — solo puede INSERT (candidatas llenan el form)
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON)

// Cliente admin — puede leer y modificar todo (panel operador)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE)
