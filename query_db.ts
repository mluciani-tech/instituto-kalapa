import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: p } = await supabase.from('pedidos').select('id, cliente_nome, beneficiarios, status').ilike('cliente_nome', '%Jessica%').limit(5);
  console.log("Pedidos:", JSON.stringify(p, null, 2));
  
  if (p && p.length > 0) {
    const { data: i } = await supabase.from('inscricoes').select('id, nome, email, motivacao, status').eq('pedido_id', p[0].id);
    console.log("Inscricoes:", JSON.stringify(i, null, 2));
  }
}
run();
