import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://deiqxxvhdewshlqqkhgg.supabase.co';
const supabaseKey = 'sb_publishable_FNPeiSe5IDvtkHrSvSlmgQ_vy0nIMkq';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (input, init) => fetch(input, init),
  },
});
