import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const FOTO_FACILITADORA_PADRAO =
  "https://vvbsaaxljsjcvjfevphc.supabase.co/storage/v1/object/public/produtos/1790515404190-jhqgs.jpeg";

export interface FacilitadoraDados {
  nome: string;
  titulo: string;
  foto_url: string;
  credenciais: string;
  bio: string;
  espaco_titulo: string;
  espaco_descricao: string;
  espaco_fotos: string[];
}

export interface FAQItem {
  pergunta: string;
  resposta: string;
}

export const FAQ_PADRAO: FAQItem[] = [
  {
    pergunta: "Preciso expor minha história ou falar na primeira sessão?",
    resposta:
      "De forma alguma. Cada participante tem seu próprio ritmo e tempo de abertura. Estar no grupo já é um ato de presença e transformação. Você só compartilha o que sentir no coração, sem qualquer pressão.",
  },
  {
    pergunta: "Como funcionam os grupos reduzidos?",
    resposta:
      "Nossos grupos contam com no máximo 15 participantes por encontro. Essa limitação garante que cada pessoa seja verdadeiramente ouvida, acolhida e acompanhada com cuidado individualizado e respeito ao seu processo.",
  },
  {
    pergunta: "Qual é a política de sigilo do INstituto Kalapa?",
    resposta:
      "O sigilo é nosso pilar ético inegociável. Tudo o que é compartilhado, vivenciado e revelado nos encontros permanece estritamente dentro do círculo do grupo, criando um solo seguro e confiável.",
  },
  {
    pergunta: "O que devo levar e como me preparar para o encontro?",
    resposta:
      "Venha com roupas confortáveis que permitam sentar e se movimentar com liberdade. Não é necessária nenhuma experiência prévia em terapias ou vivências. O espaço oferece todo o suporte para sua chegada.",
  },
  {
    pergunta: "Qual a frequência dos encontros?",
    resposta:
      "As vivências acontecem em ritmo quinzenal consciente. Esse intervalo é intencional: permite que os aprendizados e sentimentos acessados no grupo sejam integrados à sua rotina diária no seu próprio tempo.",
  },
];

export const DADOS_FACILITADORA_PADRAO: FacilitadoraDados = {
  nome: "Clatihúcia Capeli",
  titulo:
    "Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal",
  foto_url: FOTO_FACILITADORA_PADRAO,
  credenciais:
    "Constelação Familiar, Vivências em Grupo e Acolhimento do Trauma",
  bio: "Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências que acolhem a dor sem julgamentos, permitindo que ela se transforme em força e consciência.\n\nSua abordagem integra a sabedoria sistêmica das constelações familiares, a neurobiologia do trauma e a potência curativa da presença em grupo. Cada encontro é cuidadosamente preparado para ser um santuário de respeito, acolhimento genuíno e pertencimento.",
  espaco_titulo: "Espaço Serena — Refúgio e Natureza",
  espaco_descricao:
    "Localizado em meio à natureza na Granja Viana (Cotia - SP), o espaço foi concebido como um refúgio acolhedor, silencioso e seguro para vivências presenciais transformadoras.",
  espaco_fotos: ["/foto2.jpg", "/foto4.jpg", "/foto6a.jpg"],
};

export const DEFAULTS_CONFIG: Record<string, string> = {
  preco_sessao: "63.00",
  vagas_maximas: "15",
  turma_atual: "2025-01",
  facilitadora_nome: DADOS_FACILITADORA_PADRAO.nome,
  facilitadora_titulo: DADOS_FACILITADORA_PADRAO.titulo,
  facilitadora_foto: FOTO_FACILITADORA_PADRAO,
  facilitadora_credenciais: DADOS_FACILITADORA_PADRAO.credenciais,
  facilitadora_bio: DADOS_FACILITADORA_PADRAO.bio,
  espaco_titulo: DADOS_FACILITADORA_PADRAO.espaco_titulo,
  espaco_descricao: DADOS_FACILITADORA_PADRAO.espaco_descricao,
};

export const CHAVES_PUBLICAS_PERMITIDAS = new Set([
  "preco_sessao",
  "vagas_maximas",
  "turma_atual",
  "facilitadora_nome",
  "facilitadora_titulo",
  "facilitadora_foto",
  "facilitadora_credenciais",
  "facilitadora_bio",
  "espaco_titulo",
  "espaco_descricao",
  "espaco_fotos",
  "faq_itens",
]);

export async function getPublicConfig(): Promise<Record<string, string>> {
  if (!isAdminConfigured()) {
    return DEFAULTS_CONFIG;
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("configuracoes")
      .select("chave, valor");

    if (error) {
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        console.warn("[config] Tabela configuracoes não existe. Usando valores padrão.");
        return DEFAULTS_CONFIG;
      }
      throw error;
    }

    const config: Record<string, string> = { ...DEFAULTS_CONFIG };
    data?.forEach((item) => {
      if (CHAVES_PUBLICAS_PERMITIDAS.has(item.chave)) {
        config[item.chave] = item.valor;
      }
    });

    return config;
  } catch (error) {
    console.error("[config] Erro ao buscar configurações no servidor:", error);
    return DEFAULTS_CONFIG;
  }
}
