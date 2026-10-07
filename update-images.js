const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImages() {
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('id, nome, rota_teste');

  if (error) {
    console.error("Error fetching produtos:", error);
    return;
  }

  for (const p of produtos) {
    let newImageUrl = null;
    if (p.rota_teste?.includes('cronotipo')) {
      newImageUrl = '/cronotipo-kalapa.png';
    } else if (p.rota_teste?.includes('eneagrama')) {
      newImageUrl = '/eneagrama-kalapa.png';
    } else if (p.rota_teste?.includes('yin-yang')) {
      newImageUrl = '/yin-yang-kalapa.png';
    }

    if (newImageUrl) {
      console.log(`Updating ${p.nome} to ${newImageUrl}`);
      const { error: updateError } = await supabase
        .from('produtos')
        .update({ imagem_url: newImageUrl })
        .eq('id', p.id);
      
      if (updateError) {
        console.error(`Error updating ${p.nome}:`, updateError);
      } else {
        console.log(`Updated successfully.`);
      }
    }
  }
}

updateImages();
