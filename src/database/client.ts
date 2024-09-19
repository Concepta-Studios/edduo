import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

function getSupabaseClient() {
  if (supabaseUrl === undefined || supabaseKey === undefined) {
    throw new Error(
      "Can't read the url or the api key of the supabase database"
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);
  return supabase;
}

export const supabase = getSupabaseClient();
