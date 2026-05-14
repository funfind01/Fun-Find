const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  console.log("Creating test user for Razorpay verification...");
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'test@funfind.shop',
    password: 'TestPassword123!',
    email_confirm: true,
    user_metadata: { name: 'Razorpay Reviewer' }
  });

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log("Test user already exists: test@funfind.shop");
    } else {
      console.error("Error creating test user:", error.message);
    }
  } else {
    console.log("Test user created successfully!");
    console.log("Email: test@funfind.shop");
    console.log("Password: TestPassword123!");
  }
}

createTestUser();
