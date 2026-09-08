const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // ou a Service Role Key se preferir permissões totais

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;