// Supabase Credentials
const SUPABASE_URL ='https://hpmabasscvxobqjiaxya.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB';
// Supabase Client জেনারেট করা
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
