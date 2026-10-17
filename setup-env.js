const fs = require('fs')
const path = require('path')

const envContent = `# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
`

const envPath = path.join(__dirname, '.env.local')

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent)
  console.log('Created .env.local file')
} else {
  console.log('.env.local already exists')
}

console.log('\nNext steps:')
console.log('1. Create a Supabase project and run supabase/migrations/20261017000000_initial_schema.sql')
console.log('2. Update .env.local with your Supabase project details')
console.log('3. Run: npm run dev')
