import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ciofnfshfibetkhmbtem.supabase.co';
const SUPABASE_KEY = 'sb_publishable_SM4875Qb6rcmOoKeKvUQhw_wfRBCnPq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);