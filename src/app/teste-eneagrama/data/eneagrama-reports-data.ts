export interface DimensaoComparativa {
  dimensao: string;
  modoReativo: string;
  modoConsciente: string;
}

export interface EneagramaReportData {
  numero: number;
  letra: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";
  titulo: string;
  subtitulo: string;
  centro: "Instintivo / Visceral (Barriga)" | "Emocional / Cardíaco (Coração)" | "Mental / Racional (Cabeça)";
  centroCategoria: "instintivo" | "emocional" | "mental";
  imagem: string;
  corBadge: string;
  corBorder: string;
  corBg: string;
  corText: string;

  // Matriz Diagnóstica
  fixacaoMental: string;
  paixaoEmocional: string;
  mecanismoDefesa: string;
  virtudeEssencia: string;
  ideiaSagrada: string;
  medoFundamental: string;
  desejoFundamental: string;
  floralBach: string;
  oleoEssencial: string;

  // Visão Sistêmica e Infância
  lugarSistemicoTitulo: string;
  lugarSistemicoDescricao: string;
  lugarSistemicoImpacto: string;
  chaveSistemicaKalapa: string;
  cenarioInfancia: string;
  perdaIdeiaSagrada: string;
  resgateCriancaPontos: string;
  simboloCriancaDivina: string;

  // O Lado Luz
  superpoderes: string[];
  quadroComparativo: DimensaoComparativa[];

  // Plano de Desenvolvimento e Terapias Integrativas
  mestres: {
    bradshaw: string;
    palmer: string;
    naranjo: string;
  };
  floralBachRecomendado: string;
  floralBachComoAtua: string;
  oleoEssencialRecomendado: string;
  oleoEssencialProtocolo: string;
  mensagemTerapeuticaFinal: string;
  afirmacaoKalapa: string;
}

export const ENEAGRAMA_REPORTS_MAP: Record<number, EneagramaReportData> = {
  1: {
    numero: 1,
    letra: "B",
    titulo: "Tipo 1 – O Perfeccionista / Crítico",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Instintivo / Visceral",
    centro: "Instintivo / Visceral (Barriga)",
    centroCategoria: "instintivo",
    imagem: "/Eneagrama.png",
    corBadge: "bg-amber-100 text-amber-900 border-amber-300",
    corBorder: "border-amber-400",
    corBg: "bg-amber-50/60",
    corText: "text-amber-800",

    fixacaoMental: "Ressentimento / Perfeccionismo. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Ira Contida (Raiva Reprimida). É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Formação Reativa (Hiper-correção). É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Serenidade (Aceitação Receptiva)",
    ideiaSagrada: "Perfeição Divina / Ordem Sagrada",
    medoFundamental: "Ser corrupto, imperfeito, errado ou julgado",
    desejoFundamental: "Ter integridade, estar correto e ser bom",
    floralBach: "Beech (para tolerância e empatia) ou Rock Water (para flexibilidade mental).",
    oleoEssencial: "Lavanda: Acalma a mente hipercrítica, reduz a tensão neuromuscular e promove relaxamento.",

    lugarSistemicoTitulo: 'A "Criança Parentalizada" ou "Pequeno Adulto"',
    lugarSistemicoDescricao: "Assumiu precocemente o papel de restaurar a ordem, moral ou regras no sistema familiar por amor cego e lealdade aos pais.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Perfeccionista / Crítico deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Ambiente percebido como caótico, exigente ou punitivo. Desenvolveu a crença inconsciente de que errar é perigoso e que para ser amado é preciso ser impecável e hiperresponsável.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Perfeição Divina / Ordem Sagrada. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 7 (O Entusiasta — resgate do prazer, espontaneidade e leveza) e Asa 9 (Paz interior e desapego). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Integridade e Ética Inabalável",
      "Superpoder 2: Capacidade Executiva de Melhoria Contínua",
      "Superpoder 3: Vocação de Serviço e Justiça Social",
      "Superpoder 4: Disciplina de Alta Precisão"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Critica severamente os outros e a si mesmo",
        modoConsciente: "Aceita o momento presente com serenidade"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Foca obsessivamente no que está errado ou imperfeito",
        modoConsciente: "Usa a percepção para construir e aprimorar sem julgar"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Reprime a raiva gerando tensão e rigidez corporal",
        modoConsciente: "Acolhe as próprias emoções e limites humanos"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Incapaz de relaxar enquanto houver tarefas pendentes",
        modoConsciente: "Permite-se momentos de lazer, descanso e prazer sem culpa"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Julga e moraliza comportamentos alheios",
        modoConsciente: "Inspira e orienta com compaixão e flexibilidade"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Acumula ressentimento silencioso",
        modoConsciente: "Reconhece a perfeição essencial na diversidade da vida"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Trabalho de reparentamento da Criança Ferida, liberando a vergonha tóxica do erro e resgatando a Criança Natural que tem permissão para brincar e falhar.",
      palmer: "Helen Palmer (O Eneagrama): Fortalecimento do Observador Interno sem julgamento, desidentificando-se da voz do Crítico Interno e acessando o Ponto 7 (alegria) e a Asa 9 (paz).",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desativação da Formação Reativa, acolhendo a raiva reprimida no corpo, flexibilizando o controle do superego e encarnando a virtude da Serenidade."
    },
    floralBachRecomendado: "Beech (para tolerância e empatia) ou Rock Water (para flexibilidade mental).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Lavanda: Acalma a mente hipercrítica, reduz a tensão neuromuscular e promove relaxamento.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Perfeccionista / Crítico não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  2: {
    numero: 2,
    letra: "C",
    titulo: "Tipo 2 – O Ajudador / Prestativo",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Emocional / Cardíaco",
    centro: "Emocional / Cardíaco (Coração)",
    centroCategoria: "emocional",
    imagem: "/Eneagrama.png",
    corBadge: "bg-rose-100 text-rose-900 border-rose-300",
    corBorder: "border-rose-400",
    corBg: "bg-rose-50/60",
    corText: "text-rose-800",

    fixacaoMental: "Adulação / Lisonja. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Orgulho (Inconsciente) / Falsa Abundância. É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Repressão (Anulação das Próprias Necessidades). É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Humildade / Altruísmo Desinteressado",
    ideiaSagrada: "Liberdade Sagrada / Vontade Divina",
    medoFundamental: "Ser indesejado, não ser amado ou ser dispensável",
    desejoFundamental: "Sentir-se amado, querido, necessário e apreciado",
    floralBach: "Chicory (para amar sem cobrar, possuir ou controlar o outro).",
    oleoEssencial: "Ylang Ylang: Estimula o amor-próprio, reconecta com a sensualidade e incentiva o autocuidado.",

    lugarSistemicoTitulo: 'O "Cuidador do Sistema"',
    lugarSistemicoDescricao: "Criança que percebeu a dor ou fraqueza dos pais e assumiu a função de suporte emocional, aprendendo que para pertencer precisava cuidar de todos.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Ajudador / Prestativo deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Ambiente em que sentiu que suas próprias necessidades eram um peso. Aprendeu a ler os desejos dos outros antes dos seus e a tornar-se indispensável para garantir afeto.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Liberdade Sagrada / Vontade Divina. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 4 (O Individualista — contato com a própria dor, autenticidade e autocuidado) e Asa 1 (Estrutura e limites éticos). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Empatia Intuitiva e Acolhimento Humano",
      "Superpoder 2: Capacidade de Criar Vínculos Afetivos Profundos",
      "Superpoder 3: Generosidade e Vocação Cuidadora",
      "Superpoder 4: Sensibilidade para Perceber Necessidades Alheias"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Anula as próprias necessidades para agradar",
        modoConsciente: "Cuida de si mesmo em primeiro lugar com humildade"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Cria dependência emocional e cobra retribuição velada",
        modoConsciente: "Oferece ajuda de forma desinteressada e sem expectativas"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Usa a adulação para seduzir e controlar relacionamentos",
        modoConsciente: "Expressa abertamente seus sentimentos e necessidades reais"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Fica magoado e ressentido quando não é reconhecido",
        modoConsciente: "Estabelece limites saudáveis e respeita a autonomia alheia"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Nega que precisa de ajuda e esconde a própria dor",
        modoConsciente: 'Acolhe o amor verdadeiro sem precisar "comprá-lo"'
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: 'Interfere na vida alheia sob o pretexto de "ajudar"',
        modoConsciente: "Reconhece o próprio valor independente do servir"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Resgate da Criança Necessitada, permitindo-se sentir a dor da rejeição original e aprendendo a suprir suas próprias carências sem manipular os outros.",
      palmer: "Helen Palmer (O Eneagrama): Desenvolvimento da consciência das próprias necessidades corporais e emocionais, percebendo a compulsão de seduzir e retendo a projeção no Ponto 4.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desconstrução do Orgulho e da Falsa Abundância, reconhecendo a própria dependência e vulnerabilidade para experimentar a verdadeira Humildade."
    },
    floralBachRecomendado: "Chicory (para amar sem cobrar, possuir ou controlar o outro).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Ylang Ylang: Estimula o amor-próprio, reconecta com a sensualidade e incentiva o autocuidado.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Ajudador / Prestativo não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  3: {
    numero: 3,
    letra: "D",
    titulo: "Tipo 3 – O Realizador / Bem-Sucedido",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Emocional / Cardíaco",
    centro: "Emocional / Cardíaco (Coração)",
    centroCategoria: "emocional",
    imagem: "/Eneagrama.png",
    corBadge: "bg-orange-100 text-orange-900 border-orange-300",
    corBorder: "border-orange-400",
    corBg: "bg-orange-50/60",
    corText: "text-orange-800",

    fixacaoMental: "Vaidade / Identificação com a Imagem. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Engano / Falsa Eficiência. É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Identificação com o Papel / Performance. É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Veracidade / Autenticidade",
    ideiaSagrada: "Lei Sagrada / Verdade Divina",
    medoFundamental: "Fracassar, não ter valor próprio ou ser insignificante",
    desejoFundamental: "Sentir-se valioso, vitorioso, admirado e bem-sucedido",
    floralBach: "Elm (para sobrecarga por excesso de responsabilidade) ou Water Violet (para conexão profunda).",
    oleoEssencial: "Alecrim: Mantém o foco saudável, limpa a exaustão mental e traz clareza e renovação interna.",

    lugarSistemicoTitulo: 'O "Troféu do Sistema"',
    lugarSistemicoDescricao: "Criança que carregou o mandato inconsciente de trazer status, honra e sucesso para compensar fracassos ou vergonha do histórico familiar.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Realizador / Bem-Sucedido deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Ambiente em que o afeto estava condicionado ao desempenho, notas ou aparências. Aprendeu a desligar os sentimentos para focar exclusivamente no fazer e no vencer.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Lei Sagrada / Verdade Divina. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 6 (O Leal — cooperação sincera, lealdade e vulnerabilidade compartilhada) e Asa 4 (Profundidade e verdade emocional). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Capacidade Executiva de Alto Impacto",
      "Superpoder 2: Liderança Motivadora e Foco em Metas",
      "Superpoder 3: Adaptabilidade e Eficiência Organizacional",
      "Superpoder 4: Energia para Superar Obstáculos e Conquistar"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Workaholic compulsivo focado apenas em resultados",
        modoConsciente: "Atua com autenticidade, alinhando ações com o coração"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Muda de máscara para agradar o público e vender uma imagem",
        modoConsciente: "Valoriza o ser humano antes do resultado ou status"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Desconecta-se totalmente dos próprios sentimentos",
        modoConsciente: "Expressa vulnerabilidade e aceita seus próprios limites"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Competitivo, impaciente e utilitarista com as pessoas",
        modoConsciente: "Lidera com transparência e incentiva o sucesso coletivo"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Mente ou omite falhas para preservar a reputação de sucesso",
        modoConsciente: "Desfruta do processo sem ficar refém da aprovação externa"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Confunde seu valor pessoal com seus títulos e bens",
        modoConsciente: "Honra sua verdade interior acima de qualquer troféu"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Acolhimento da Criança Rejeitada pelo que É, libertando-a da obrigação de performar e ensinando que seu valor é incondicional e sagrado.",
      palmer: "Helen Palmer (O Eneagrama): Treinamento do Observador Interno para pausar a hiperatividade, notar a aceleração cardíaca e desacelerar no Ponto 6 com cooperação leal.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desmascaramento da Vaidade e da auto-falsificação, permitindo o colapso da imagem idealizada para emergir a Veracidade e a presença autêntica."
    },
    floralBachRecomendado: "Elm (para sobrecarga por excesso de responsabilidade) ou Water Violet (para conexão profunda).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Alecrim: Mantém o foco saudável, limpa a exaustão mental e traz clareza e renovação interna.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Realizador / Bem-Sucedido não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  4: {
    numero: 4,
    letra: "E",
    titulo: "Tipo 4 – O Individualista / Romântico",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Emocional / Cardíaco",
    centro: "Emocional / Cardíaco (Coração)",
    centroCategoria: "emocional",
    imagem: "/Eneagrama.png",
    corBadge: "bg-purple-100 text-purple-900 border-purple-300",
    corBorder: "border-purple-400",
    corBg: "bg-purple-50/60",
    corText: "text-purple-800",

    fixacaoMental: "Melancolia / Ruminar a Falta. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Inveja (Anseio Doloroso do que Falta). É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Introjeção / Sublimação Dramática. É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Equanimidade / Nobreza de Espírito",
    ideiaSagrada: "Origem Sagrada / Unidade Perfeita",
    medoFundamental: "Não ter identidade, não ter significado único, ser comum",
    desejoFundamental: "Encontrar a si mesmo, ser autêntico e ter relevância única",
    floralBach: "Willow (para ressentimento e vitimização) ou Mustard (para melancolia e tristeza súbita).",
    oleoEssencial: "Bergamota: Traz luz, dissipa a névoa da melancolia e equilibra as oscilações emocionais.",

    lugarSistemicoTitulo: 'O "Ostracizado" ou "Sensível do Sistema"',
    lugarSistemicoDescricao: "Criança que captou o trauma ou segredo não falado da família, encarnando a dor invisível e o sentimento de não pertencimento.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Individualista / Romântico deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Experiência de abandono, desconexão ou perda precoce. Desenvolveu a crença de que é fundamentalmente defeituoso e de que os outros possuem a felicidade que lhe foi negada.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Origem Sagrada / Unidade Perfeita. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 1 (O Perfeccionista — ação disciplinada no mundo real, objetividade e propósito) e Asa 5 (Análise e equilíbrio). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Sensibilidade Estética e Criatividade Artística",
      "Superpoder 2: Profundidade Emocional e Empatia com a Dor Alheia",
      "Superpoder 3: Autenticidade e Coragem de Ser Diferente",
      "Superpoder 4: Intuição Aguçada e Nobreza de Espírito"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Afunda em ondas de melancolia e auto-piedade",
        modoConsciente: "Transforma a dor sensível em arte e beleza curativa"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Sente-se incompreendido e cultiva um ar de superioridade",
        modoConsciente: "Cultiva a equanimidade (equilíbrio emocional estável)"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Inveja a felicidade alheia enquanto rejeita o que possui",
        modoConsciente: "Reconhece o próprio pertencimento e valor sem drama"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Drama emocional e oscilações intensas de humor",
        modoConsciente: "Age com disciplina prática e foco no mundo exterior"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Dificuldade de sustentação prática no cotidiano",
        modoConsciente: "Celebra a autenticidade própria e a conquista dos outros"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Compara-se constantemente e foca no que está faltando",
        modoConsciente: "Conecta-se com a Origem Sagrada presente no momento"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Cura da Criança Abandonada, validando o sofrimento original sem perpetuar o papel de vítima, reparentando a criança com amor incondicional.",
      palmer: "Helen Palmer (O Eneagrama): Mapeamento das ondas de comparação e longing (desejo pelo inalcançável), usando a ancoragem do Ponto 1 para ação prática e estruturada.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desmantelamento da Inveja e da neurose do sofrimento, transmutando a carência em nobreza e acolhendo a riqueza do momento presente."
    },
    floralBachRecomendado: "Willow (para ressentimento e vitimização) ou Mustard (para melancolia e tristeza súbita).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Bergamota: Traz luz, dissipa a névoa da melancolia e equilibra as oscilações emocionais.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Individualista / Romântico não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  5: {
    numero: 5,
    letra: "F",
    titulo: "Tipo 5 – O Observador / Investigador",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Mental / Racional",
    centro: "Mental / Racional (Cabeça)",
    centroCategoria: "mental",
    imagem: "/Eneagrama.png",
    corBadge: "bg-blue-100 text-blue-900 border-blue-300",
    corBorder: "border-blue-400",
    corBg: "bg-blue-50/60",
    corText: "text-blue-800",

    fixacaoMental: "Avareza de Si / Retenção de Energia. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Avareza (Emocional e Energética). É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Isolamento Afeto-Cognitivo. É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Desapego / Onisciência Amorosa",
    ideiaSagrada: "Omnisciência Sagrada / Transparência",
    medoFundamental: "Ser invadido, incompetente, incapaz ou esgotado",
    desejoFundamental: "Ser capaz, autossuficiente e mestre do conhecimento",
    floralBach: "Water Violet (para abrir-se ao convívio) ou Mimulus (para medo do mundo e vulnerabilidade).",
    oleoEssencial: "Hortelã-Pimenta: Estimula a mente enquanto ajuda a digerir e expressar sentimentos no corpo.",

    lugarSistemicoTitulo: 'O "Guardador de Segredos" ou "Refugiado Silencioso"',
    lugarSistemicoDescricao: "Criança que viveu em ambiente sufocante/intrusivo ou frio, escolhendo se invisibilizar no sistema para sobreviver.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Observador / Investigador deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Percepção de que o ambiente exigia demais ou invadia seu espaço sem permissão. Aprendeu a minimizar suas necessidades materiais e emocionais e a viver na fortaleza da mente.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Omnisciência Sagrada / Transparência. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 8 (O Desafiador — corporificação, ação assertiva, liderança e vitalidade) e Asa 6 (Estrutura e lealdade). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Capacidade Analítica e Síntese Teórica de Alta Precisão",
      "Superpoder 2: Objetividade, Foco e Calma sob Pressão",
      "Superpoder 3: Autonomia, Independência e Discrição",
      "Superpoder 4: Visão de Longo Prazo e Profundidade Intelectual"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Isola-se do mundo e corta contatos afetivos",
        modoConsciente: "Compartilha seu conhecimento generosamente com o mundo"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Retém conhecimento, afeto, tempo e energia",
        modoConsciente: "Engaja-se no corpo e na ação assertiva (Ponto 8)"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Observa a vida de longe sem se engajar na ação",
        modoConsciente: "Participa das relações com afeto e presença real"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Minimiza necessidades físicas e evita dependência",
        modoConsciente: "Reconhece a abundância ilimitada da energia vital"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Cínico, frio e intelectualmente arrogante",
        modoConsciente: "Integra mente e corpo com lucidez e compaixão"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Sente que os outros demandam energia demais",
        modoConsciente: "Abre mão do isolamento defensivo para construir conexões"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Trabalho com a Criança Invadida/Sufocada, estabelecendo limites saudáveis e seguros para que a criança possa sair da toca mental e habitar o corpo.",
      palmer: "Helen Palmer (O Eneagrama): Observação da tendência de se afastar para pensar sobre a emoção em vez de senti-la, canalizando a energia corporal no Ponto 8.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desconstrução da Avareza emocional e do isolamento, dissolvendo o muro entre observador e mundo para encarnar o Desapego e a generosidade."
    },
    floralBachRecomendado: "Water Violet (para abrir-se ao convívio) ou Mimulus (para medo do mundo e vulnerabilidade).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Hortelã-Pimenta: Estimula a mente enquanto ajuda a digerir e expressar sentimentos no corpo.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Observador / Investigador não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  6: {
    numero: 6,
    letra: "G",
    titulo: "Tipo 6 – O Guardião / Leal",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Mental / Racional",
    centro: "Mental / Racional (Cabeça)",
    centroCategoria: "mental",
    imagem: "/Eneagrama.png",
    corBadge: "bg-teal-100 text-teal-900 border-teal-300",
    corBorder: "border-teal-400",
    corBg: "bg-teal-50/60",
    corText: "text-teal-800",

    fixacaoMental: "Dúvida / Previsão do Perigo. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Medo / Ansiedade Crônica. É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Projeção (Antecipação do Pior Cenário). É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Coragem / Confiança na Vida",
    ideiaSagrada: "Fé Sagrada / Força Divina",
    medoFundamental: "Ficar sem apoio, sem orientação, indefeso ou traído",
    desejoFundamental: "Ter segurança, certeza, apoio e proteção sólida",
    floralBach: "Mimulus (para medos conhecidos) ou Scleranthus (para indecisão e hesitação crônica).",
    oleoEssencial: "Cedro: Traz a sensação de aterramento, segurança, enraizamento e estrutura interior.",

    lugarSistemicoTitulo: 'O "Sentinela do Sistema"',
    lugarSistemicoDescricao: "Criança criada em um ambiente familiar instável, imprevisível ou com figuras de autoridade incoerentes, assumindo o papel de vigilante de riscos.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Guardião / Leal deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Quebra de confiança na autoridade protetora. Aprendeu a duvidar das intenções alheias, hipervigilar o ambiente e procurar perigos ocultos para evitar ser pego de surpresa.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Fé Sagrada / Força Divina. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 9 (O Pacífico — paz mental, serenidade, confiança e relaxamento) e Asa 7 (Otimismo e leveza). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Lealdade e Comprometimento Inabaláveis",
      "Superpoder 2: Prevenção de Riscos e Planejamento Estratégico",
      "Superpoder 3: Coragem diante da Adversidade Concreta",
      "Superpoder 4: Espírito de Equipe e Proteção aos Seus"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: 'Ansiedade crônica e preocupação obsessiva ("E se...?")',
        modoConsciente: "Confia em sua própria orientação interior e sabedoria"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Dúvida constante de si e dos outros",
        modoConsciente: "Enfrenta os desafios da vida com verdadeira Coragem"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Projeta más intenções nas pessoas e na autoridade",
        modoConsciente: "Relaxa a hipervigilância e repousa no presente (Ponto 9)"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Hesita em agir ou age de forma contra-fóbica agressiva",
        modoConsciente: "Constrói alianças baseadas na fé e na cooperação transparente"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Busca garantias e regras rígidas para se sentir seguro",
        modoConsciente: "Usa a capacidade preventiva para proteger e edificar"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Testa a lealdade dos outros continuamente",
        modoConsciente: "Reconhece que a verdadeira segurança vem de dentro"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Acolhimento da Criança Aterrorizada, oferecendo a proteção interna do Adulto Saudável para libertá-la do medo constante da punição ou abandono.",
      palmer: "Helen Palmer (O Eneagrama): Identificação do \"radar de ameaças\" e das projeções de autoridade, praticando o silêncio mental e a respiração no Ponto 9.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desativação do Medo e da agressividade defensiva (contra-fobia), transmutando o ceticismo na virtude da Coragem e na Fé na existência."
    },
    floralBachRecomendado: "Mimulus (para medos conhecidos) ou Scleranthus (para indecisão e hesitação crônica).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Cedro: Traz a sensação de aterramento, segurança, enraizamento e estrutura interior.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Guardião / Leal não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  7: {
    numero: 7,
    letra: "H",
    titulo: "Tipo 7 – O Entusiasta / Epicurista",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Mental / Racional",
    centro: "Mental / Racional (Cabeça)",
    centroCategoria: "mental",
    imagem: "/Eneagrama.png",
    corBadge: "bg-yellow-100 text-yellow-900 border-yellow-300",
    corBorder: "border-yellow-400",
    corBg: "bg-yellow-50/60",
    corText: "text-yellow-800",

    fixacaoMental: "Planejamento Compulsivo / Racionalização. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Gula (por Experiências, Opções e Estímulos). É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Racionalização Positiva (Fuga da Dor). É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Sobriedade / Aterramento no Presente",
    ideiaSagrada: "Sabedoria Sagrada / Trabalho Divino",
    medoFundamental: "Ficar preso na dor, sofrer privações, ser limitado ou entediado",
    desejoFundamental: "Ser livre, feliz, satisfeito e vivenciar a plenitude da vida",
    floralBach: "Impatiens (para impaciência e ansiedade) ou Chestnut Bud (para assimilar lições e não repetir erros).",
    oleoEssencial: "Laranja Doce: Traz alegria genuína, ajudando a focar, acolher o presente e desacelerar.",

    lugarSistemicoTitulo: 'O "Anestesiador do Sofrimento Familiar"',
    lugarSistemicoDescricao: "Criança que presenciou dor, depressão ou luto no sistema e assumiu o papel de trazer alegria, piadas e distração para salvar o clima.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Entusiasta / Epicurista deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Experiência de privação emocional ou trauma que foi rápido demais para processar. Desenvolveu o mecanismo de escapar para o futuro e refratar tudo de forma otimista.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Sabedoria Sagrada / Trabalho Divino. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 5 (O Observador — síntese, foco profundo, silêncio interno e retenção) e Asa 8 (Força e realização). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Visão Inovadora, Criatividade e Entusiasmo",
      "Superpoder 2: Otimismo Contagiante e Capacidade de Reorientação",
      "Superpoder 3: Pensamento Rápido e Conexão de Ideias Complexas",
      "Superpoder 4: Gosto pela Vida, Liberdade e Novas Experiências"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Superficialidade e fuga sistemática do sofrimento",
        modoConsciente: "Cultiva a Sobriedade, vivendo profundamente o presente"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Incapaz de focar em um projeto do início ao fim",
        modoConsciente: "Sustenta o foco em compromissos com profundidade (Ponto 5)"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Hiperatividade, ansiedade e dispersão em mil opções",
        modoConsciente: "Acolhe a dor e o desconforto como partes do aprendizado"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Racionaliza defeitos e evita conversas difíceis",
        modoConsciente: "Transforma ideias inovadoras em realizações concretas"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Consumismo, gula de estímulos e impaciência com rotinas",
        modoConsciente: "Experimenta a alegria genuína que não depende de fuga"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Descarta compromissos quando perdem a novidade",
        modoConsciente: "Honra a Sabedoria Sagrada que acolhe luz e sombra"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Trabalho de cura da Criança Assustada/Com Fome Emocional, permitindo que ela chore suas dores antigas sem precisar cobri-las com piadas ou planos.",
      palmer: "Helen Palmer (O Eneagrama): Reconhecimento da atração por opções futuras como esquiva do momento presente, treinando a permanência e o aprofundamento no Ponto 5.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desativação da Gula e do charlatanismo hedonista, acolhendo o silêncio, a limitação saudável e a virtude da Sobriedade."
    },
    floralBachRecomendado: "Impatiens (para impaciência e ansiedade) ou Chestnut Bud (para assimilar lições e não repetir erros).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Laranja Doce: Traz alegria genuína, ajudando a focar, acolher o presente e desacelerar.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Entusiasta / Epicurista não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  8: {
    numero: 8,
    letra: "I",
    titulo: "Tipo 8 – O Desafiador / Confrontador",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Instintivo / Visceral",
    centro: "Instintivo / Visceral (Barriga)",
    centroCategoria: "instintivo",
    imagem: "/Eneagrama.png",
    corBadge: "bg-red-100 text-red-900 border-red-300",
    corBorder: "border-red-400",
    corBg: "bg-red-50/60",
    corText: "text-red-800",

    fixacaoMental: "Vingança / Justiça Pessoal. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Excesso / Luxúria (Energia Desmedida). É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Negação da Vulnerabilidade e da Fraqueza. É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Inocência / Grandeza de Ânimo",
    ideiaSagrada: "Verdade Sagrada / Poder Divino",
    medoFundamental: "Ser dominado, controlado, vulnerável, enganado ou prejudicado",
    desejoFundamental: "Proteger a si e aos seus, ter controle de seu destino, ser forte",
    floralBach: "Vine (para suavizar o impulso de dominação) ou Holly (para raiva crônica e desconfiança).",
    oleoEssencial: "Camomila Romana: Ajuda a desarmar a guarda, acalma o plexo solar e suaviza comportamento explosivo.",

    lugarSistemicoTitulo: 'O "Protetor do Núcleo Familiar"',
    lugarSistemicoDescricao: "Criança que cresceu em ambiente hostil, injusto ou sem proteção, assumindo prematuramente a postura de guardião forte para defender o clan.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Desafiador / Confrontador deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: 'Ambiente em que a fraqueza era punida ou explorada. Aprendeu que o mundo é uma selva ("coma ou seja comido"), decidindo nunca mais chorar ou ser vulnerável.',
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada da Verdade Sagrada / Poder Divino. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 2 (O Ajudador — abertura do coração, afeto, sensibilidade, cuidado protetor sem dominação) e Asa 9 (Paz contida). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Liderança Nato, Força de Vontade e Coragem Inabalável",
      "Superpoder 2: Proteção aos Vulneráveis e Luta por Justiça Real",
      "Superpoder 3: Capacidade de Decisão Rápida e Ação Assertiva",
      "Superpoder 4: Presença Marcante, Honestidade Direta e Magnetismo"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Domina, intimida e confronta agressivamente",
        modoConsciente: "Usa sua força para proteger, capacitar e servir os outros"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: "Nega a própria vulnerabilidade, dor e cansaço",
        modoConsciente: "Abre o coração com sensibilidade e compaixão (Ponto 2)"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Age com excesso, intensidade bruta e impulso vingativo",
        modoConsciente: "Acolhe a própria vulnerabilidade com nobreza e Inocência"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Dificuldade de ouvir autoridades e aceitar regras",
        modoConsciente: "Lidera com generosidade, justiça e respeito à autonomia"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Divide o mundo rigidamente entre fortes e fracos",
        modoConsciente: "Cria espaços seguros onde todos podem florescer"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Atropela os sentimentos alheios na pressa de agir",
        modoConsciente: "Canaliza a energia em causas nobres e transformação social"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Resgate da Criança Vulnerável e Machucada, permitindo que o adulto forte proteja essa criança interna para que ela volte a confiar e sentir ternura.",
      palmer: "Helen Palmer (O Eneagrama): Monitoramento do impulso imediato de negação da dor e confronto físico, canalizando a energia para a empatia e o afeto no Ponto 2.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Desmantelamento da Luxúria/Excesso e da Vingança, permitindo o desarmar das defesas viscerais para encarnar a Inocência e a verdade do coração."
    },
    floralBachRecomendado: "Vine (para suavizar o impulso de dominação) ou Holly (para raiva crônica e desconfiança).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Camomila Romana: Ajuda a desarmar a guarda, acalma o plexo solar e suaviza comportamento explosivo.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Desafiador / Confrontador não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  },

  9: {
    numero: 9,
    letra: "A",
    titulo: "Tipo 9 – O Preservador / Pacífico",
    subtitulo: "Relatório Terapêutico Integrativo — Centro Instintivo / Visceral",
    centro: "Instintivo / Visceral (Barriga)",
    centroCategoria: "instintivo",
    imagem: "/Eneagrama.png",
    corBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    corBorder: "border-emerald-400",
    corBg: "bg-emerald-50/60",
    corText: "text-emerald-800",

    fixacaoMental: "Indolência Mental / Anestesia de Si. É a distorção cognitiva e o filtro de atenção automatizado.",
    paixaoEmocional: "Preguiça Psíquica / Acídia (Esquecimento de Suas Metas). É o combustível emocional compulsivo que reage ao estresse.",
    mecanismoDefesa: "Narcotização / Acomodação (Fuga do Conflito). É a estratégia inconsciente para evitar a dor primordial.",
    virtudeEssencia: "Ação Correta / Presença Consciente / Engajamento",
    ideiaSagrada: "Amor Sagrado / Unidade Sagrada",
    medoFundamental: "Conflito, separação, fragmentação, perda de conexão ou caos",
    desejoFundamental: "Ter paz interior, estabilidade, harmonia e união sistêmica",
    floralBach: "Wild Rose (combate a apatia e resignação) ou Scleranthus (traz atitude e poder de escolha).",
    oleoEssencial: "Capim-Limão (Lemon Grass): Desperta o corpo, estimula a mente e incentiva a ação consciente.",

    lugarSistemicoTitulo: 'O "Pacificador Oculto"',
    lugarSistemicoDescricao: "Criança que percebeu que quando expressava desejos isso gerava briga entre os pais, decidindo tornar-se invisível e neutra para manter a família unida.",
    lugarSistemicoImpacto: "Na teia familiar, esta postura serviu como uma âncora de sobrevivência. No entanto, na vida adulta, manter este lugar sistêmico arcaico impede o indivíduo de tomar sua própria vida com plenitude, gerando um custo emocional elevado.",
    chaveSistemicaKalapa: "Ao honrar os pais e ancestrais exatamente como foram, o O Preservador / Pacífico deixa de carregar esse peso familiar e ganha permissão para viver a partir da sua Essência.",
    cenarioInfancia: "Sentimento de que sua presença ou opinião não faziam diferença para o grupo. Aprendeu a engolir suas vontades, anestesiar a raiva e se fundir com os desejos dos outros.",
    perdaIdeiaSagrada: "Segundo a psicóloga Sandra Maitri, a criança sofreu uma desconexão da Ideia Sagrada do Amor Sagrado / Unidade Sagrada. Acreditando que essa realidade divina/essencial havia sido destruída, o ego tentou substituí-la por regras e comportamentos compulsivos para se proteger no mundo.",
    resgateCriancaPontos: "Abaixo da armadura defensiva reside a criança pura e essencial. A rota de cura envolve conectar-se com os pontos de integração do Eneagrama: Ponto 3 (O Realizador — autoafirmação, ação focada no mundo, valorização de suas metas) e Asa 8 (Força e liderança). Quando o ego relaxa, esses recursos desabrocham naturalmente.",
    simboloCriancaDivina: "Quando a criança interna percebe que não precisa mais carregar as velhas defesas, o indivíduo recupera a alegria de viver e o verdadeiro sentido de pertencimento.",

    superpoderes: [
      "Superpoder 1: Capacidade de Mediação, Conciliação e Escuta Empática",
      "Superpoder 2: Presença Pacífica, Estabilidade e Acolhimento Incondicional",
      "Superpoder 3: Visão Holística e Compreensão de Múltiplos Pontos de Vista",
      "Superpoder 4: Paciência, Resiliência e Serenidade no Caos"
    ],
    quadroComparativo: [
      {
        dimensao: "Visão de Mundo",
        modoReativo: "Procrastina e anestesia suas prioridades de vida",
        modoConsciente: "Afirma sua presença e opinião com clareza e autoridade"
      },
      {
        dimensao: "Foco de Atenção",
        modoReativo: 'Diz "sim" querendo dizer "não", acumulando teimosia passiva',
        modoConsciente: "Age com foco, determinação e propósito próprio (Ponto 3)"
      },
      {
        dimensao: "Relacionamentos",
        modoReativo: "Evita conflitos a todo custo, anulando sua própria voz",
        modoConsciente: "Enfrenta conflitos necessários com maturidade e serenidade"
      },
      {
        dimensao: "Expressão de Emoções",
        modoReativo: "Perde-se em rotinas automáticas e distrações irrelevantes",
        modoConsciente: "Expressa suas necessidades sem medo da separação"
      },
      {
        dimensao: "Tomada de Decisão",
        modoReativo: "Reprime a raiva visceral até explodir raramente de forma destrutiva",
        modoConsciente: "Medeia grandes crises trazendo paz verdadeira e inclusão"
      },
      {
        dimensao: "Impacto no Grupo",
        modoReativo: "Acomoda-se em situações insatisfatórias por medo da mudança",
        modoConsciente: "Reconhece que a sua presença é essencial para o universo"
      }
    ],

    mestres: {
      bradshaw: "John Bradshaw (Volta ao Lar): Trabalho com a Criança Invisível/Esquecida, dando-lhe voz, direito de existir e de ter vontades próprias validadas pelo Adulto Saudável.",
      palmer: "Helen Palmer (O Eneagrama): Conscientização do hábito de \"anestesiar\" a atenção com atividades secundárias, direcionando o foco visceral para a Ação Correta no Ponto 3.",
      naranjo: "Claudio Naranjo (Os Nove Tipos): Despertar da Acídia/Preguiça Psíquica, saindo da anestesia sensorial para assumir o protagonismo da própria vida com presença e força."
    },
    floralBachRecomendado: "Wild Rose (combate a apatia e resignação) ou Scleranthus (traz atitude e poder de escolha).",
    floralBachComoAtua: "O floral atua nas frequências vibracionais e emocionais, suavizando a rigidez defensiva e auxiliando no reequilíbrio da psique.",
    oleoEssencialRecomendado: "Capim-Limão (Lemon Grass): Desperta o corpo, estimula a mente e incentiva a ação consciente.",
    oleoEssencialProtocolo: "Pingar 1 gota na palma das mãos, friccionar e inalar profundamente por 3 ciclos respiratórios sempre que notar a ativação da compulsão defensiva.",
    mensagemTerapeuticaFinal: "O desenvolvimento de forças no O Preservador / Pacífico não significa tentar mudar quem você é, mas sim aprender a canalizar os seus dons com amor, presença e serenidade. A verdadeira cura ocorre quando você percebe que a sua existência já é plena e valiosa por si mesma.",
    afirmacaoKalapa: "Eu reconheço minha essência, honro meu sistema familiar e me dou permissão para viver com plenitude, leveza e compaixão."
  }
};
