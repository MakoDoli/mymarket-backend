"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://ulyslilezssptwyntsdw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVseXNsaWxlenNzcHR3eW50c2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMzQ4NzIsImV4cCI6MjAzMjkxMDg3Mn0.GAs9PoaAIG9oSQZzZFSlPp7H30WZ2LHDslj0cZRI7UM';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.default = supabase;
