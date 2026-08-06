// config.js

const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";

// আপনার Supabase Dashboard > Settings > API থেকে কপি করা আসল `anon` `public` key (eyJ... দিয়ে শুরু)
const SUPABASE_ANON_KEY = "'sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB';
// Supabase Initializer (সব পেজের জন্য স্ট্যান্ডার্ড নাম)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const _supabase = supabaseClient; // ব্যাকওয়ার্ড সাপোর্ট এর জন্য
