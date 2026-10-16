import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://odwigytenumfrmcowxgo.supabase.co";
const supabaseKey = "sb_publishable_NxI16slImC0--XBwgpWlSQ_WLVUBzc1";

export const supabase = createClient(supabaseUrl, supabaseKey);