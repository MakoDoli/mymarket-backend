import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulyslilezssptwyntsdw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVseXNsaWxlenNzcHR3eW50c2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzQ4NzIsImV4cCI6MjAzMjkxMDg3Mn0.GAs9PoaAIG9oSQZzZFSlPp7H30WZ2LHDslj0cZRI7UM';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
