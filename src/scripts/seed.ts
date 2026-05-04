import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for seeding

const supabase = createClient(supabaseUrl, supabaseKey)

const seedProducts = [
  {
    name: "Vector-01 Titanium",
    price: 185.00,
    category: "Keychains",
    description: "CNC-machined Grade 5 Titanium fob with radial brushed finish.",
    stock: 50,
    image_url: ""
  },
  {
    name: "Apex Fun Find Frame",
    price: 320.00,
    category: "Frames",
    description: "Architectural frame engineered for high-performance displays.",
    stock: 20,
    image_url: ""
  },
  {
    name: "Carbon Stealth Grip",
    price: 145.00,
    category: "Fidgets",
    description: "Tactile satisfying fidget core with carbon fiber inlays.",
    stock: 100,
    image_url: ""
  }
]

async function seed() {
  console.log("Seeding products...")
  const { data, error } = await supabase
    .from('products')
    .insert(seedProducts)
  
  if (error) console.error("Error seeding:", error)
  else console.log("Seeded successfully:", data)
}

seed()
