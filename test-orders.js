import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.from("orders").select("id").limit(1);
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Success:", data);
  }
}
run();
