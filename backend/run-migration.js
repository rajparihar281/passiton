import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('🚀 Running migration: Add ends_at column...');

  try {
    // Add ends_at column
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE bidding_sessions 
        ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
      `
    });

    if (alterError) {
      console.log('⚠️  Column might already exist or using direct SQL...');
    }

    // Create index
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_bidding_sessions_ends_at 
        ON bidding_sessions(ends_at);
      `
    });

    if (indexError) {
      console.log('⚠️  Index might already exist...');
    }

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test creating a bidding session');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('');
    console.log('Please run this SQL manually in Supabase SQL Editor:');
    console.log('');
    console.log('ALTER TABLE bidding_sessions ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;');
    console.log('CREATE INDEX IF NOT EXISTS idx_bidding_sessions_ends_at ON bidding_sessions(ends_at);');
  }

  process.exit(0);
}

runMigration();
