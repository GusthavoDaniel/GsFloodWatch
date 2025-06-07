
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; 

const SUPABASE_URL = 'https://aljxvkfcsttlyxfcjebc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsanh2a2Zjc3R0bHl4ZmNqZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTQyOTksImV4cCI6MjA2NDY3MDI5OX0.ZLxI07guAmJrS3xHngQ50NlkTdLR1t6vIVBDU6KEcss'; // Public anon key


export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage, 
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, 
  },
});

