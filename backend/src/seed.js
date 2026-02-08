import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const colleges = [
  { name: 'MIT', domain: 'mit.edu', location: 'Cambridge, MA' },
  { name: 'Stanford University', domain: 'stanford.edu', location: 'Stanford, CA' },
  { name: 'Harvard University', domain: 'harvard.edu', location: 'Cambridge, MA' },
  { name: 'UC Berkeley', domain: 'berkeley.edu', location: 'Berkeley, CA' },
  { name: 'IIT Delhi', domain: 'iitd.ac.in', location: 'New Delhi, India' },
  { name: 'IIT Bombay', domain: 'iitb.ac.in', location: 'Mumbai, India' },
];

async function seedColleges() {
  console.log('🌱 Seeding colleges...');

  const { data: existing } = await supabase.from('colleges').select('domain');
  const existingDomains = existing?.map(c => c.domain) || [];

  const newColleges = colleges.filter(c => !existingDomains.includes(c.domain));

  if (newColleges.length === 0) {
    console.log('✅ All colleges already exist');
    return;
  }

  const { data, error } = await supabase.from('colleges').insert(newColleges).select();

  if (error) {
    console.error('❌ Error seeding colleges:', error);
    process.exit(1);
  }

  console.log(`✅ Seeded ${data.length} colleges`);
  process.exit(0);
}

seedColleges();
