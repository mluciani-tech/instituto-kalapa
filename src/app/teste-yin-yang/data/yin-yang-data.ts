export interface YinYangQuestion {
  id: number;
  categoria: string;
  icone: string;
  ladoYang: {
    titulo: string;
    descricao: string;
  };
  ladoYin: {
    titulo: string;
    descricao: string;
  };
}

export const YIN_YANG_PERGUNTAS: YinYangQuestion[] = [
  {
    id: 1,
    categoria: "Temperatura Corporal",
    icone: "🌡️",
    ladoYang: {
      titulo: "Quente / Calor",
      descricao: "Sensação frequente de calor no corpo, nas mãos ou na cabeça. Pouca tolerância a ambientes quentes.",
    },
    ladoYin: {
      titulo: "Fria / Frio",
      descricao: "Sensação frequente de frio, extremidades geladas (mãos e pés) e facilidade para esfriar na lombar.",
    },
  },
  {
    id: 2,
    categoria: "Aparência Facial",
    icone: "✨",
    ladoYang: {
      titulo: "Face Avermelhada",
      descricao: "Rosto com rubor fácil, bochechas quentes ou tom avermelhado perceptível.",
    },
    ladoYin: {
      titulo: "Face Pálida ou Amarelada",
      descricao: "Tom de pele mais claro, sem viço avermelhado, aspecto translúcido ou levemente amarelado.",
    },
  },
  {
    id: 3,
    categoria: "Gordura Corporal",
    icone: "⚖️",
    ladoYang: {
      titulo: "Concentrada no Tronco",
      descricao: "Tendência a acumular gordura no peito, costas, braços ou na parte superior do corpo.",
    },
    ladoYin: {
      titulo: "Concentrada no Quadril e Coxas",
      descricao: "Tendência a acumular gordura nos glúteos, culotes e pernas, com facilidade para retenção.",
    },
  },
  {
    id: 4,
    categoria: "Abdome",
    icone: "🫄",
    ladoYang: {
      titulo: "Estufado e Firme",
      descricao: "Barriga mais proeminente para frente, dura ao toque ou com sensação de digestão com pressão.",
    },
    ladoYin: {
      titulo: "Caído ou Flácido",
      descricao: "Abdome mais macio, sensação de peso para baixo ou distensão líquida acumulada.",
    },
  },
  {
    id: 5,
    categoria: "Sentido Mais Aguçado",
    icone: "👃",
    ladoYang: {
      titulo: "Paladar Aguçado",
      descricao: "Sensibilidade intensa aos sabores da comida, busca por temperos marcantes e contrastes gustativos.",
    },
    ladoYin: {
      titulo: "Olfato Aguçado",
      descricao: "Sensibilidade extrema a odores, perfumes, aromas de ervas e cheiros do ambiente.",
    },
  },
  {
    id: 6,
    categoria: "Voz & Comunicação",
    icone: "🗣️",
    ladoYang: {
      titulo: "Alta e Forte",
      descricao: "Volume de voz projetado com facilidade, firmeza na pronúncia e clareza sonora potente.",
    },
    ladoYin: {
      titulo: "Baixa e Suave",
      descricao: "Tom de voz mais sereno, comedido, necessitando falar mais baixo ou com pausas reflexivas.",
    },
  },
  {
    id: 7,
    categoria: "Estrutura Física",
    icone: "🦴",
    ladoYang: {
      titulo: "Músculos Fortes e Ossatura Larga",
      descricao: "Biótipo robusto, articulações firmes e sensação natural de tônus muscular denso.",
    },
    ladoYin: {
      titulo: "Ossatura Estreita e Músculos Suaves",
      descricao: "Estrutura óssea mais fina, articulações flexíveis e musculatura mais alongada ou delicada.",
    },
  },
  {
    id: 8,
    categoria: "Respiração",
    icone: "🫁",
    ladoYang: {
      titulo: "Ofegante ou Acelerada",
      descricao: "Respiração concentrada no peito alto, ritmo rápido ou com sensação de fôlego encurtado.",
    },
    ladoYin: {
      titulo: "Suave e Lenta",
      descricao: "Respiração calma, sutil, por vezes tão imperceptível que parece entrar em estado de quase pausa.",
    },
  },
  {
    id: 9,
    categoria: "Libido & Vitalidade",
    icone: "🔥",
    ladoYang: {
      titulo: "Sexualidade Ativa",
      descricao: "Impulso sexual vigoroso, iniciativa frequente e energia erótica expressa com facilidade.",
    },
    ladoYin: {
      titulo: "Diminuição da Libido / Repouso",
      descricao: "A energia vital prioriza a quietude, o aconchego e a recuperação orgânica antes da iniciativa.",
    },
  },
  {
    id: 10,
    categoria: "Hábitos Alimentares",
    icone: "🍲",
    ladoYang: {
      titulo: "Come Muito de Uma Vez / Salgados",
      descricao: "Apetite intenso em refeições pontuais; preferência por alimentos salgados, carnes e pratos substanciosos.",
    },
    ladoYin: {
      titulo: "Belisca o Dia Todo / Doces",
      descricao: "Pouca fome de uma vez só; hábito de beliscar pequenas porções e atração por doces e carboidratos.",
    },
  },
  {
    id: 11,
    categoria: "Sono & Descanso",
    icone: "🌙",
    ladoYang: {
      titulo: "Dorme Pouco",
      descricao: "Mente ligada ao deitar, poucas horas já despertam o corpo ou sensação de estar ligado na tomada.",
    },
    ladoYin: {
      titulo: "Dorme Muito / Letargia",
      descricao: "Necessidade de muitas horas na cama, facilidade para cochilar e lentidão matinal para acordar.",
    },
  },
  {
    id: 12,
    categoria: "Comportamento",
    icone: "⚡",
    ladoYang: {
      titulo: "Expansivo e Dinâmico",
      descricao: "Extrovertido, atitudes ativas, gosto por estar entre pessoas e tomar a frente dos movimentos.",
    },
    ladoYin: {
      titulo: "Contido e Introvertido",
      descricao: "Preservado, observador, atitudes mais acolhidas e necessidade de momentos a sós para recarregar.",
    },
  },
  {
    id: 13,
    categoria: "Atividades Preferidas",
    icone: "🏃",
    ladoYang: {
      titulo: "Competição Física e Ritmo",
      descricao: "Desafios atléticos, esportes de impacto, treinos vigorosos e atividades com movimento veloz.",
    },
    ladoYin: {
      titulo: "Meditar, Alongar e Contemplar",
      descricao: "Práticas suaves, ioga restaurativa, caminhadas lentas na natureza, silêncio e leituras nutritivas.",
    },
  },
  {
    id: 14,
    categoria: "Perfil Mental",
    icone: "💡",
    ladoYang: {
      titulo: "Imediatista e Lógico",
      descricao: "Foco no agora, mente veloz, orientação direta para resolução de problemas e pouca paciência com atrasos.",
    },
    ladoYin: {
      titulo: "Paciente e Reflexivo",
      descricao: "Capacidade de esperar, pensamento ponderado, compreensão de que certos processos exigem tempo.",
    },
  },
  {
    id: 15,
    categoria: "Expressão Emocional",
    icone: "🌊",
    ladoYang: {
      titulo: "Alterna Simpatia e Raiva / Contestador",
      descricao: "Reações expressivas imediatas; oscila entre grande generosidade e impulsos de indignação direta.",
    },
    ladoYin: {
      titulo: "Contido nas Expressões / Guarda Sentimentos",
      descricao: "Guarda o que sente para não gerar conflito, pondera muito antes de falar e 'engole sapos'.",
    },
  },
];

export interface ResultadoInfo {
  tipo: "yang" | "yin" | "equilibrio";
  titulo: string;
  subtitulo: string;
  imagem: string;
  compreensao: string[];
  comoAfetaSono: {
    resumo: string;
    itens: { titulo: string; desc: string }[];
  };
  riscosSeNaoCuidar: {
    resumo: string;
    itens: string[];
  };
  alimentacao: {
    diretriz: string;
    indicados: string[];
    temperos: string[];
    evitar: string[];
  };
  chas: {
    estrategia: string;
    lista: { nome: string; beneficio: string; preparo?: string }[];
  };
  respiracao: {
    nome: string;
    subtitulo: string;
    instrucoes: string[];
    ciclo: { inspira: number; retem?: number; expira: number };
  };
  habitos: string[];
}

export const RESULTADOS_MAP: Record<"yang" | "yin" | "equilibrio", ResultadoInfo> = {
  yang: {
    tipo: "yang",
    titulo: "Predominância Yang (Excesso de Fogo & Aceleração)",
    subtitulo: "Compreendendo e Acalmando o Excesso de Yang para o seu Bem-Estar",
    imagem: "/images/yin-yang/yang-cooling.jpg",
    compreensao: [
      "Possivelmente você sente uma necessidade constante de estar em movimento, urgência nas ações, sensação de pressa interna e de estar 'ligado(a) na tomada' mesmo quando o corpo dá sinais de cansaço.",
      "É comum sentir a mente muito acelerada, ter pouca paciência com a lentidão dos outros, agir por impulso e perceber uma sensação frequente de calor no corpo, na face ou na cabeça.",
      "Você também pode notar a boca, lábios ou narinas ressecadas, sede constante, digestão acelerada ou com azia, tensão acumulada nos ombros e pescoço, e oscilações bruscas de energia ao longo do dia.",
    ],
    comoAfetaSono: {
      resumo: "Na medicina clássica chinesa, o sono natural acontece quando a energia defensiva do corpo (Wei Qi) se recolhe ao interior ao anoitecer para descansar e se nutrir no Yin (processo da 'Combinação do Yin'). Quando há excesso de Yang, essa energia fica retida na superfície e não consegue descer para o interior.",
      itens: [
        {
          titulo: "Dificuldade para adormecer (Insônia)",
          desc: "A mente e o corpo permanecem em estado de alerta e vigília contínua, impedindo que você desacelere e 'desligue' ao deitar na cama.",
        },
        {
          titulo: "Sono agitado e superficial",
          desc: "Mesmo quando consegue adormecer, o sono é leve, entrecortado e acompanhado de agitação corporal ou despertares durante a madrugada.",
        },
        {
          titulo: "Sonhos intensos ou com fogo",
          desc: "O Cânone do Imperador Amarelo relata que o excesso de calor Yang se reflete em sonhos vívidos, agitados, de confronto ou com imagens de fogo e calor.",
        },
      ],
    },
    riscosSeNaoCuidar: {
      resumo: "Quando esse estado de hiperatividade contínua não recebe pausas e resfriamento consciente, o calor consome e evapora as nossas reservas profundas de hidratação e descanso (a energia Yin), podendo evoluir para:",
      itens: [
        "Esgotamento profundo (burnout energético), seguido de fadiga crônica;",
        "Enxaquecas e dores de cabeça frequentes pelo calor que ascende ao topo da cabeça;",
        "Gastrites, úlceras ou refluxo severo por hiperacidez estomacal;",
        "Pressão alta, taquicardias ou tremores por estresse e estimulantes;",
        "Insônia crônica por perda da capacidade orgânica de recolher a mente à noite;",
        "Oscilação extrema de humor: picos de aceleração seguidos de quedas de exaustão e irritabilidade.",
      ],
    },
    alimentacao: {
      diretriz: "Alimentos cozidos na água, ao vapor e levemente refogados. O cozimento suave quebra a frieza crua dos vegetais e mantém sua propriedade refrescante de drenar o calor interno sem agredir o estômago.",
      indicados: [
        "Hortaliças: Abobrinha, chuchu, aspargo, berinjela, couve-flor, espinafre, vagem, broto de feijão, acelga, repolho e cogumelos.",
        "Frutas e sobremesas leves: Pera (excelente assada ou cozida), maçã, mamão, melão, melancia e água de coco fresca.",
      ],
      temperos: [
        "Finalize os pratos com hortelã fresca, salsa, manjericão fresco, algumas gotas de limão ou azeite de oliva extravirgem.",
      ],
      evitar: [
        "Pimentas ardidas, gengibre cru em excesso, alho cru abundante, noz-moscada.",
        "Café em demasia, bebidas alcoólicas destiladas, frituras e carnes muito gordurosas ou condimentadas (que 'jogam lenha na fogueira').",
      ],
    },
    chas: {
      estrategia: "Ervas de natureza fresca, calmante e umectante para drenar o calor e acalmar o sistema nervoso:",
      lista: [
        {
          nome: "Chá de Hortelã (ou Hortelã com Maçã)",
          beneficio: "Excelente para dissolver a sensação de calor, clarear a mente, aliviar dores de cabeça e acalmar a agitação interior.",
        },
        {
          nome: "Chá de Casca de Abacaxi com Hortelã",
          beneficio: "Muito refrescante e diurético, ajuda a aliviar a tensão do dia e a retenção de líquidos.",
          preparo: "Ferva a casca do abacaxi bem lavada por 5 minutos em panela tampada. Desligue o fogo e acrescente as folhas de hortelã fresca apenas no final, deixando abafar por 10 minutos.",
        },
        {
          nome: "Chá de Camomila, Melissa ou Capim-Limão",
          beneficio: "Perfeitos para o meio da tarde ou início da noite; relaxam a musculatura, acalmam o estômago e diminuem a irritabilidade.",
        },
        {
          nome: "Chá de Carqueja, Boldo ou Dente-de-Leão",
          beneficio: "Indicados para tomar após refeições mais pesadas, pois ajudam a aliviar a digestão e baixar o calor abdominal.",
        },
        {
          nome: "Chá de Casca de Chuchu ou Casca de Melancia",
          beneficio: "Forte ação umectante e diurética, auxiliando a acalmar o calor visceral interno.",
        },
      ],
    },
    respiracao: {
      nome: "Respiração Abdominal Yin (Ancoradora)",
      subtitulo: "Puxa a energia de volta para baixo, desacelera o pulso e acalma o sistema nervoso simpático.",
      instrucoes: [
        "Sente-se ou deite-se confortavelmente, relaxe os ombros e apoie as mãos sobre o seu abdome (logo abaixo do umbigo).",
        "Inspire suavemente pelo nariz em 4 segundos, direcionando o ar lá para o baixo ventre, sentindo a barriga expandir devagar (como se enchesse um balão).",
        "Expire devagar pela boca ou nariz em 8 segundos (o dobro do tempo da entrada), sentindo a barriga murchar suavemente.",
        "Faça este ciclo de 5 minutos, de 2 a 3 vezes ao dia e especialmente antes de dormir. A saída mais longa do ar envia ao cérebro o comando biológico imediato de segurança e relaxamento.",
      ],
      ciclo: { inspira: 4, expira: 8 },
    },
    habitos: [
      "Faça pausas conscientes de 5 minutos a cada duas horas de trabalho focado.",
      "Diminua o uso de telas azuis (celular, televisão) pelo menos 1 hora antes de deitar.",
      "Pratique banhos mornos e reserve momentos intencionais de silêncio.",
      "Lembre-se: 'É somente devido ao Yin defendendo o interior que o Yang pode agir no mundo.' Cuide da sua reserva.",
    ],
  },
  yin: {
    tipo: "yin",
    titulo: "Predominância Yin (Excesso de Frio & Estagnação)",
    subtitulo: "Compreendendo e Acolhendo o Excesso de Yin para o seu Bem-Estar",
    imagem: "/images/yin-yang/yin-warming.jpg",
    compreensao: [
      "Possivelmente você sente uma tendência a se recolher, lentidão física, cansaço frequente ou preguiça, e facilidade para sentir frio (especialmente nas mãos, nos pés e na região lombar).",
      "É comum perceber o metabolismo mais lento, ter atitudes mais contidas ou introvertidas, sentir insegurança ou tristeza em alguns momentos, procrastinar decisões e guardar sentimentos ('engolir sapos') em vez de colocá-los para fora.",
      "Também pode notar a pele mais pálida, tendência a inchaços ou retenção de líquidos nas pernas e quadris, musculatura mais fraca ou flácida, voz baixa, pigarro claro constante e atração por doces e carboidratos.",
    ],
    comoAfetaSono: {
      resumo: "Enquanto o Yang traz o impulso de despertar e agir, o Yin está ligado ao repouso e à quietude. Quando o Yin está em excesso, a balança do organismo pende demais para o resfriamento e para a estagnação física.",
      itens: [
        {
          titulo: "Necessidade excessiva de sono e letargia",
          desc: "Necessidade de dormir muitas horas à noite, facilidade para cochilar a qualquer hora do dia e ainda assim acordar com a sensação de corpo pesado ('de chumbo') e sem disposição.",
        },
        {
          titulo: "Dificuldade para 'despertar' a mente",
          desc: "A falta do calor ativador do Yang faz com que a transição do sono para o estado de vigília seja muito lenta, gerando preguiça matinal e neblina mental nas primeiras horas.",
        },
        {
          titulo: "Sono não restaurador por acúmulo de umidade",
          desc: "O excesso de frio e líquidos parados impede a livre circulação do Qi durante a noite, fazendo com que o descanso não renove plenamente a energia vital.",
        },
      ],
    },
    riscosSeNaoCuidar: {
      resumo: "Segundo o Cânone do Imperador Amarelo, a superabundância de Yin traz o 'frio perverso' e a estagnação dos fluidos corporais. Sem um aquecimento progressivo, o quadro pode evoluir para:",
      itens: [
        "Estagnação severa de líquidos e umidade (mucocidade): Ganho de peso com lentidão metabólica (como na tireoide preguiçosa), celulite profunda e inchaço de membros inferiores;",
        "Quadros respiratórios crônicos: Sinusite, bronquite ou rinite com secreção clara e aquosa constante, com imunidade baixa e resfriados recorrentes;",
        "Enfraquecimento dos Rins e do Fogo Digestivo: Dores articulares e lombares que pioram no frio, retenção urinária ou diarreias frias, e diminuição acentuada da libido;",
        "Estagnação emocional e desânimo: Aumento do isolamento social, desânimo profundo, ruminação mental, apego ao passado e sensação de inércia ('saber o que precisa ser feito, mas não conseguir se movimentar').",
      ],
    },
    alimentacao: {
      diretriz: "Cozidos, assados, sopas nutritivas e temperos aquecentes. Ao contrário do Yang, o objetivo é aquecer, ativar a circulação e dar dinamismo ao fogo digestivo. Evite saladas cruas e comidas frias.",
      indicados: [
        "Hortaliças e Raízes (refogadas, no vapor, sopas ou assadas): Aipim, inhame, batata-doce, cenoura, beterraba, abóbora, cebola, alho, alho-poró, brócolis, couve, couve-flor, espinafre e cogumelos.",
        "Proteínas Fortificantes: Peixes, frango, ovos bem cozidos (temperados com ervas mornas) e carne bovina moderada.",
        "Frutas Cozidas ou Assadas: Maçã e pera assadas no forno com canela e cravo, damasco seco e banana aquecida.",
      ],
      temperos: [
        "Abuse de temperos aquecentes: Alho, cebola, gengibre, pimenta-do-reino com moderação, canela, cravo, noz-moscada, curry, salsa, cebolinha, coentro, orégano, alecrim e louro.",
      ],
      evitar: [
        "Bebidas geladas, água trincando de gelada, refrigerantes e sucos gelados.",
        "Leite e laticínios em excesso: Queijos amarelos, creme de leite, iogurtes (grandes geradores de umidade e muco).",
        "Excesso de doces, farinhas brancas e açúcar refinado.",
      ],
    },
    chas: {
      estrategia: "Ervas de natureza morna e quente para aquecer o estômago, ativar a circulação e drenar a umidade estagnada:",
      lista: [
        {
          nome: "Chá de Gengibre com Limão e Mel",
          beneficio: "Potente aquecedor do organismo; ativa o metabolismo, estimula a digestão e afasta a sensação de frio e cansaço.",
        },
        {
          nome: "Chá de Canela com Maçã e Cravo",
          beneficio: "Traz acolhimento térmico, aquece as extremidades geladas (mãos e pés) e ativa a vitalidade profunda dos Rins.",
        },
        {
          nome: "Chá de Casca de Abacaxi com Gengibre ou Canela",
          beneficio: "Aquece o aparelho digestivo, auxilia na eliminação de edemas e reduz a retenção de líquidos.",
        },
        {
          nome: "Chá de Capim-Limão com Erva-Doce ou Funcho",
          beneficio: "Aquece o centro do corpo, alivia gases, previne a digestão pesada e acalma a mente sem resfriar o corpo.",
        },
        {
          nome: "Chá de Alecrim com Hortelã",
          beneficio: "Excelente para o meio da manhã; desperta a mente, combate a letargia e estimula a circulação sanguínea.",
        },
      ],
    },
    respiracao: {
      nome: "Respiração Ativadora Yang (Aquecedora e Expansiva)",
      subtitulo: "Desperta o sistema nervoso, aquece o corpo, estimula a circulação e expulsa a preguiça.",
      instrucoes: [
        "Sente-se com a coluna ereta, abra o peito e mantenha os pés bem apoiados e firmes no chão.",
        "Inspire profundamente e ritmadamente pelo nariz em 4 segundos, expandindo o peito e o abdome, trazendo luz e ar para dentro do corpo.",
        "Segure o ar nos pulmões por 2 segundos (uma pequena pausa cheia que retém o calor e ativa a energia vital).",
        "Expire com firmeza e energia pelo nariz ou boca em 4 segundos, murchando a barriga e expelindo todo o ar estagnado.",
        "Pratique por 5 minutos ao acordar e no meio da tarde para transformar o pensamento em movimento e ação.",
      ],
      ciclo: { inspira: 4, retem: 2, expira: 4 },
    },
    habitos: [
      "Mantenha o corpo aquecido: Proteja os pés e a região lombar do frio e do vento (use meias e evite andar descalço em pisos frios).",
      "Movimente-se diariamente: Pratique caminhadas ao sol, exercícios de fortalecimento muscular ou alongamentos ativos para fazer o sangue circular.",
      "Busque a luz do sol: Expor-se ao sol da manhã ajuda a recarregar a sua energia Yang e melhora a disposição física e o humor.",
      "Aposte nos pequenos passos: Divida suas metas em tarefas curtas para vencer a procrastinação e comemore cada realização diária.",
    ],
  },
  equilibrio: {
    tipo: "equilibrio",
    titulo: "Equilíbrio Dinâmico Yin-Yang (Harmonia Vital)",
    subtitulo: "Parabéns! Sua balança energética está em ressonância e harmonia",
    imagem: "/images/yin-yang/banner.jpg",
    compreensao: [
      "Suas respostas demonstram uma excelente alternância entre os ritmos de atividade (Yang) e descanso (Yin).",
      "Na filosofia taoista, a saúde não é um ponto estático, mas uma dança contínua: saber agir no momento oportuno e saber recolher-se em silêncio quando o corpo pede pausa.",
      "Continue atento(a) às mudanças de estação e aos períodos de maior exigência emocional para reajustar seus alimentos e respiração conforme a necessidade do momento.",
    ],
    comoAfetaSono: {
      resumo: "Seu sono tende a cumprir o ciclo reparador natural da Combinação do Yin, permitindo que a energia defensiva circule com equilíbrio durante a noite.",
      itens: [
        {
          titulo: "Sono Reparador",
          desc: "Capacidade de desacelerar à noite e despertar com clareza mental e vitalidade durante a manhã.",
        },
      ],
    },
    riscosSeNaoCuidar: {
      resumo: "A manutenção do equilíbrio exige atenção contínua para evitar picos prolongados de estresse ou períodos prolongados de sedentarismo.",
      itens: [
        "Observe sinais sutis de cansaço para não forçar o organismo em direção ao esgotamento Yang.",
        "Mantenha uma rotina ativa e solar para não permitir a estagnação do frio Yin.",
      ],
    },
    alimentacao: {
      diretriz: "Alimentação variada, sazonal e equilibrada, integrando alimentos frescos e levemente cozidos.",
      indicados: [
        "Varie cores e sabores no prato, respeitando os vegetais e frutas da estação.",
        "Mantenha boa hidratação com chás aromáticos suaves ao longo do dia.",
      ],
      temperos: ["Temperos naturais frescos, azeite de oliva e ervas aromáticas."],
      evitar: ["Excessos em qualquer direção: ultraprocessados, excesso de estimulantes ou excesso de laticínios gelados."],
    },
    chas: {
      estrategia: "Chás harmonizantes e suaves:",
      lista: [
        {
          nome: "Chá de Camomila com Hortelã",
          beneficio: "Une o frescor suave da hortelã com o acolhimento calmante da camomila.",
        },
        {
          nome: "Chá de Erva-Doce com Maçã",
          beneficio: "Confortável para a digestão e preserva a harmonia estomacal.",
        },
      ],
    },
    respiracao: {
      nome: "Respiração Consciente do Equilíbrio",
      subtitulo: "Harmonização de 4 segundos na inspiração e 4 segundos na expiração.",
      instrucoes: [
        "Inspire em 4 segundos e expire suavemente em 4 segundos.",
        "Perceba a transição fluida e natural entre o movimento e a pausa.",
      ],
      ciclo: { inspira: 4, expira: 4 },
    },
    habitos: [
      "Pratique a escuta ativa do próprio corpo todos os dias.",
      "Celebre suas conquistas e reserve tempo para o silêncio e para o lazer.",
    ],
  },
};
