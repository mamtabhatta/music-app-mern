import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cxvnirmnsnukynajxfzn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4dm5pcm1uc251a3luYWp4ZnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MTc0OTQsImV4cCI6MjA3NDM5MzQ5NH0.jnuRUOJ4_IWQxarCyx9OtDjWj6N2i1P4IxHiGcNEeKE";
export const supabase = createClient(supabaseUrl, supabaseKey);
