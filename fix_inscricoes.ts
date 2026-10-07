import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.URL!;
const supabaseKey = process.env.KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const pedidoId = "071af5ad-c7b1-4305-ad57-a6bc64787cf7";
  const { data: pedido } = await supabase.from('pedidos').select('*').eq('id', pedidoId).single();
  
  if (!pedido) { console.log("Pedido nao encontrado"); return; }
  
  const { data: inscricoes } = await supabase.from('inscricoes').select('id, nome').eq('pedido_id', pedidoId);
  console.log("Inscricoes atuais:", inscricoes?.map(i => i.nome));
  
  const beneficiarios = pedido.beneficiarios || [];
  
  for (const ben of beneficiarios) {
    const existe = inscricoes?.find(i => i.nome === ben.nome);
    if (!existe) {
      console.log("Inserindo", ben.nome);
      await supabase.from('inscricoes').insert({
        turma_id: "2025-01",
        pedido_id: pedido.id,
        nome: ben.nome,
        email: ben.email || "N/A",
        telefone: ben.telefone || "N/A",
        status: pedido.status || "pago",
        motivacao: `Acompanhante de ${pedido.cliente_nome} - E-commerce`,
        metodo_pagamento: "cupom_gratuito",
        valor: 0
      });
    }
  }
  
  console.log("Feito!");
}
run();
