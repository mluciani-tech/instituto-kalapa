import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf-8');
const supabaseUrl = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1].trim();
const supabaseKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data } = await supabase.from('produtos').select('nome, imagem_url, rota_teste').in('rota_teste', ['/teste-cronotipo', '/teste-eneagrama', '/teste-yin-yang']);
  console.log(data);
}
run();
