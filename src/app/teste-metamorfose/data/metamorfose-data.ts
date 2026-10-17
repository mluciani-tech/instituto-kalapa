export interface CartaMetamorfose {
  id: string;
  quadrante_id: 1 | 2 | 3 | 4;
  quadrante_nome: "O Ovo" | "A Lagarta" | "A Crisálida" | "A Borboleta";
  quadrante_arquetipo: string;
  bloco: "A" | "B";
  tipo: "ferida" | "lucido";
  categoria: "Ferida, Ego e Emaranhamento" | "Consciência Adulta e Desafios Reais";
  mensagem_completa: string;
  titulo: string;
  subtitulo: string;
  reflexao_sistemica: string;
  dinamica_interna: string;
  dinamica_externa: string;
  perguntas_autoindagacao: [string, string, string];
}

export interface QuadranteMetaInfo {
  id: 1 | 2 | 3 | 4;
  nome: "O Ovo" | "A Lagarta" | "A Crisálida" | "A Borboleta";
  subtituloArquetipico: string;
  perguntaSistemica: string;
  prefixoFraseGuia: string;
  citacao: {
    texto: string;
    autor: string;
  };
  sentidoOntologico: string;
  blocoAInfo: {
    titulo: string;
    descricao: string;
  };
  blocoBInfo: {
    titulo: string;
    descricao: string;
  };
  ritoDePassagem: {
    titulo: string;
    subtitulo: string;
    introducao: string;
    falaConcordanciaBlocoA: string;
    falaConcordanciaBlocoB: string;
    textoTransicao: string;
    proximaPergunta?: string;
  };
}

export const QUADRANTES_INFO: Record<1 | 2 | 3 | 4, QuadranteMetaInfo> = {
  1: {
    id: 1,
    nome: "O Ovo",
    subtituloArquetipico: "O Princípio de Tudo • Arquétipo do Potencial",
    perguntaSistemica: "Quem você representa?",
    prefixoFraseGuia: "Meu projeto nasce com o propósito inconsciente de...",
    citacao: {
      texto:
        "A semente repousa no escuro sem saber o que virá. Ela não inventa a árvore: ela simplesmente recebe a seiva da terra e o calor do sol, e consente com o destino de crescer.",
      autor: "Bert Hellinger — A Fonte Não Precisa Perguntar pelo Caminho",
    },
    sentidoOntologico:
      "O Ovo representa o estado primordial da criação. No início de uma empresa, de uma relação, de uma transição de carreira ou de uma decisão crucial, a consciência racional acredita que é dona absoluta do seu ponto de partida. No entanto, a perspectiva sistêmica — fundamentada por Bert Hellinger e expandida nas organizações por Jan Jacob Stam — nos ensina que nenhum projeto nasce de uma folha em branco. Toda iniciativa brota de um solo transgeracional fértil, irrigado pelas vitórias, mas também impregnado pelas exclusões, falências, dívidas morais e amores arcaicos do nosso clã familiar.",
    blocoAInfo: {
      titulo: "Bloco A: O Ovo Ferido (Cartas 1.01 a 1.10)",
      descricao:
        "Ego, Ferida Emocional e Emaranhamento Transgeracional. Revela as identificações arcaicas com excluídos, o impulso de salvar os pais, lealdades à falência, segredos e a necessidade de inocência infantil.",
    },
    blocoBInfo: {
      titulo: "Bloco B: O Ovo Lúcido (Cartas 1.11 a 1.20)",
      descricao:
        "Consciência Adulta e Desafios Reais da Matéria. Revela projetos que nascem de um lugar ético e alinhado, mas que enfrentam o atrito natural do mundo: a solidão do início, a escassez de recursos e o tempo lento da germinação.",
    },
    ritoDePassagem: {
      titulo: "Integração Fenomenológica do Quadrante 1",
      subtitulo: "A Arte de Concordar com o Começo Tal Como Ele É",
      introducao:
        "Ao ler a carta sorteada neste primeiro quadrante e registrar suas percepções, a reação mais comum é a vontade ansiosa de 'consertar o emaranhamento' ou mudar de estratégia no mesmo instante. Como nos ensina Bert Hellinger em Ordens do Amor, a alma não se cura pela pressa da mente. Quando tentamos manipular uma imagem sistêmica imediatamente, caímos novamente na arrogância infantil de achar que estamos no controle absoluto das forças da vida.",
      falaConcordanciaBlocoA:
        "Agora eu vejo a quem este projeto estava tentando salvar ou compensar. Eu me inclino diante dessa dor e permito que o passado pertença àquele tempo.",
      falaConcordanciaBlocoB:
        "Eu digo sim ao cansaço, à lentidão e ao esforço do meu início. Eu assumo o meu tamanho e permaneço no meu posto.",
      textoTransicao:
        "O Ovo cumpriu a sua função: ele revelou a matriz genética invisível do seu tema. Agora, a casca se rompe e a vida convida à ação concreta no mundo. Você avança para o Quadrante 2 — A Lagarta (O Arquétipo da Construção). Ali, a criatura já rasteja no solo da rotina, acumulando matéria e devorando folhas, mas ainda acredita que a existência se resume ao chão.",
      proximaPergunta: "A serviço de quem ou do que está esse projeto?",
    },
  },
  2: {
    id: 2,
    nome: "A Lagarta",
    subtituloArquetipico: "O Arquétipo da Construção e do Esforço • A Ilusão do Chão",
    perguntaSistemica: "A serviço de quem ou do que está esse projeto?",
    prefixoFraseGuia: "Meu projeto está a serviço de...",
    citacao: {
      texto:
        "O dar e o tomar ocorrem em dois níveis distintos: entre pais e filhos, onde os pais dão e os filhos tomam; e nas relações entre iguais — como no comércio, nas empresas e no casamento —, onde a troca deve ser justa e recíproca. A empresa que serve à vida equilibra o dar e o receber com rigor e sobriedade.",
      autor: "Bert Hellinger & Jan Jacob Stam",
    },
    sentidoOntologico:
      "A lagarta vive imersa na perspectiva bidimensional da terra. Seu horizonte é o alimento imediato, o peso e o acúmulo contínuo de folhas. Ela não imagina que um dia poderá voar; para ela, a existência é uma luta de sobrevivência, ativismo e esforço muscular. No ciclo de qualquer projeto, carreira ou relação, a fase da Lagarta representa a construção cotidiana na matéria: o trabalho diário, as vendas, a prestação de serviços, a gestão de pessoas e as trocas com o mercado.",
    blocoAInfo: {
      titulo: "Bloco A: A Lagarta Ferida (Cartas 2.01 a 2.10)",
      descricao:
        "Revela as distorções operacionais onde a ação profissional é colocada a serviço de demandas infantis não resolvidas (salvadores cansados, mártires que não delegam, controle obsessivo, clientes fantasmas).",
    },
    blocoBInfo: {
      titulo: "Bloco B: A Lagarta Lúcida (Cartas 2.11 a 2.20)",
      descricao:
        "Apresenta projetos que nascem de um bom lugar e servem à vida, mas que atravessam os atritos inevitáveis da matéria (o cansaço da rotina, a firmeza na precificação, limites vitais, acordos formais e autoridade).",
    },
    ritoDePassagem: {
      titulo: "A Concordância com o Esforço e a Passagem para a Crisálida",
      subtitulo: "Da Ilusão do Chão à Necessidade da Metamorfose",
      introducao:
        "A lagarta não pode mastigar eternamente. Chega um ponto na biologia da metamorfose em que acumular mais folhas torna-se inútil e perigoso. O animal atinge a saciedade física e percebe, através de um instinto profundo, que a sua forma antiga não é mais suficiente para sustentá-lo no mundo. Da mesma maneira, no tema ou projeto que você trouxe para este jogo, a sua percepção da Lagarta revela o teto do seu modo atual de operar.",
      falaConcordanciaBlocoA:
        "Eu vejo a quem tentei servir, agradar ou combater com o meu suor diário. Agradeço pelo serviço que esse mecanismo prestou até hoje, honro o esforço que fiz e me preparo para soltar o chão.",
      falaConcordanciaBlocoB:
        "O cansaço que sinto não é punição: é a honra do dever cumprido e a exigência de respeitar os limites do corpo e dos acordos justos. Eu honro o esforço que fiz até aqui e me preparo para soltar o chão.",
      textoTransicao:
        "A lagarta não pode forçar as próprias asas a crescerem enquanto corre pelo chão. Para que a transformação aconteça, ela precisa fazer o movimento mais radical da sua jornada: parar de andar, soltar a folha e recolher-se no casulo escuro. No próximo quadrante — A Crisálida —, formas antigas, lealdades arcaicas e vaidades precisarão morrer para que a verdadeira essência da sua vida possa emergir.",
      proximaPergunta: "Qual peso esse projeto carrega?",
    },
  },
  3: {
    id: 3,
    nome: "A Crisálida",
    subtituloArquetipico: "O Arquétipo da Morte e Renascimento • O Casulo Escuro",
    perguntaSistemica: "Qual peso esse projeto carrega?",
    prefixoFraseGuia: "O peso que meu projeto carrega é...",
    citacao: {
      texto:
        "O amor muitas vezes é cego e nos leva à ruína quando tentamos carregar o fardo de outros. Mas quando concordamos com o destino e com a dor exatamente como são, a alma encontra paz e o novo pode finalmente emergir.",
      autor: "Bert Hellinger — Ordens do Amor & A Fonte Não Precisa Perguntar Pelo Caminho",
    },
    sentidoOntologico:
      "A crisálida é o estágio mais exigente e sagrado da metamorfose biológica. Ao contrário do que a mente ingênua imagina, a lagarta não ganha asas simplesmente 'colando-as' nas costas: dentro do casulo escuro, seu corpo antigo é quimicamente liquefeito. As células larvais morrem para que as células imaginais — que já guardavam a assinatura da borboleta em silêncio — possam reorganizar a matéria em uma forma inteiramente nova. No ciclo de um projeto, carreira ou relação, o Quadrante 3 representa a parada obrigatória, a desconstrução e o luto lúcido. Não há como voar carregando o caixão do passado.",
    blocoAInfo: {
      titulo: "Bloco A: A Crisálida Ferida (Cartas 3.01 a 3.10)",
      descricao:
        "O Casulo Asfixiante: Sacrifícios cegos pelos pais, lealdade à falência, culpas por ter sobrevivido, lutos congelados e julgamento aos antepassados.",
    },
    blocoBInfo: {
      titulo: "Bloco B: A Crisálida Lúcida (Cartas 3.11 a 3.20)",
      descricao:
        "A Alquimia Adulta: Queda saudável das ilusões, paciência no inverno da espera, poda de vaidades, encerramento ético de sociedades e pedido de ajuda técnica.",
    },
    ritoDePassagem: {
      titulo: "O Rito do Casulo Escuro & A Preparação do Voo",
      subtitulo: "A Alquimia da Entrega: Como a Morte das Formas Antigas Liberta a Vida",
      introducao:
        "Quando a crisálida se fecha, qualquer tentativa de apressar a abertura do casulo resulta em morte ou deformidade congênita. A borboleta precisa do atrito de empurrar as paredes rígidas para bombear sangue e fluidos vitais para dentro das suas asas. Nas constelações familiares, Bert Hellinger ensina que a concordância com o destino pesado e com a dor liberta a alma. A crisálida não é um erro de percurso: é o útero da transformação.",
      falaConcordanciaBlocoA:
        "Eu vejo você e dou um lugar respeitoso a esse fardo na memória. Eu compreendo o seu preço. Agora eu deixo o que é do passado com o passado e abro espaço para as minhas asas.",
      falaConcordanciaBlocoB:
        "Eu acolho a sabedoria do casulo, a poda necessária e o tempo de maturação no escuro. Sustento a travessia com humildade e abro espaço para as minhas asas.",
      textoTransicao:
        "Quando você aceita dissolver as cascas endurecidas do passado, a força vital represada é liberada para a construção das asas. A borboleta não precisa caçar, acumular nem provar nada ao clã. Ela pousa com suavidade nas flores, recebe o néctar e serve à natureza espalhando o pólen da vida. Prepare-se para adentrar o céu aberto da maturidade.",
      proximaPergunta: "O que o campo revela quando me coloco a serviço da vida?",
    },
  },
  4: {
    id: 4,
    nome: "A Borboleta",
    subtituloArquetipico: "O Arquétipo da Expansão, da Polinização e do Serviço à Vida",
    perguntaSistemica: "O que o campo revela a serviço da vida?",
    prefixoFraseGuia: "O que o campo revela quando me coloco a serviço da vida é...",
    citacao: {
      texto:
        "A borboleta não precisa caçar, acumular nem viver em estado de escassez. Ela pousa com suavidade sobre as flores, nutre-se do néctar abundante e, nesse mesmo movimento despojado, serve à natureza inteira ajudando a distribuir o pólen da vida. O verdadeiro êxito se realiza quando nos colocamos a serviço da vida exatamente como ela é: sem intenção e sem medo.",
      autor: "Bert Hellinger & Joan Garriga Bacardí",
    },
    sentidoOntologico:
      "No ciclo da metamorfose, a borboleta representa o cume da individuação e a transcendência do ego. Ela não nega o ovo de onde nasceu nem a lagarta que rastejou com esforço no solo, tampouco esquece a escuridão dissolvente da crisálida. A borboleta é a síntese viva de todas as fases anteriores, mas operando agora em uma dimensão inteiramente nova: a tridimensionalidade dos céus abertos. Este quadrante investiga o que acontece quando uma pessoa ou projeto atinge a maturidade e se coloca a serviço do bem comum.",
    blocoAInfo: {
      titulo: "Bloco A: A Borboleta Ferida (Cartas 4.01 a 4.10)",
      descricao:
        "Hybris do sucesso, fuga espiritual, culpa de voar alto, revanche narcísica, desarraigamento e expansão predatória.",
    },
    blocoBInfo: {
      titulo: "Bloco B: A Borboleta Lúcida (Cartas 4.11 a 4.20)",
      descricao:
        "As moedas assumidas na ação, a força do olhar materno, gestão ética da colheita, liderança serena e polinização pura.",
    },
    ritoDePassagem: {
      titulo: "A Integração da Jornada Completa",
      subtitulo: "A Síntese das Quatro Fases da Metamorfose Sistêmica",
      introducao:
        "Você completou o ciclo das quatro estações da metamorfose da consciência. As quatro cartas reveladas diante de você formam uma equação narrativa contínua que descreve a trajetória oculta do seu tema desde a raiz arcaica até o destino maduro.",
      falaConcordanciaBlocoA:
        "Eu honro a história da minha origem sem precisar cair nem ofuscar ninguém. Eu desço à realidade da terra e coloco as minhas asas a serviço da vida.",
      falaConcordanciaBlocoB:
        "Basta o que recebi. Com essas moedas eu construo a minha vida em paz, pouso com suavidade e sirvo à vida exatamente como ela é.",
      textoTransicao:
        "Respire profundamente e prepare-se para contemplar a Síntese Narrativa Contínua da sua alma e a Balança das Forças em jogo.",
    },
  },
};

export const CARTAS_METAMORFOSE: CartaMetamorfose[] = [
  // ============================================================================
  // QUADRANTE 1: O OVO (1.01 a 1.20)
  // ============================================================================
  {
    id: "1.01",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... trazer de volta à memória do clã alguém que foi rejeitado, julgado ou esquecido, fazendo com que o projeto repita a mesma solidão e incompreensão daquele que não teve lugar.",
    titulo: "O Resgate do Excluído",
    subtitulo: "Arquétipo da Memória Renegada",
    reflexao_sistemica:
      "A primeira lei sistêmica — o pertencimento — determina que ninguém que já fez parte de um sistema pode ser excluído sem que as gerações posteriores sintam a pressão de restaurar o equilíbrio. Quando o projeto brota sob esta carta, a iniciativa foi fertilizada pelo fantasma de alguém do clã que foi marginalizado, considerado vergonha familiar, internado, deserdado ou silenciado na árvore.",
    dinamica_interna:
      "Opera o pacto inconsciente: \"Se você não teve lugar à mesa, eu criarei um projeto onde a sua dor seja encarnada\". O realizador identifica-se não com os ramos prósperos da linhagem, mas com o antepassado solitário. O trabalho é impulsionado por um luto que não pertence a esta época.",
    dinamica_externa:
      "O projeto sofre de uma tendência crônica à marginalização. O profissional oferece serviços de excelência, mas é visto com estranheza pelos pares ou pelo mercado; atrai sócios que acabam sendo excluídos ou traem a confiança; e luta constantemente contra o cancelamento, a incompreensão ou a invisibilidade.",
    perguntas_autoindagacao: [
      "Quem na sua história familiar foi rejeitado, julgado como indigno, falido moralmente ou esquecido nas conversas de família?",
      "De que forma este projeto faz você se sentir tão incompreendido e isolado quanto aquele parente esquecido?",
      "Como seria olhar para esse antepassado e dizer: «Eu vejo você e dou um lugar a você no meu coração, mas deixo o seu destino com você e sigo livre no meu trabalho»?",
    ],
  },
  {
    id: "1.02",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... consertar o sofrimento, a tristeza ou os fracassos de quem veio antes, invertendo a hierarquia sagrada ao tentar ser o amparo daqueles de quem recebi a vida.",
    titulo: "A Cura Mágica dos Pais",
    subtitulo: "Arquétipo da Hybris Infantil",
    reflexao_sistemica:
      "A semente só germina quando aceita ser menor que a terra nutridora. Quando esta carta é revelada no Ovo, a ordem da precedência foi violada na raiz: a pessoa colocou-se inconscientemente acima dos pais através da arrogância infantil (hybris). O projeto não foi gerado para atender ao mercado, mas como um bálsamo sagrado para curar a carência de quem lhe deu a vida.",
    dinamica_interna:
      "A criança mágica não suporta ver a mãe deprimida ou o pai desamparado e faz o voto secreto: \"Eu vou vencer por vocês. Eu serei o pai e a mãe de vocês\". O indivíduo assume um fardo messiânico, acreditando que o seu êxito pessoal tem o poder de redimir o passado familiar.",
    dinamica_externa:
      "Dificuldade crônica em cobrar pelo serviço. Profissionais da saúde ou terapeutas atraem clientes que demandam salvação e se tornam inadimplentes; o empresário fenece em exaustão extrema porque acredita que delegar é abandonar; nenhuma vitória financeira traz paz, pois os pais continuam tristes no passado.",
    perguntas_autoindagacao: [
      "Quem na sua família sofreu exatamente com a falta daquilo que o seu trabalho hoje oferece ao mundo (saúde, dinheiro, justiça, afeto)?",
      "Se o seu negócio se tornar extremamente próspero, lucrativo e leve, você teme sentir que está \"abandonando\" a dor dos seus pais?",
      "O que acontece no seu corpo ao dizer: «Vocês são os grandes, eu sou o pequeno. O destino de vocês pertence a vocês; eu cuido apenas da minha vida»?",
    ],
  },
  {
    id: "1.03",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... ocupar o espaço de uma perda não reconhecida na família — um irmão que partiu cedo, um aborto silenciado ou um antigo projeto que faliu e foi varrido da memória.",
    titulo: "A Substituição do Vazio",
    subtitulo: "Arquétipo do Filho Substitutivo",
    reflexao_sistemica:
      "Toda vida exige um lugar próprio e intransferível. Quando uma família sofre a perda precoce de um filho (aborto espontâneo, provocado ou morte na infância) e esse luto não é elaborado, a vida que vem depois costuma ser concebida inconscientemente para preencher o vazio. O projeto nasce carregando a alma daquele que não pôde florescer.",
    dinamica_interna:
      "Sentimento constante de não viver a própria vida, mas uma existência duplicada. Opera a sensação de carregar um cansaço desproporcional à idade ou a obrigação de realizar por dois. Há uma dúvida existencial contínua sobre a legitimidade da própria voz: \"Eu tenho direito de existir por mim mesmo?\".",
    dinamica_externa:
      "Síndrome da impostura paralisante. O projeto tenta atender a dois nichos antagônicos ao mesmo tempo; dispersão de foco entre carreiras paralelas inconciliáveis; a pessoa cria projetos que \"morrem na praia\" nas vésperas do lançamento, repetindo a interrupção precoce da gestação do irmão.",
    perguntas_autoindagacao: [
      "Houve abortos, perdas gestacionais ou irmãos falecidos antes de você ou de quem você descende na sua linhagem?",
      "Você sente que este projeto tem identidade própria ou ele parece ter que satisfazer duas vontades opostas dentro de você?",
      "Como seria dizer àquele que partiu antes: «Eu honro a sua precedência. Você é o anterior, eu sou o seguinte. Deixo você em paz e tomo o meu lugar»?",
    ],
  },
  {
    id: "1.04",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... provar superioridade moral ou financeira diante daqueles que me criticaram ou rejeitaram, consumindo a força criativa na necessidade de ter razão.",
    titulo: "A Vingança contra a Origem",
    subtitulo: "Arquétipo da Revanche do Clã",
    reflexao_sistemica:
      "O ressentimento e a raiva vinculam com mais força do que o afeto harmonioso. Quando o projeto brota desta carta, o combustível original não é a alegria de criar ou a vocação de servir, mas o desejo de humilhar quem duvidou do realizador (um pai que abandonou, parentes que desdenhavam ou antigos professores).",
    dinamica_interna:
      "A postura interior é de combate beligerante: \"Eu vou esfregar o meu triunfo na cara de vocês\". A energia psíquica é drenada na necessidade de provar valor, mantendo a alma permanentemente subjugada ao olhar daqueles a quem ela afirma repudiar.",
    dinamica_externa:
      "O sucesso, quando ocorre, é amargo e solitário. O empresário atrai litígios contratuais com sócios e concorrentes; a comunicação do negócio adota um tom combativo e arrogante que repele clientes maduros; o profissional teme descansar porque acredita que os rivais irão vencê-lo.",
    perguntas_autoindagacao: [
      "Para quem você está secretamente tentando provar que é brilhante, competente e capaz de vencer?",
      "Se você perdoasse plenamente quem o humilhou no passado, que motivação restaria para este projeto continuar existindo?",
      "Você suportaria a ideia de ter sucesso apenas pela alegria de viver, abrindo mão do amargo prazer de ter razão contra os outros?",
    ],
  },
  {
    id: "1.05",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... manter a fidelidade cega a um pacto oculto ou a uma vergonha familiar intocada, operando em uma névoa contínua onde a verdade dos fatos não pode ser dita.",
    titulo: "A Guarda do Segredo",
    subtitulo: "Arquétipo da Cripta Transgeracional",
    reflexao_sistemica:
      "Onde a verdade foi trancada, a realidade perde o chão de sustentação. Na psicogenealogia (Schützenberger), os segredos inconfessáveis (paternidades adulteradas, falências ocultas, crimes morais, estupros ou heranças fraudulentas) formam uma \"cripta\" que asfixia a criatividade. O projeto nasce imerso em névoa protetora.",
    dinamica_interna:
      "A alma atua sob o pavor inconsciente de que a verdade venha à tona e desintegre o pertencimento. Opera o lema: \"Para pertencer, eu não posso enxergar nem falar com clareza\". Há uma vergonha inexplicável na hora de se expor ao público.",
    dinamica_externa:
      "Comunicação corporativa hermética e ambígua. Dificuldade crônica em colocar cláusulas contratuais no papel; desconfiança paranoica de sócios e colaboradores; medo irracional de auditorias, notas fiscais ou fiscalização, levando ao autoapagamento comercial.",
    perguntas_autoindagacao: [
      "Qual era o assunto que todos conheciam na família, mas ninguém podia pronunciar em voz alta?",
      "Que aspecto deste projeto você sente que precisa esconder do mercado por medo de reprovação ou punição?",
      "Como seria se inclinar diante dos segredos do passado e dizer: «Eu deixo a verdade com quem a viveu; escolho a transparência para a minha obra»?",
    ],
  },
  {
    id: "1.06",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... compensar o medo arcaico do abandono, hesitando em dar o primeiro passo no mundo para não reviver a dor da interrupção do vínculo com o colo que me alimentou.",
    titulo: "O Pânico da Rejeição Materna",
    subtitulo: "Arquétipo do Amor Interrompido",
    reflexao_sistemica:
      "Em Êxito na Vida, Êxito na Profissão, Bert Hellinger ensina que o nosso primeiro grande sucesso é o nascimento e o movimento em direção ao colo materno. Se na infância houve uma interrupção precoce desse abraço (hospitalização, doença, depressão pós-parto), a alma associa a aproximação a uma dor insuportável.",
    dinamica_interna:
      "Quando o impulso de colocar o projeto no mundo ganha força, o alarme biológico dispara: \"Se eu for em direção ao outro, ele desaparecerá e eu perecerei\". A pessoa recua na véspera da realização para se proteger da rejeição imaginada.",
    dinamica_externa:
      "Procrastinação crônica no lançamento. O curso ou produto está pronto, mas nunca é comercializado; o profissional não atende ligações de clientes interessados; terror diante de câmeras ou reuniões de negócios; incapacidade de pedir ajuda quando os recursos se esgotam.",
    perguntas_autoindagacao: [
      "Como foram seus primeiros anos de vida junto à sua mãe: houve internações, separações físicas ou frieza emocional?",
      "Quando você pensa em expor seu projeto ao mercado, qual é o medo mais primitivo que aperta o seu peito?",
      "Você é capaz de visualizar sua mãe agora, respirar fundo e se autorizar a dar o passo em direção ao abraço da vida?",
    ],
  },
  {
    id: "1.07",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... não ultrapassar os limites da pobreza ou do infortúnio que marcaram meus antepassados, temendo que o sucesso próprio soe como uma traição ao sofrimento deles.",
    titulo: "A Fidelidade à Falência",
    subtitulo: "Arquétipo da Solidariedade na Miséria",
    reflexao_sistemica:
      "A semente herda o código da terra onde foi depositada. Se a linhagem é marcada por falências, confiscos de bens ou privações severas, o projeto nasce tutelado pela consciência de grupo: a crença de que enriquecer e viver com conforto enquanto os ancestrais sofreram constitui uma traição imperdoável.",
    dinamica_interna:
      "O indivíduo desfruta de \"boa consciência\" no aperto e sente \"má consciência\" (culpa intolerável) ao acumular patrimônio. Para preservar o sentimento de pertencimento ao clã dos que batalham sem descanso, a alma sabota a retenção do lucro.",
    dinamica_externa:
      "Teto invisível de faturamento. Sempre que o negócio forma uma reserva financeira saudável, surge um imprevisto (quebra de equipamento, processo indevido, golpe de terceiros) que consome exatamente o valor excedente; precificação abaixo do custo e tolerância doentia com calotes.",
    perguntas_autoindagacao: [
      "Quem na sua família faliu, perdeu propriedades ou viveu em amarga e contínua escassez financeira?",
      "Qual é a renda mensal que, se você recebesse, faria você se sentir desconfortável diante dos seus parentes?",
      "Você tem a coragem de olhar para seus antepassados e dizer: «Eu honro a dureza do caminho de vocês desfrutando da fartura que recebo hoje»?",
    ],
  },
  {
    id: "1.08",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... atender às carências afetivas de um dos meus progenitores, ocupando um lugar de casal invisível que sequestra a liberdade de gerar meus próprios frutos.",
    titulo: "O Parceiro Emocional dos Pais",
    subtitulo: "Arquétipo do Casal Invisível",
    reflexao_sistemica:
      "Jan Jacob Stam destaca que a confusão entre o sistema familiar e o profissional drena as empresas. Quando um dos pais não encontra no cônjuge o alimento afetivo necessário, atrai um dos filhos para ser o seu confidente e amparo emocional. O projeto nasce como um \"enteado rejeitado\" dessa relação incestuosa na alma.",
    dinamica_interna:
      "A energia reprodutiva e criativa que deveria gerar novos empreendimentos no mundo está sequestrada pelo casamento dos pais. A alma sente que fundar algo independente e próspero seria cometer um adultério contra a família de origem.",
    dinamica_externa:
      "Dificuldade grave em constituir sociedades equitativas; o negócio compete com a vida conjugal do realizador; pais sem qualificação opinam sobre rumos estratégicos da empresa; sensação de asfixia, falta de ar e cansaço paralisante ao planejar a expansão.",
    perguntas_autoindagacao: [
      "Você foi o conselheiro íntimo, confidente ou protetor de um dos seus pais na juventude?",
      "A quem você deve lealdade primária hoje: à expansão do seu próprio negócio ou à aprovação contínua dos seus pais?",
      "Como seria dar um passo atrás e dizer: «Eu sou apenas o seu filho; o casamento de vocês não me cabe. Eu me recolho ao meu lugar»?",
    ],
  },
  {
    id: "1.09",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... manter a ilusão de ser uma alma mais esclarecida e evoluída do que a minha família simples, transformando o distanciamento das raízes em esterilidade existencial.",
    titulo: "O Orgulho do Diferente",
    subtitulo: "Arquétipo do Exílio do 'Especial'",
    reflexao_sistemica:
      "A semente quer se desvencilhar da árvore de onde caiu, acreditando-se de espécie celestial. O mito da \"ovelha negra\" esconde uma vaidade aristocrática: o sujeito julga a rusticidade, a ignorância ou as falhas dos pais, julgando-se purificado. O projeto nasce sem terra arável.",
    dinamica_interna:
      "\"Eu não pertenço a esse povo comum; sou destinado a esferas superiores\". Essa presunção bloqueia o fluxo da vida que vem do tronco ancestral. Privada de seiva, a semente tenta crescer alimentada apenas pelo vapor do próprio orgulho intelectual.",
    dinamica_externa:
      "Ofertas corporativas excessivamente etéreas, acadêmicas ou inacessíveis para o cliente real; aversão ao marketing, vendas e negociações concretas, julgadas como atividades \"menores\"; isolamento de mercado, justificado com a frase: \"O público não está preparado para mim\".",
    perguntas_autoindagacao: [
      "Em quais áreas ou atitudes você se considera secretamente superior ou mais evoluído que seus pais?",
      "Você sente vergonha da história, da fala ou da classe social da sua família ao se apresentar a clientes?",
      "Como seria se ajoelhar internamente e dizer: «Eu venho da mesma terra que vocês; sou feito do mesmo barro, com humildade»?",
    ],
  },
  {
    id: "1.10",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... provar compulsivamente que sou puro, correto e irrepreensível, evitando assumir os riscos, as perdas e as manchas inerentes a qualquer ação no mundo adulto.",
    titulo: "O Atestado de Inocência",
    subtitulo: "Arquétipo da Sombra Renegada",
    reflexao_sistemica:
      "Bert Hellinger ressalta que quem quer atuar no mundo precisa ter a coragem de perder a inocência infantil. Toda ação real produz consequências: para empreender é necessário competir, cobrar com firmeza, demitir, estipular limites e desagradar. O projeto aqui nasce da covardia de querer permanecer virgem de erros.",
    dinamica_interna:
      "Terror de ser rotulado como ganancioso, insensível, autoritário ou capitalista. O indivíduo prefere amargar prejuízos financeiros contínuos a carregar a \"má consciência\" necessária para exercer autoridade e comando na matéria.",
    dinamica_externa:
      "Incapacidade de dizer não a colaboradores folgados; aversão ao lucro legítimo, tratado como mácula espiritual; ausência de contratos formais; complacência destrutiva diante de desvios e erros operacionais que afundam a organização.",
    perguntas_autoindagacao: [
      "Que traço ambicioso, firme ou agressivo você tenta desesperadamente ocultar de si mesmo e dos outros?",
      "O que de trágico aconteceria se você tomasse uma decisão empresarial dura que desagradasse a pessoas próximas?",
      "Você está disposto a abrir mão do troféu moral da \"boazinha\" para se tornar uma mulher ou homem realizador de verdade?",
    ],
  },
  {
    id: "1.11",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... expressar uma vocação legítima e própria, assumindo o peso e a angústia inaugural de dar passos sem garantias prévias nem aprovações externas.",
    titulo: "A Solidão da Primeira Escolha",
    subtitulo: "Arquétipo da Autoria do Destino",
    reflexao_sistemica:
      "A semente rompe a casca por força da sua própria potência biológica. Não há trauma sistêmico nem mandatos invisíveis: o projeto brota da maturidade de quem tomou sua herança e decidiu traçar seu próprio curso. O desafio aqui é existencial: o preço da liberdade é a solidão do pioneiro.",
    dinamica_interna:
      "A alma adulta reconhece que ninguém pode viver a vida em seu lugar. Dissolve-se a expectativa infantil de mentores perfeitos ou de garantias divinas. A pessoa assume a autoria de suas escolhas, acolhendo o frio na espinha como testemunho de sua autonomia.",
    dinamica_externa:
      "Ausência transitória de aplausos ou validação externa; necessidade de trabalhar semanas sem ter certeza absoluta da resposta financeira do mercado; tomada de decisões estratégicas de risco sem conselheiros imediatos; autodisciplina diária rigorosa.",
    perguntas_autoindagacao: [
      "Você sustenta a decisão de levar este projeto adiante mesmo que seus amigos e familiares achem sua escolha arriscada?",
      "De onde você retira sustentação espiritual e emocional quando as certezas externas desaparecem?",
      "Como seria dizer à sua própria alma: «Eu assumo o risco do meu início. Sustento a solidão do pioneiro com dignidade e paz»?",
    ],
  },
  {
    id: "1.12",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... honrar a herança familiar através da inovação, enfrentando o desconforto e a culpa consciente de fazer diferente daqueles a quem amo.",
    titulo: "A Tensão da Diferenciação",
    subtitulo: "Arquétipo da Má Consciência Necessária",
    reflexao_sistemica:
      "Para que a vida se expanda, os descendentes precisam ultrapassar as fronteiras da aldeia de origem. O projeto é saudável e ancorado na raiz, mas tem função evolutiva de renovação. O teste de maturidade reside em suportar a \"má consciência\" (Hellinger): o desconforto de trilhar caminhos novos sem desonrar a tradição.",
    dinamica_interna:
      "Sustentar a culpa benéfica de quem se torna mais livre, próspero ou internacional do que os pais. A alma aprende a tolerar o estranhamento do clã sem recuar, compreendendo que a verdadeira honra consiste em fazer algo frutífero com a vida recebida.",
    dinamica_externa:
      "Adoção de modelos de negócios modernos que contrastam com o padrão conservador da família; firmeza na precificação de produtos de alto valor agregado; necessidade de construir redes de relacionamento fora do círculo original de convivência.",
    perguntas_autoindagacao: [
      "Qual padrão tradicional ou crença de limitação da sua família este projeto está desobedecendo de forma lúcida?",
      "Você suporta ser amado pelos seus pais mesmo sabendo que suas escolhas profissionais são incompreensíveis para eles?",
      "Você tem a firmeza de dizer ao seu clã: «Eu levo a força de vocês para um terreno novo. Honro minha origem ao ser fiel ao meu tempo»?",
    ],
  },
  {
    id: "1.13",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... responder a um chamado genuíno, encarando com sobriedade as limitações financeiras, a falta de estrutura e a lentidão natural do ponto de partida.",
    titulo: "A Matéria Bruta e a Escassez Inicial",
    subtitulo: "Arquétipo do Realismo Estrutural",
    reflexao_sistemica:
      "O projeto tem integridade e foco nobre, mas aterrissa no solo concreto da matéria, onde vigoram as leis da escassez e da gravidade. A dureza presente não é um bloqueio espiritual nem sinal de desfavor divino: é o atrito fecundo e natural entre a visão mental e a densidade da terra crua.",
    dinamica_interna:
      "A mente renuncia ao pensamento mágico. Não se espera que investidores caiam do céu; a pessoa curva-se diante do orçamento real, colocando o foco na engenhosidade do possível e transformando restrição em criatividade construtiva.",
    dinamica_externa:
      "Capital de giro restrito; necessidade de operar com ferramentas enxutas; prazos de pagamento apertados; exigência de cortar qualquer custo supérfluo e negociar com fornecedores na margem do centavo.",
    perguntas_autoindagacao: [
      "Você está confundindo os desafios financeiros normais de qualquer começo com um pretenso \"bloqueio cármico\"?",
      "Qual é a solução mais rústica, viável e econômica para colocar sua iniciativa de pé com os recursos disponíveis hoje?",
      "Como seria dizer à realidade dos fatos: «Eu digo sim às suas condições duras. Começo com o que tenho e construo passo a passo»?",
    ],
  },
  {
    id: "1.14",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... construir em colaboração com outros adultos, atravessando os inevitáveis atritos de autoridade, alinhamento de papéis e divergências de visão.",
    titulo: "A Parceria entre Iguais",
    subtitulo: "Arquétipo da Cooperação Madura",
    reflexao_sistemica:
      "O tema nasce da união entre consciências maduras e autônomas. Não há paternalismo nem dependência: é uma relação entre sócios equiparados. O teste sistêmico reside na gestão do poder e na capacidade de lidar com divergências sem regredir a queixas infantis.",
    dinamica_interna:
      "Ambas as partes renunciam ao monopólio da verdade. Exige-se desprendimento para acolher visões técnicas contrárias, reconhecendo que a empresa é uma terceira entidade superior às vontades exclusivas dos fundadores.",
    dinamica_externa:
      "Formalização rigorosa de acordos de sócios, cláusulas de governança e regras claras de dissolução; alinhamento aberto sobre divisão de dividendos e pró-labore; superação de desgastes na rotina de tomada de decisões colegiadas.",
    perguntas_autoindagacao: [
      "Você trata seus sócios como iguais inteiros, ou espera que eles cuidem das suas fragilidades como se fossem seus pais?",
      "Quais acordos contratuais deste tema ainda estão vagos ou apoiados apenas em \"amizade ingênua\"?",
      "Você está disposto a registrar regras formais claras mesmo que isso gere debates desconfortáveis no curto prazo?",
    ],
  },
  {
    id: "1.15",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... multiplicar os recursos e talentos reais herdados da minha história, sem devaneios de grandeza e suportando o trabalho concreto da semeadura.",
    titulo: "O Compromisso com as Moedas",
    subtitulo: "Arquétipo da Herança Assumida",
    reflexao_sistemica:
      "Inspirada em Joan Garriga (Onde Estão as Moedas?), a carta sinaliza que a pessoa tomou a bagagem exata dos pais — tanto as virtudes quanto os limites — e não guarda queixas. O desafio do momento é o dever sagrado de colocar esse patrimônio para render juros na vida concreta.",
    dinamica_interna:
      "Cessa a mendicância existencial. O sujeito assume: \"Eu já recebi o suficiente para ser quem sou\". A responsabilidade migra para as suas mãos: não há mais desculpas biográficas para justificar o adiamento da colheita.",
    dinamica_externa:
      "Trabalho diário focado e sem afetação; aplicação pragmática de habilidades consolidadas na prática; cobrança de preços justos com tranquilidade; reinvestimento consistente do lucro obtido para garantir solidez.",
    perguntas_autoindagacao: [
      "Quais competências e forças concretas herdadas da luta dos seus pais você está aplicando neste trabalho?",
      "Você aceita plenamente que a responsabilidade por fazer essa bagagem render frutos hoje é exclusivamente sua?",
      "Como seria olhar para seus pais no coração e dizer: «Eu tomei as suas moedas. Agora eu trabalho e honro a vida em minhas obras»?",
    ],
  },
  {
    id: "1.16",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... colocar uma obra verdadeira à vista do público, suportando o julgamento, o desinteresse ou a crítica sem me esconder no casulo.",
    titulo: "A Vulnerabilidade da Exposição",
    subtitulo: "Arquétipo da Presença Pública",
    reflexao_sistemica:
      "A semente precisa romper o solo e encarar o sol e a chuva. O projeto possui autenticidade, mas o teste maduro reside em suportar a visibilidade: sair do casulo confortável e expor a criação ao julgamento dos outros.",
    dinamica_interna:
      "Superação do perfeccionismo narcísico. O criador aceita que seu trabalho será alvo de elogios e críticas, e que nem todos compreenderão a proposta. A alma sustenta os olhares externos sem se abalar.",
    dinamica_externa:
      "Posicionamento claro e assertivo nas redes sociais e no mercado; aparição do realizador como porta-voz do projeto; defesa de propostas comerciais de alto escalão; serenidade para absorver rejeições comerciais sem desabar.",
    perguntas_autoindagacao: [
      "Qual é o custo invisível que você paga por escolher permanecer escondido na segurança do anonimato?",
      "O que de trágico aconteceria se algumas pessoas reprovassem abertamente a sua nova oferta? Sua dignidade resistiria?",
      "Você se autoriza a ocupar o espaço público e dizer: «Aqui está o meu trabalho, a serviço de quem dele precisar»?",
    ],
  },
  {
    id: "1.17",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... abrir um caminho novo reconhecendo humildemente quem fundou e estruturou este campo antes de mim, sem disputar espaço nem plagiar os pioneiros.",
    titulo: "O Respeito à Ordem dos Mestres",
    subtitulo: "Arquétipo da Precedência Sagrada",
    reflexao_sistemica:
      "Nas ordens da vida, quem veio antes tem precedência e merece reverência. A carta aparece quando a proposta é inovadora, mas exige alinhamento interno perante os pioneiros e referências daquele setor. Ninguém edifica nada duradouro destruindo o legado dos que vieram antes.",
    dinamica_interna:
      "Humildade epistemológica e relacional. O profissional não rivaliza com seus mestres; ele se inclina diante de sua contribuição histórica e pede licença para acrescentar sua nota à sinfonia.",
    dinamica_externa:
      "Citação transparente das fontes e referências metodológicas utilizadas; repúdio ao plágio e à apropriação indevida de ideias alheias; cultivo de laços cordiais e respeitosos com colegas veteranos do segmento.",
    perguntas_autoindagacao: [
      "Quem são os pioneiros, mentores e mestres que desbravaram a área em que você atua hoje?",
      "Existe em você alguma arrogância oculta querendo provar que os mais velhos e tradicionais estão \"ultrapassados\"?",
      "Como seria dizer aos pioneiros: «Eu reverencio o solo que vocês prepararam. Com a bênção de vocês, eu dou a minha contribuição»?",
    ],
  },
  {
    id: "1.18",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... materializar um foco nítido, aceitando o luto lúcido de dizer \"não\" a dezenas de outras ideias atraentes para que esta possa ter fôlego.",
    titulo: "A Renúncia às Outras Vidas",
    subtitulo: "Arquétipo do Foco e da Escolha",
    reflexao_sistemica:
      "Todo nascimento implica o descarte de outras possibilidades embrionárias. No início de um projeto sólido, a armadilha mais sedutora não é a carência de planos, mas o excesso. O teste adulto do criador consiste em escolher um vetor único e deixar as demais ideias morrerem na gaveta.",
    dinamica_interna:
      "A criança quer brincar com tudo ao mesmo tempo. O adulto sabe que para atingir maestria em uma entrega, é preciso vivenciar o luto consciente de todas as outras versões potenciais que não serão realizadas agora.",
    dinamica_externa:
      "Definição estrita de nicho e produto central viável; firmeza em declinar convites paralelos que fragmentariam o esforço; recusa de clientes fora do escopo central da empresa; alocação concentrada de energia e recursos.",
    perguntas_autoindagacao: [
      "Quais projetos secundários você continua mantendo vivos apenas para evitar o compromisso de fazer o tema central decolar?",
      "Você suporta o luto maduro de colocar de lado outras ideias para que esta semente receba toda a sua água?",
      "Como seria dizer às opções secundárias: «Eu me despeço de vocês em paz. Agora eu escolho este caminho e me dedico a ele»?",
    ],
  },
  {
    id: "1.19",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... obedecer aos ciclos biológicos e econômicos da gestação, contendo a ansiedade imediata e respeitando o tempo de maturação da terra.",
    titulo: "O Tempo Lento da Germinação",
    subtitulo: "Arquétipo dos Ciclos Biológicos",
    reflexao_sistemica:
      "Conforme Bert Hellinger (A Fonte Não Precisa Perguntar pelo Caminho), a alma respeita tempos profundos e ritmos geológicos. Tentar forçar o crescimento puxando as folhas de um broto jovem não acelera a colheita: arranca as raízes. A aparente lentidão atual é o trabalho silencioso das profundezas.",
    dinamica_interna:
      "Paciência contemplativa e serenidade. Desarma-se o pavor do \"tempo perdido\". O realizador aprende a repousar no escuro fértil do início, ciente de que as árvores de raízes mais fortes crescem sem alarde.",
    dinamica_externa:
      "Manutenção constante da rotina profissional mesmo quando métricas e receitas demoram a responder; refinamento dos processos internos antes de buscar expansão rápida; respeito ao tempo de maturação de clientes e parceiros.",
    perguntas_autoindagacao: [
      "Onde a sua pressa por resultados visíveis está ameaçando a consistência daquilo que você está plantando?",
      "Você é capaz de trabalhar com esmero hoje confiando que a colheita virá no tempo da estação certa?",
      "Como seria colocar a mão no coração e dizer: «Eu confio no tempo silencioso das sementes. Cumpro meu dever hoje e descanso no ritmo da vida»?",
    ],
  },
  {
    id: "1.20",
    quadrante_id: 1,
    quadrante_nome: "O Ovo",
    quadrante_arquetipo: "O Princípio de Tudo | Arquétipo do Potencial",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto nasce com o propósito inconsciente de... servir com simplicidade e honestidade ao que é possível hoje, sem a arrogância de querer estrear pronto no topo da montanha.",
    titulo: "A Dignidade do Começo Pequeno",
    subtitulo: "Arquétipo da Simplicidade Essencial",
    reflexao_sistemica:
      "As árvores centenárias brotam de pequenas sementes esquecidas na terra. Esta carta encerra o Quadrante 1 com a virtude da sobriedade. O projeto não necessita de megalomania, frotas ou aparatos caros para ser legítimo e transformador. A sua força reside exatamente no seu tamanho modesto e proporcional ao momento.",
    dinamica_interna:
      "Desapego das fantasias narcísicas de grandiosidade. A alma reconcilia-se com a sua verdade imediata: ela está pronta para atender com excelência a poucos, sem vergonha da sua escala artesanal.",
    dinamica_externa:
      "Operação enxuta com custos fixos mínimos; foco em encantar os primeiros participantes ou clientes com atenção exclusiva; flexibilidade para ajustar a rota com rapidez; independência de empréstimos bancários pesados.",
    perguntas_autoindagacao: [
      "Você tem vergonha de assumir perante os outros que seu negócio é pequeno, artesanal e conduzido por você nesta fase?",
      "O que impede você de se alegrar profundamente em atender muito bem a poucas pessoas antes de querer atingir multidões?",
      "Como seria contemplar sua estrutura simples e dizer: «Eu honro a minha modéstia. Na minha verdade despojada reside a minha maior força»?",
    ],
  },

  // ============================================================================
  // QUADRANTE 2: A LAGARTA (2.01 a 2.20)
  // ============================================================================
  {
    id: "2.01",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... mendigar a atenção e o reconhecimento de pais que estiveram emocionalmente indisponíveis, acumulando títulos, trabalho e resultados para compensar uma falta de infância.",
    titulo: "A Cobrança por Aplausos Tardios",
    subtitulo: "O Troféu para os Pais Ausentes",
    reflexao_sistemica:
      "A lagarta devora folhas sem trégua, acreditando que seu valor provém da quantidade de biomassa que acumula no solo. No plano sistêmico, o trabalho diário é sequestrado por uma demanda infantil não atendida: o desejo ardente de finalmente arrancar o olhar de aprovação do pai ou da mãe. Como ensina Jan Jacob Stam em A Alma do Negócio, empresas e carreiras entram em colapso quando são utilizadas como palco para resolver carências afetivas da infância em vez de atenderem aos clientes reais.",
    dinamica_interna:
      "A criança interior permanece congelada na janela, esperando que os pais voltem ou percebam o seu esforço. Ela faz o voto secreto: \"Se eu me tornar um profissional brilhante, premiado e indispensável, finalmente eles me verão e dirão que têm orgulho de mim\". Nenhuma conquista material traz saciedade, pois o aplauso que a alma busca pertence ao passado.",
    dinamica_externa:
      "Workaholic crônico; obsessão por títulos, prêmios e validação pública nas redes sociais; estafa e incapacidade de desfrutar vitórias financeiras. Diante dos clientes e do mercado, a pessoa oscila entre a arrogância de quem precisa provar superioridade e a carência desesperada de quem se magoa profundamente se não for elogiada.",
    perguntas_autoindagacao: [
      "Quem você quer que bata palmas e se impressione com o sucesso deste projeto?",
      "De quem é o olhar ausente que você tenta atrair trabalhando até a exaustão?",
      "Como seria dizer internamente aos seus pais: «Pai, mãe: eu já recebi a vida de vocês. O que construo agora é por mim e para o mundo, sem exigir aplausos»?",
    ],
  },
  {
    id: "2.02",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... resgatar clientes, sócios ou colaboradores como se fossem crianças desamparadas, criando dependência mútua e enfraquecendo a autonomia de quem busca o meu serviço.",
    titulo: "A Arrogância do Salvador",
    subtitulo: "O Salvador Cansado e a Ajuda que Enfraquece",
    reflexao_sistemica:
      "A lagarta constrói uma rede pegajosa ao seu redor sob o pretexto de proteger o jardim. Em Ordens da Ajuda, Bert Hellinger adverte com severidade contra a hybris do ajudante: quando o profissional assume o papel de salvador, ele desrespeita o destino e a força dos clientes, rebaixando adultos autônomos à condição de órfãos indefesos. Essa postura destrói a eficácia terapêutica e a sustentabilidade dos negócios.",
    dinamica_interna:
      "Opera a fantasia de onipotência e a superioridade moral da criança que tentou salvar a mãe da depressão ou o pai do vício. A pessoa acredita secretamente: \"Sem a minha intervenção heróica, esses indivíduos não sobreviverão\". Ajudar compulsivamente é a defesa do ego para não encarar sua própria carência interior.",
    dinamica_externa:
      "Atração sistemática de clientes passivos, queixosos e inadimplentes; prestação de serviços fora de horário comercial e invasão de limites pessoais; gratuidade disfarçada de caridade; burnout severo. Quando o cliente não melhora, o profissional sente-se injustiçado, sem perceber que sua própria postura infantilizou o outro.",
    perguntas_autoindagacao: [
      "A quem na sua história pessoal você está tentando salvar ao acolher esse tipo de cliente ou parceiro?",
      "Você suporta ver o outro passar pelo desconforto do próprio crescimento sem correr para socorrê-lo?",
      "Como seria olhar para os seus clientes e dizer: «Eu respeito a força do seu destino. Eu entrego apenas o meu ofício e confio na sua capacidade de caminhar»?",
    ],
  },
  {
    id: "2.03",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... doar incansavelmente tempo e recursos sem permitir que o outro pague ou retribua com justiça, mantendo meus pares em dívida humilhante para me sentir moralmente superior.",
    titulo: "O Monopólio do Dar",
    subtitulo: "A Dívida Imposta e a Falsa Superioridade",
    reflexao_sistemica:
      "A lagarta alimenta tudo ao redor, mas recusa-se a receber de volta. Em Ordens do Amor, Hellinger elucida que o equilíbrio entre dar e receber é a lei fundamental dos relacionamentos entre iguais. Quem insiste em apenas dar coloca-se em uma altitude moral fictícia e força o outro a uma posição humilhante de devedor perpétuo. Jan Jacob Stam reforça que negócios que não cobram o justo colapsam por quebra relacional.",
    dinamica_interna:
      "Pavor inconsciente de ficar em dívida ou de ser controlado por alguém. A alma aprendeu que \"quem deve fica vulnerável e quem dá tem o controle\". Dar sem medidas é uma estratégia de manipulação relacional para garantir que os parceiros, clientes e colaboradores nunca abandonem o realizador.",
    dinamica_externa:
      "Preços excessivamente baixos com entregas descomunais; clientes que abandonam processos, faltam a sessões ou passam a criticar o serviço (mecanismo psicológico para aliviar a culpa de estarem em débito impagável); sócios folgados que se acomodam nas costas do fundador; caixa da empresa permanentemente desidratado.",
    perguntas_autoindagacao: [
      "Onde e para quem você está entregando muito mais do que foi contratado ou do que o outro pode retribuir?",
      "O que você teme que aconteça se você receber um pagamento integral e parar de dar concessões e descontos?",
      "Quem na sua infância você tentou manter por perto sendo a pessoa boazinha, doadora e indispensável?",
    ],
  },
  {
    id: "2.04",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... usar o acúmulo de patrimônio como arma simbólica contra aqueles que duvidaram de mim, envenenando a prosperidade com o fel do ressentimento.",
    titulo: "O Vingador Financeiro",
    subtitulo: "A Revanche Financeira e o Sucesso como Arma",
    reflexao_sistemica:
      "A lagarta mastiga o solo impulsionada pelo ódio e pela queixa arcaica. O projeto ganha tração não pelo amor à obra ou pelo serviço à vida, mas como uma máquina de retaliação contra parentes, professores ou antigos empregadores que humilharam, subestimaram ou excluíram o realizador no passado. Nas palavras de Hellinger, o sucesso motivado pela vingança atrai perdas severas.",
    dinamica_interna:
      "A alma está acorrentada aos próprios ofensores. Opera o lema: \"Eu vou esfregar a minha riqueza e a minha vitória na cara de todos vocês\". O dinheiro é destituído de sua nobreza sagrada e transformado em munição de guerra contra o passado familiar.",
    dinamica_externa:
      "Comunicação comercial agressiva e polarizada; negociações hostis de soma-zero onde o parceiro precisa perder para o realizador se sentir vitorioso; litígios jurídicos e disputas societárias destrutivas; perdas patrimoniais repentinas provocadas por decisões impulsivas movidas pelo orgulho ferido.",
    perguntas_autoindagacao: [
      "Quem você quer fazer se arrepender ao testemunhar o seu sucesso financeiro?",
      "Se você perdoasse plenamente aqueles que te humilharam ou duvidaram de você, o que restaria da sua ambição?",
      "Você tem coragem de enriquecer em paz, sem precisar provar nada a ninguém?",
    ],
  },
  {
    id: "2.05",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... satisfazer as demandas invisíveis de um parente do passado em vez de olhar nos olhos do cliente real que está diante de mim e paga pelos meus serviços.",
    titulo: "O Cliente Oculto",
    subtitulo: "A Prestação de Contas a um Fantasma do Passado",
    reflexao_sistemica:
      "A lagarta consome energia sem rumo porque seus olhos não miram a folha concreta à sua frente, mas uma miragem. Jan Jacob Stam descreve que empresas perdem vitalidade e vendas quando seus produtos são desenhados para responder a um fantasma do sistema de origem do fundador (um pai crítico, uma mãe exigente, um professor desdenhoso) em vez de atenderem à dor do consumidor do presente.",
    dinamica_interna:
      "Ausência profunda no momento presente. A pessoa olha para o cliente sentado na sua frente ou para o público do evento, mas sua alma está prestando contas inconscientes à mesa de jantar de sua infância, tentando não ser reprovada por figuras de autoridade do passado.",
    dinamica_externa:
      "Propostas comerciais com linguagem excessivamente técnica, hermética e intelectualizada (feitas para impressionar acadêmicos e não para vender); dificuldade crônica de conversão em vendas; o comprador sente uma frieza inexplicável e recua porque percebe que não é ele quem está sendo visto.",
    perguntas_autoindagacao: [
      "Quando você apresenta o seu trabalho ou faz uma proposta, de quem é o olhar que você teme desagradar?",
      "Você está resolvendo a dor do cliente que tem o dinheiro na mão hoje ou tentando convencer alguém do seu passado?",
      "Como seria olhar para o mercado agora e dizer: «Eu deixo os meus fantasmas no passado. Eu trabalho apenas para quem está diante de mim no presente»?",
    ],
  },
  {
    id: "2.06",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... trabalhar obsessivamente como justificativa para fugir da intimidade afetiva, do casamento e da vulnerabilidade da vida a dois.",
    titulo: "A Trincheira contra o Amor",
    subtitulo: "O Trabalho como Fuga da Intimidade Afetiva",
    reflexao_sistemica:
      "A lagarta constrói uma muralha espessa de cascalho ao seu redor para que nada consiga tocá-la. O ativismo profissional contínuo e a agenda lotada são utilizados como álibi moralmente aceito para fugir do desafio maior da existência adulta: a entrega ao amor, a exposição da fragilidade conjugal e a intimidade profunda. O sucesso público compensa o fracasso do vínculo privado.",
    dinamica_interna:
      "Pavor arcaico de ser invadido, sufocado ou rejeitado na intimidade de casal, frequentemente reproduzindo o padrão de pais que viveram casamentos frios ou destrutivos. O trabalho oferece a ilusão reconfortante de controle: com clientes e tarefas há métricas claras; no amor, há vulnerabilidade.",
    dinamica_externa:
      "Trabalho rotineiro até a madrugada e aos fins de semana sob justificativa de \"fase de crescimento\"; solidão crônica ou relacionamentos amorosos superficiais e descartáveis; cobrança e ressentimento dos filhos e do cônjuge; sensação de vazio profundo no peito quando o expediente encerra.",
    perguntas_autoindagacao: [
      "Do que você está fugindo quando se enterra em tarefas até tarde da noite?",
      "O que aconteceria com a sua estrutura interna se você desligasse o celular e ficasse em silêncio diante da pessoa amada?",
      "Você prefere o controle previsível do trabalho ao risco desarmado do amor?",
    ],
  },
  {
    id: "2.07",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... carregar o peso operacional de toda a equipe para preservar a fantasia narcísica de ser indispensável e de que ninguém faz tão bem quanto eu.",
    titulo: "O Mártir que Não Delega",
    subtitulo: "O Mártir Organizacional e a Falsa Onipotência",
    reflexao_sistemica:
      "A lagarta tenta carregar nas costas todos os outros insetos do galho, curvando o próprio corpo até o chão. Em constelações organizacionais, Jan Jacob Stam alerta que o fundador que se recusa a delegar e centraliza tudo em si rouba a dignidade dos colaboradores e infantiliza o sistema. O martírio é o disfarce de um ego que tem pavor de não ser o centro gravitacional.",
    dinamica_interna:
      "A crença infantil: \"Só eu sou confiável; se eu soltar, tudo desmorona\". A pessoa obtém prazer inconsciente em poder se queixar de que \"carrega o mundo nas costas\", usando essa coroa de espinhos para justificar sua arrogância diante dos outros.",
    dinamica_externa:
      "Gargalo operacional absoluto: a empresa só fatura até o limite físico de horas trabalhadas pelo fundador; colaboradores desmotivados, passivos e que não tomam iniciativa (pois sabem que serão desautorizados); crises de ansiedade, insônia e esgotamento muscular.",
    perguntas_autoindagacao: [
      "Qual benefício secreto e ganho secundário você obtém ao poder reclamar que ninguém te ajuda?",
      "O que você teme que aconteça com a sua identidade se a sua equipe demonstrar que pode fazer o trabalho melhor do que você?",
      "Como seria dar um passo atrás e dizer: «Eu confio na competência de vocês. Ocupem os seus lugares e façam a parte que lhes cabe»?",
    ],
  },
  {
    id: "2.08",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... administrar pelo medo do abandono, sufocando a espontaneidade dos processos e das pessoas por desconfiança crônica da vida.",
    titulo: "A Angústia do Controle Rígido",
    subtitulo: "A Tirania do Controle contra o Pânico do Abandono",
    reflexao_sistemica:
      "A lagarta aperta a folha com tanta força que esmaga a seiva da planta. O projeto é gerido sob a égide do terror do caos: normas obsessivas, microgestão sufocante e vigilância constante. Como Hellinger ressalta em A Fonte Não Precisa Perguntar pelo Caminho, a vida opera com movimentos espontâneos; quem tenta controlar o fluxo com rédeas de ferro estrangula a criatividade.",
    dinamica_interna:
      "Memória de uma infância caótica, imprevisível ou marcada por traições e perdas abruptas de estabilidade familiar. Para a criança ferida, \"relaxar significa correr risco de morte\". O controle burocrático atua como ansiolítico psíquico para abafar o pânico interior.",
    dinamica_externa:
      "Alta rotatividade de profissionais talentosos, que recusam a falta de confiança e pedem demissão; processos decisórios lentos e travados; perda de oportunidades inovadoras por aversão patológica a qualquer margem de risco; estresse generalizado no clima da equipe.",
    perguntas_autoindagacao: [
      "O que de pior você imagina que aconteceria se você delegasse uma tarefa importante e não conferisse cada vírgula?",
      "Qual instabilidade ou caos da sua história de infância você está tentando evitar com tanta rigidez?",
      "Como seria respirar fundo, abrir as mãos e dizer internamente: «Eu relaxo o controle. Eu confio no fluxo sábio da vida»?",
    ],
  },
  {
    id: "2.09",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... sustentar a crença cega de que apenas o trabalho exaustivo, doloroso e mal pago tem valor moral, sabotando a facilidade e o prazer de prosperar.",
    titulo: "A Punição pelo Suor Sofrido",
    subtitulo: "A Servidão à Culpa e a Ilusão do Mérito Doloroso",
    reflexao_sistemica:
      "A lagarta arrasta o corpo sobre espinhos voluntariamente, acreditando que a ferida aberta é seu crachá de dignidade. Na sociologia sistêmica, isso reflete a herança de clãs que associaram o trabalho à penitência religiosa e ao castigo bíblico. A facilidade, a fluidez, a tecnologia e o lucro abundante são experimentados na alma com culpa intolerável.",
    dinamica_interna:
      "Solidariedade arcaica com ancestrais camponeses, operários ou escravizados que deixaram o couro na terra. A alma sente: \"Quem sou eu para ganhar dinheiro sentado diante de um computador com alegria, se meus pais e avós sangraram para colocar pão na mesa?\". O sofrimento é a taxa de pertencimento.",
    dinamica_externa:
      "Escolha dos caminhos mais complexos e manuais para tarefas simples; recusa de automações, terceirizações ou softwares que economizariam tempo; culpa aguda ao descansar ou tirar férias; autossabotagem em lançamentos que dão lucro rápido sem muito esforço muscular.",
    perguntas_autoindagacao: [
      "Quem na sua família trabalhou duro até adoecer e dizia que \"nada nesta vida vem fácil\"?",
      "Você se sente culpado ou um trapaceiro quando uma oportunidade lucrativa surge de forma leve e descomplicada?",
      "Como seria olhar para seus antepassados e dizer: «Eu honro o suor pesado de vocês desfrutando da leveza que o meu tempo permite. Olhem com amor pelo meu bem»?",
    ],
  },
  {
    id: "2.10",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "Meu projeto está a serviço de... ditar ordens aos meus superiores ou tratar a liderança com desdém, assumindo o papel de filho rebelde dentro do ambiente corporativo.",
    titulo: "A Inversão na Hierarquia",
    subtitulo: "A Rebeldia na Equipe e o Desrespeito à Ordem",
    reflexao_sistemica:
      "A lagarta recusa a ordem dos galhos e tenta se colocar na copa da árvore antes do tempo. Em Ordens do Amor e A Alma do Negócio, a lei da precedência determina que quem chegou antes tem prioridade sistêmica. Quando um profissional tenta ensinar seus clientes, mandar em seus contratantes ou infantilizar seus chefes, viola a hierarquia e atrai expulsão imediata.",
    dinamica_interna:
      "Rebeldia contra o pai ou a mãe transferida para figuras de autoridade do mundo profissional. A pessoa sente um desprezo arrogante por líderes formais, acreditando que \"esses incompetentes não sabem nada e eu sei tudo\".",
    dinamica_externa:
      "Atritos crônicos com clientes contratantes; demissões abruptas de cargos de liderança; perda de contratos corporativos milionários por insubordinação velada ou posturas de confronto; isolamento em redes profissionais e perda de patrocinadores.",
    perguntas_autoindagacao: [
      "Em quais momentos você se pega julgando ou tentando corrigir seus clientes e chefes em vez de servi-los?",
      "Contra quem da sua família você ainda está lutando quando bate de frente com regras institucionais e lideranças?",
      "Como seria dar um passo atrás, abaixar a cabeça com respeito e dizer: «Eu respeito a ordem e o lugar de vocês. Eu cumpro a minha função com modéstia»?",
    ],
  },
  {
    id: "2.11",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... atender a uma demanda legítima da sociedade, sustentando com paciência o cansaço das repetições diárias e a exigência de constância no ofício.",
    titulo: "O Desgaste da Disciplina Cotidiana",
    subtitulo: "O Serviço Genuíno e o Desgaste Operacional",
    reflexao_sistemica:
      "A lagarta mastiga sua folha com sobriedade: ela sabe que o crescimento na matéria exige tempo e digestão. O projeto está assentado na retidão ética e responde a uma necessidade real do mercado. Contudo, a vida adulta desmancha o conto de fadas: mesmo o mais sagrado dos propósitos é composto por 90% de rotinas monótonas e esforço operacional repetitivo.",
    dinamica_interna:
      "Maturidade de quem enterrou o pensamento mágico infantil. A alma não exige euforia mística para sentar na cadeira e cumprir o dever. O realizador suporta o cansaço limpo do dia com serenidade, sabendo que a constância é a mãe da solidez.",
    dinamica_externa:
      "Execução regular de tarefas burocráticas, contábeis e de atendimento; consistência de entregas mesmo nos dias de desmotivação ou mau tempo; manutenção do foco sem cair no vício de buscar novidades superficiais a cada semana.",
    perguntas_autoindagacao: [
      "Você é capaz de cumprir o dever do seu projeto hoje mesmo sem entusiasmo ou inspiração mágica?",
      "Onde você está fugindo da rotina necessária procurando atalhos sedutores que só dispersam a sua energia?",
      "Como seria se olhar no espelho ao final de um dia exaustivo e sentir a dignidade tranquila do dever cumprido?",
    ],
  },
  {
    id: "2.12",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... praticar o equilíbrio adulto entre dar e receber, bancando o desconforto de precificar com dignidade e recusando relações predatórias de favor.",
    titulo: "A Firmeza na Troca Justa",
    subtitulo: "A Precificação Consciente e o Equilíbrio Comercial",
    reflexao_sistemica:
      "A lagarta toma o alimento que necessita e devolve adubo fertilizante à terra. Em A Alma do Negócio, Jan Jacob Stam demonstra que uma empresa saudável calibra seu \"barômetro de preços\" no ponto ótimo de força: onde o cliente é respeitado como adulto pagante e a empresa recebe a margem necessária para inovar e crescer. Cobrar com justiça é um ato de amor e ordem.",
    dinamica_interna:
      "Paz interior e ausência de culpa ao falar de dinheiro. O profissional reconhece o valor do tempo, dos estudos e da estrutura que coloca à disposição do cliente. Cessa a necessidade infantil de pedir desculpas pelo próprio preço.",
    dinamica_externa:
      "Apresentação de propostas comerciais com segurança inabalável; contratos com cláusulas financeiras claras e sem ambiguidades; perda serena de clientes que buscam favor ou barganha infantil; retenção de clientes comprometidos que valorizam o serviço.",
    perguntas_autoindagacao: [
      "Você sustenta o preço do seu trabalho diante do cliente sem vacilar e sem inventar justificativas inseguras?",
      "O que você sente quando um pagamento volumoso entra na sua conta bancária: merecimento sóbrio ou desconforto?",
      "Como o ato de cobrar com firmeza protege a dignidade e a transformação do seu próprio cliente?",
    ],
  },
  {
    id: "2.13",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... cooperar com maturidade em um projeto comum, administrando divergências técnicas e ruídos de comunicação sem levar os conflitos para o lado pessoal.",
    titulo: "A Gestão dos Atritos de Trabalho",
    subtitulo: "A Cooperação Madura e a Fricção Operacional",
    reflexao_sistemica:
      "Várias lagartas dividem o mesmo galho: a convivência física na matéria gera inevitável atrito mecânico. O projeto opera com parcerias legítimas entre adultos, mas a cooperação humana nunca é isenta de ruídos. O teste sistêmico desta carta é a habilidade de resolver divergências operacionais no plano dos fatos e metas, sem contaminar a relação com dramas infantis.",
    dinamica_interna:
      "Diferenciação psíquica apurada. A pessoa não projeta a carência de ser amada nos colegas de trabalho. O realizador separa com clareza o que é uma discordância metodológica da integridade do vínculo pessoal com o outro.",
    dinamica_externa:
      "Reuniões de alinhamento pragmáticas e objetivas; capacidade de dar e receber feedbacks desconfortáveis sem ressentimento; reajuste ágil de fluxos de trabalho que apresentaram gargalo; respeito mútuo aos talentos e limitações de cada parceiro.",
    perguntas_autoindagacao: [
      "Você consegue divergir tecnicamente de um parceiro sem transformar a discordância em uma guerra emocional?",
      "Quando alguém comete um erro operacional na sua equipe, você corrige o processo ou ataca a pessoa?",
      "Qual conversa difícil de alinhamento você precisa ter hoje para desobstruir o fluxo de trabalho do seu tema?",
    ],
  },
  {
    id: "2.14",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... manter a integridade do propósito, tendo a coragem de recusar contratos lucrativos e convites sedutores que desviariam o projeto do seu eixo.",
    titulo: "A Proteção dos Limites Vitais",
    subtitulo: "A Coragem do 'Não' e a Rejeição Sedutora",
    reflexao_sistemica:
      "A lagarta sabe exatamente qual tipo de folha nutre sua espécie e recusa as bagas venenosas, por mais brilhantes que pareçam. Um projeto focado e adulto enfrenta o desafio das tentações: clientes ricos com demandas tóxicas, convites de sociedades oportunistas ou atalhos fáceis de monetização. A maturidade se prova na capacidade de dizer \"não\".",
    dinamica_interna:
      "Clareza de identidade e integridade de caráter. A pessoa não é movida pelo medo da escassez nem pela ganância cega. O realizador tem a força interna para abrir mão de ganhos imediatos em nome da preservação da sua rota essencial.",
    dinamica_externa:
      "Recusa elegante de clientes desalinhados com o código ético do negócio; proteção inflexível da agenda contra invasões de última hora; manutenção da coerência do posicionamento de marca; sustentabilidade do negócio a longo prazo.",
    perguntas_autoindagacao: [
      "A qual cliente bem pagador ou proposta sedutora você precisa dizer \"não\" para não desvirtuar a alma do seu projeto?",
      "O que você teme perder ao estabelecer fronteiras e horários inegociáveis para o seu atendimento?",
      "Como o seu \"não\" corajoso de hoje protege o seu verdadeiro \"sim\" para o futuro?",
    ],
  },
  {
    id: "2.15",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... ajustar velas diante das mudanças de cenário e da realidade dos fatos, acolhendo as flutuações econômicas sem rebeldia nem vitimismo.",
    titulo: "A Flexibilidade Diante do Mercado",
    subtitulo: "A Curvatura Diante dos Fatos e a Realidade Econômica",
    reflexao_sistemica:
      "Quando o galho balança ao vento da tempestade, a lagarta curva seu corpo em espiral e adere à casca com flexibilidade. A postura fenomenológica de Bert Hellinger exige concordância com o que é: as teorias e planos de negócio devem se curvar perante os dados da realidade. Se o mercado mudou, a mente adulta pivota a estratégia sem teimosia birrenta.",
    dinamica_interna:
      "Desapego intelectual das próprias certezas prévias. A alma não gasta energia amaldiçoando a crise, a inflação ou a concorrência; ela olha nos olhos da situação com sobriedade e pergunta: \"Dado que as coisas são assim, qual é a melhor resposta possível?\".",
    dinamica_externa:
      "Reformulação rápida de formatos e embalagens de produtos; renegociação proativa de contratos de aluguel e fornecedores; adaptação aos canais digitais emergentes; sobrevivência e fortalecimento em ciclos de recessão econômica.",
    perguntas_autoindagacao: [
      "Em que ponto você está insistindo em uma estratégia que a realidade dos números já provou que não funciona?",
      "Você tem a humildade de mudar o seu formato para continuar servindo à essência do seu trabalho?",
      "O que a realidade atual do mercado está convidando você a aprender e transformar agora?",
    ],
  },
  {
    id: "2.16",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... incluir a saúde física e mental do realizador na equação, entendendo que a pausa lúcida não é preguiça, mas parte estrutural da continuidade do trabalho.",
    titulo: "O Respeito ao Corpo e ao Descanso",
    subtitulo: "O Cuidado com o Templo e a Sustentação do Construtor",
    reflexao_sistemica:
      "A lagarta precisa de momentos de imobilidade na sombra para que a digestão celular ocorra. Nenhum negócio cresce sobre o cadáver do seu fundador. O instrumento primário através do qual a alma atua na matéria é o corpo biológico. Ignorar o sono, a água, a nutrição e o silêncio em nome de metas corporativas é uma violência que cobra juros sob a forma de sintomas físicos severos.",
    dinamica_interna:
      "Autocompaixão e reverência pela vida recebida dos pais. Cuidar do corpo é a primeira forma de honrar a mãe e o pai que transmitiram o vaso sagrado da existência biológica. O descanso é assumido sem culpa de impostor.",
    dinamica_externa:
      "Planejamento de folgas e férias no calendário antes de preencher a agenda com clientes; pausas regulares durante a jornada diária para respirar e caminhar; redução do uso de telas à noite; sustentação de energia vital para entregas presenciais densas.",
    perguntas_autoindagacao: [
      "Como está o seu corpo físico hoje enquanto você sustenta este projeto: ele está sendo honrado ou explorado?",
      "O que aconteceria com a sua empresa e seus clientes se a sua saúde física colapsasse nesta semana?",
      "Como seria colocar o seu descanso como um compromisso estratégico tão prioritário quanto a sua reunião mais importante?",
    ],
  },
  {
    id: "2.17",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... organizar finanças, contratos e papéis com rigor e transparência, protegendo as relações contra ambiguidades e disputas futuras.",
    titulo: "A Clareza dos Acordos Formais",
    subtitulo: "A Ordem Jurídica e a Transparência Financeira",
    reflexao_sistemica:
      "A estrutura precisa de linhas nítidas para não colapsar sob o próprio peso. Em constelações organizacionais, Jan Jacob Stam alerta que a informalidade ingênua (\"nós somos amigos, não precisamos de contrato\") é o adubo mais fértil para litígios e traições futuras. O rigor documental e a contabilidade limpa não são friezas burocráticas: são o escudo que protege o amor nos negócios.",
    dinamica_interna:
      "Amor pela ordem e pela verdade transparente dos números. A pessoa renuncia ao medo infantil de olhar para extratos bancários, dívidas e tributos, assumindo a responsabilidade civil e jurídica do mundo adulto.",
    dinamica_externa:
      "Formalização de contratos claros antes da prestação de serviços; fluxo de caixa reconciliado semanalmente; emissão pontual de notas fiscais e pagamento de impostos; governança transparente com sócios e investidores.",
    perguntas_autoindagacao: [
      "Onde a gestão financeira ou contratual deste tema ainda é vaga, negligente ou apoiada em acordos verbais?",
      "O que você tem medo de ver se abrir com rigor as planilhas e os números da sua atividade?",
      "Como a formalização clara dos seus acordos pode trazer paz de espírito para você e seus clientes?",
    ],
  },
  {
    id: "2.18",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... conduzir processos com firmeza e afeto, assumindo o ônus de tomar decisões impopulares, dar limites e direcionar a equipe.",
    titulo: "O Exercício Maduro da Autoridade",
    subtitulo: "A Liderança com Firmeza e Afeto",
    reflexao_sistemica:
      "A lagarta assume a condução de sua própria trilha. O papel de liderança exige a coragem de ocupar o primeiro lugar sem pedir desculpas. Bert Hellinger ensina que a autoridade legítima não tiraniza nem mendiga aprovação: ela serve à ordem do sistema oferecendo clareza e direção segura para que os outros possam cumprir suas funções em paz.",
    dinamica_interna:
      "Força calma de quem renunciou à necessidade de ser o \"queridinho\" de todos. O realizador suporta a dor momentânea de desagradar para preservar a saúde e a continuidade da obra maior.",
    dinamica_externa:
      "Comunicação firme de metas e diretrizes; feedbacks construtivos aplicados no momento certo; demissão respeitosa de colaboradores que não performam ou violam a ética; segurança transmitida aos clientes em momentos de crise.",
    perguntas_autoindagacao: [
      "Onde você está hesitando em exercer sua autoridade por receio de ser visto como \"duro\" ou \"exigente\"?",
      "Qual decisão impopular, demissão ou correção de rota você está adiando aplicar com a sua equipe ou parceiros?",
      "Como a sua firmeza tranquila pode ser um ato de proteção e cuidado com a continuidade de todo o projeto?",
    ],
  },
  {
    id: "2.19",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... olhar de frente para falhas de rota e entregas imperfeitas, usando a realidade dura do feedback para aprimorar os processos sem desmoronar.",
    titulo: "O Aprendizado com o Erro Operacional",
    subtitulo: "A Maturidade Restaurativa e o Feedback da Realidade",
    reflexao_sistemica:
      "A lagarta erra o caminho do galho, cai sobre a terra e simplesmente se levanta para retomar a marcha. Toda obra na matéria é imperfeita e sujeita a falhas. O teste de maturidade do ego adulto é a reação diante da crítica ou da entrega que deu errado: o infantil colapsa em vergonha ou ataca com arrogância defensiva; o adulto repara o dano e aprimora o processo.",
    dinamica_interna:
      "Desidentificação com a fantasia da perfeição impecável. A alma compreende que o erro operacional é apenas a matéria-prima do aprimoramento contínuo, e não um atestado de indignidade moral.",
    dinamica_externa:
      "Políticas justas de devolução e reparação imediata ao cliente lesado; análise fria das causas de falha sem caça a culpados; implementação de melhorias no produto baseadas em críticas reais de usuários; aumento da confiança do mercado pela postura ética.",
    perguntas_autoindagacao: [
      "Como você reage intimamente quando um cliente ou colaborador aponta uma falha sua: com agressividade, desmoronamento ou presença restauradora?",
      "Qual erro recente deste projeto carrega a maior oportunidade de aprendizado estrutural para você?",
      "Você tem a grandeza de dizer com serenidade: «Nós falhamos neste ponto, assumimos a responsabilidade e vamos corrigir agora»?",
    ],
  },
  {
    id: "2.20",
    quadrante_id: 2,
    quadrante_nome: "A Lagarta",
    quadrante_arquetipo: "O Arquétipo da Construção e do Esforço | A Ilusão do Chão",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "Meu projeto está a serviço de... perseverar quando o entusiasmo da novidade já se apagou e o resultado final ainda não chegou, honrando o dever silencioso de cada dia.",
    titulo: "A Sustentação do Meio da Travessia",
    subtitulo: "A Força do Meio do Caminho e a Perseverança Silenciosa",
    reflexao_sistemica:
      "A lagarta já comeu dezenas de folhas, a margem do início sumiu no horizonte e a árvore ainda é imensa. A fase inaugural do Ovo passou com suas paixões e o voo da Borboleta ainda é uma promessa distante. Este é o platô da travessia: onde a maturidade se forja no compromisso silencioso de quem segue caminhando sem necessidade de espetáculo.",
    dinamica_interna:
      "Fidelidade à vocação original. A alma encontra repouso no dever de hoje, liberta tanto da ansiedade do futuro quanto da nostalgia do passado. Há uma calma profunda que brota de concordar com a marcha lenta das coisas.",
    dinamica_externa:
      "Constância diária de publicações, prospecção e atendimentos; estabilização financeira com foco em margem e não apenas em picos de vendas; capacidade de atravessar meses de calmaria comercial com tranquilidade estratégica.",
    perguntas_autoindagacao: [
      "Você é capaz de manter a dedicação e o carinho por este projeto mesmo quando os aplausos e os resultados imediatos rareiam?",
      "O que sustenta o seu compromisso quando o encanto da novidade já se desgastou?",
      "Como seria dar o passo de hoje com o coração em paz, sabendo que o meio do caminho é exatamente onde as asas invisíveis estão sendo tecidas?",
    ],
  },

  // ============================================================================
  // QUADRANTE 3: A CRISÁLIDA (3.01 a 3.20)
  // ============================================================================
  {
    id: "3.01",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... a tentativa infantil e desesperada de fracassar, adoecer ou perder recursos no lugar de alguém amado cuja dor não consigo suportar.",
    titulo: "O Sacrifício Cego ('Eu por Você')",
    subtitulo: "A Culpa Mágica e a Solidariedade na Ruína",
    reflexao_sistemica:
      "A crisálida aperta e asfixia porque o indivíduo tenta entrar no casulo arrastando o caixão de um ente querido. Em Ordens do Amor, Bert Hellinger denomina amor cego a pretensão arcaica da criança que acredita poder desviar a tragédia de um ancestral assumindo o sofrimento em seu lugar. O projeto torna-se um altar sacrificial: fracassa para que a dor familiar continue viva.",
    dinamica_interna:
      "A alma não tolera prosperar enquanto a mãe definha, o irmão sucumbe ao vício ou o pai amarga a falência. Opera o voto silencioso: «Antes eu do que você; se você não pode levantar a cabeça, eu também não terei sucesso». O bem-estar é vivido internamente como uma crueldade diante da desgraça alheia.",
    dinamica_externa:
      "Autossabotagem nos momentos de ápice financeiro; decisões súbitas e inexplicáveis que provocam prejuízos vultosos; atração de doenças físicas ou estafa crônica sempre que o projeto ganha fôlego; sensação constante de asfixia e falta de merecimento da paz.",
    perguntas_autoindagacao: [
      "Diante de quem na sua família você se sente culpado por estar saudável, lúcido e próspero?",
      "Se este projeto falhar completamente, a dor e o infortúnio de quem você estará imitando com lealdade cega?",
      "Como seria olhar nos olhos dessa pessoa amada e dizer: «Eu vejo o seu destino pesado e o respeito. Deixo o que é seu com você e honro a sua vida sendo feliz»?",
    ],
  },
  {
    id: "3.02",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... a expiação por enriquecimentos escusos, traições ou injustiças cometidas por gerações passadas, gerando uma compulsão oculta por destruição material.",
    titulo: "A Dívida Moral Não Paga",
    subtitulo: "A Expiação Familiar e a Reparação Oculta",
    reflexao_sistemica:
      "Na metagenealogia e nas constelações familiares, aquilo que foi adquirido de forma indigna (heranças roubadas, enriquecimento ilícito, exploração cruel de terceiros) deixa uma mancha no sistema. Quando os antepassados não pagam pelo dano, os descendentes experimentam uma necessidade inconsciente de compensação negativa, sabotando seus próprios bens para limpar a honra da linhagem.",
    dinamica_interna:
      "A consciência de clã opera como uma balança implacável. A alma sente: «Nossa família deve algo grave à vida; o dinheiro nas nossas mãos é impuro». O realizador atua como um juiz inconsciente que condena o próprio negócio à ruína para pagar uma dívida que ele não contraiu.",
    dinamica_externa:
      "Perdas patrimoniais sucessivas e sem explicação lógica; atração de multas fiscais pesadas, fraudes ou roubos recorrentes; pavor crônico de ter lucro ou patrimônio acumulado; o dinheiro entra e escorre imediatamente por fendas inesperadas.",
    perguntas_autoindagacao: [
      "Quem no passado da sua família enriqueceu às custas do sofrimento, fraude ou exclusão de outras pessoas?",
      "Você sente que ter dinheiro limpo e abundante é algo perigoso ou moralmente suspeito no seu sistema?",
      "Como seria reconhecer as injustiças dos seus antepassados e dizer: «Eu vejo o que fizeram e deixo a culpa com eles. Escolho prosperar apenas através do meu trabalho honesto e limpo»?",
    ],
  },
  {
    id: "3.03",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... o pavor inconsciente de desfrutar de conforto e abundância, vivenciando a prosperidade como uma ofensa à miséria suportada por meus ancestrais.",
    titulo: "A Lealdade à Escassez",
    subtitulo: "O Pavor da Riqueza e a Honra à Fome Ancestral",
    reflexao_sistemica:
      "O casulo endurece porque a pessoa confunde virtude com penúria. Schützenberger e Hellinger apontam que a fome, a guerra e a migração forçada criam memórias celulares de privação severa. Quando um descendente tem a chance de viver com folga e requinte, a alma registra essa facilidade como uma traição imoral ao sofrimento de pais e avós que comeram o pão que o diabo amassou.",
    dinamica_interna:
      "Sentimento de «má consciência» ao gastar com conforto, descanso ou prazer. A alma sente-se segura e amada pelo clã apenas quando está no sufoco, contando moedas e vivendo no limite da sobrevivência. A escassez funciona como um crachá de honra familiar.",
    dinamica_externa:
      "Precificação absurdamente baixa; incapacidade de desfrutar do dinheiro ganho; compras compulsivas de bens de segunda linha que quebram rápido; recusa em delegar para economizar centavos às custas da própria saúde; medo paralisante de cobranças financeiras.",
    perguntas_autoindagacao: [
      "Quem na sua linhagem passou fome, perdeu terras ou trabalhou até o esgotamento por míseros recursos?",
      "Que voz interna critica você quando você compra algo de valor elevado exclusivamente para o seu deleite pessoal?",
      "Você tem coragem de dizer aos seus antepassados sofredores: «Eu honro a miséria que suportaram vivendo na abundância. Em memória de vocês, eu faço render os meus frutos»?",
    ],
  },
  {
    id: "3.04",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... a paralisia gerada por mortes precoces, falências repentinas ou rupturas traumáticas que nunca foram choradas com dignidade na família.",
    titulo: "O Luto Trancado no Tempo",
    subtitulo: "A Morte Não Chorada e o Congelamento da Alma",
    reflexao_sistemica:
      "A crisálida é o espaço onde a morte deve cumprir sua função transformadora. Porém, se no sistema familiar ocorreu um luto proibido — uma criança que morreu e nunca mais foi mencionada, um suicídio abafado, uma mãe morta no parto —, a dor não processada congela o fluxo de vida. O projeto é tomado por um torpor gélido, repetindo a imobilidade de um túmulo sem flores.",
    dinamica_interna:
      "A energia vital do criador está fixada no cemitério familiar. A alma olha para trás, velando inconscientemente quem partiu sem despedida. Não sobra libido nem entusiasmo para colocar o projeto no mundo: criar novidades soa como um desrespeito à dor silenciada.",
    dinamica_externa:
      "Sensação crônica de cansaço e falta de ar; apatia comercial; lançamentos que esfriam repentinamente na véspera de ir ao ar; adiamento indefinido de decisões estratégicas; clima de melancolia e pesadelo que contamina reuniões de equipe.",
    perguntas_autoindagacao: [
      "Qual morte, perda gestacional ou tragédia nunca pôde ser verdadeiramente chorada com lágrimas e palavras na sua família?",
      "A quem você ainda está velando secretamente quando perde a vontade de agir e se enterra no desânimo?",
      "Como seria acender uma vela no coração para esses mortos e dizer: «Eu vejo a dor da sua partida. Eu choro a sua ausência e agora me volto para os vivos»?",
    ],
  },
  {
    id: "3.05",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... responsabilidades, dívidas emocionais ou decisões que pertencem exclusivamente a pais, sócios ou antecessores, roubando a minha vitalidade.",
    titulo: "O Fardo Alheio nos Ombros",
    subtitulo: "A Mala que Não Te Pertence e a Exaustão do Herdeiro",
    reflexao_sistemica:
      "Em A Fonte Não Precisa Perguntar Pelo Caminho, Hellinger observa que nada cansa mais um ser humano do que carregar o fardo que pertence a outro. Na crisálida, o realizador sente os ombros esmagados não pelo trabalho de seu projeto, mas por ter tomado para si as dívidas fiscais dos pais, os conflitos conjugais da família ou as pendências kármicas de sócios antigos.",
    dinamica_interna:
      "A arrogância disfarçada de piedade: «Eu sou forte, eu aguento carregar a bagagem pesada de vocês». A pessoa se sente nobre e digna de elogios por ser a viga de sustentação de parentes desajustados, sem perceber que está roubando a dignidade deles de arcar com as próprias escolhas.",
    dinamica_externa:
      "Dores físicas crônicas na cervical, coluna e trapézio; a empresa assume custos fixos de familiares ou sócios que não produzem; sensação constante de viver sufocado sem tempo para os próprios desejos; estagnação da expansão comercial por falta de fôlego financeiro.",
    perguntas_autoindagacao: [
      "Qual responsabilidade, processo judicial ou dívida financeira você está pagando que não foi criada pelas suas próprias mãos?",
      "De quem é a mala pesada que você carrega nos ombros por medo de vê-lo sofrer as consequências dos próprios atos?",
      "Você tem a humildade de devolver essa carga ao dono e dizer: «Isso é pesado demais para mim e pertence a você. Eu deixo com você com amor e respeito»?",
    ],
  },
  {
    id: "3.06",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... a repetição inconsciente dos métodos autoritários, frios ou agressivos de quem feriu a família no passado, sob a desculpa de \"não ser vulnerável\".",
    titulo: "A Identificação com a Dureza",
    subtitulo: "A Armadura do Tirano e a Blindagem Emocional",
    reflexao_sistemica:
      "A casca da crisálida petrifica em pedra em vez de seda viva. Nas constelações familiares, quem foi profundamente ferido por um pai rígido, um patrão desumano ou um patriarca tirânico frequentemente adota o comportamento do agressor como mecanismo de defesa biológica. O projeto passa a ser conduzido com mão de ferro, asfixiando clientes e parceiros sob o manto da dureza.",
    dinamica_interna:
      "Pavor absoluto de ser visto como frágil ou indefeso. A alma estabelece a crença: «Se eu for compreensivo e doce, serei destruído como fui no passado; para sobreviver, preciso ser de aço». A crueldade torna-se um escudo protetor contra memórias de desamparo infantil.",
    dinamica_externa:
      "Comunicação empresarial seca, agressiva e impositiva; colaboradores talentosos que se demitem por não suportarem o clima de medo; clientes que se sentem cobrados e intimidados em vez de acolhidos; ambiente de trabalho tenso, desprovido de riso e celebração.",
    perguntas_autoindagacao: [
      "Quem na sua história te machucou com frieza, agressão ou autoritarismo implacável?",
      "Em que momentos você se pega agindo com a mesma dureza gélida daquela pessoa que você jurou nunca imitar?",
      "Como seria desarmar essa armadura pesada e reconhecer: «Eu já cresci. Eu não preciso mais bater antes de ser atingido; agora eu posso ser firme e afetuoso»?",
    ],
  },
  {
    id: "3.07",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... a insistência doentia em manter vivo um produto esgotado, uma sociedade falida ou uma ideia que já cumpriu seu ciclo e precisa de sepultura digna.",
    titulo: "A Recusa em Deixar Morrer",
    subtitulo: "A Teimosia Necrótica e o Apego ao Esgotado",
    reflexao_sistemica:
      "A metamorfose exige a morte celular da lagarta; se a matéria antiga se recusa a dissolver, a crisálida apodrece por dentro. Jan Jacob Stam destaca que projetos, produtos e organizações possuem ciclos biológicos de vida e morte. Insistir em reanimar artificialmente uma sociedade que faliu espiritualmente ou um serviço obsoleto drena a vida do negócio e impede o novo de nascer.",
    dinamica_interna:
      "Terror do vazio e da impotência. O ego infantil interpreta o encerramento natural de um ciclo como um fracasso vergonhoso da sua capacidade. A pessoa prefere a agonia prolongada de carregar um cadáver insepulto ao luto maduro do sepultamento.",
    dinamica_externa:
      "Sangria financeira constante em linhas de produtos que só dão prejuízo; reuniões intermináveis para tentar salvar parcerias societárias falidas; desperdício de tempo e energia tentando convencer clientes que já se foram; negação ostensiva dos dados da realidade.",
    perguntas_autoindagacao: [
      "O que neste tema ou negócio já morreu na prática, mas você continua tentando reanimar por vaidade ou medo?",
      "Qual projeto, sociedade ou formato precisa de um enterro honroso e definitivo hoje para que você volte a respirar?",
      "Você tem a coragem de dizer ao que se foi: «Foi lindo enquanto durou. Cumpriu o seu papel, eu agradeço profundamente e agora deixo você descansar em paz»?",
    ],
  },
  {
    id: "3.08",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... o desprezo intelectual pelas escolhas, pela rusticidade ou pelos erros dos pais, atraindo bloqueios crônicos como castigo pela arrogância.",
    titulo: "O Julgamento aos Antepassados",
    subtitulo: "A Soberba do Juiz Familiar e a Paralisia da Força",
    reflexao_sistemica:
      "Quem se coloca como juiz dos próprios pais perde imediatamente o chão onde pisa. Em Ordens do Amor, Hellinger ensina que quando um filho julga os erros morais, as fraquezas afetivas ou o estilo de vida de seus progenitores, ele perde a força da vida. O peso sentido na crisálida é o castigo sistêmico da arrogância: a pessoa torna-se estéril porque cortou o próprio cordão umbilical com a terra.",
    dinamica_interna:
      "A soberba da alma esclarecida: «Eu sou muito mais consciente, ético e evoluído que meus pais medíocres». Ao rejeitar a lama de onde brotou, a árvore perde as raízes e tomba ao primeiro sopro de vento. O sucesso profissional recua perante o filho arrogante.",
    dinamica_externa:
      "Bloqueios crônicos e inexplicáveis nas vendas; sensação de fraqueza existencial e falta de energia nos momentos decisivos; perda de autoridade perante o mercado e os clientes; atração de colaboradores desrespeitosos que espelham o desdém do criador.",
    perguntas_autoindagacao: [
      "Onde você ainda aponta o dedo moralmente para condenar as atitudes, o casamento ou os erros dos seus pais?",
      "Você tem coragem de admitir que toda a sua inteligência e capacidade de pensar vieram do sangue daqueles que você julga?",
      "Como seria se ajoelhar internamente perante seus pais e dizer: «Eu sou apenas o filho. Vocês são os certos para mim. Eu aceito vocês com tudo o que foi, sem nada julgar»?",
    ],
  },
  {
    id: "3.09",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... o remorso silencioso por estar bem, lúcido e próspero enquanto irmãos ou parentes afundaram no vício, na depressão ou no infortúnio.",
    titulo: "A Culpa por Ter Sobrevivido",
    subtitulo: "A Pena de Quem Ficou de Pé e o Freio do Remorso",
    reflexao_sistemica:
      "A crisálida abriga a síndrome do sobrevivente: o remorso corrosivo daquele que escapou ileso do naufrágio onde os outros pereceram. Walter Toman e Hellinger descrevem a dor oculta dos irmãos bem-sucedidos que veem outros membros da fratria adoecerem mentalmente, caírem na miséria ou se destruírem. Para diminuir a dor de ser o «filho que deu certo», a pessoa coloca pedras no próprio sapato.",
    dinamica_interna:
      "A alma sussurra com vergonha: «Que direito eu tenho de celebrar o brilho das minhas asas se aqueles que compartilharam o mesmo ventre apodreceram na sombra?». A pessoa recua seus voos mais altos para não ferir a suscetibilidade dos parentes fracassados.",
    dinamica_externa:
      "Hesitação em divulgar sucessos e faturamentos; transferência compulsiva de recursos próprios para sustentar parentes folgados ou viciados; criação de problemas artificiais na própria vida para ter do que se queixar nos almoços de família.",
    perguntas_autoindagacao: [
      "Qual irmão, primo ou parente próximo ficou para trás na dor, no vício ou no fracasso enquanto você prosperava?",
      "Você sente necessidade de disfarçar suas conquistas para não despertar o ressentimento ou a tristeza deles?",
      "Como seria dizer a esses irmãos: «Eu lamento o sofrimento de vocês, mas respeito o destino de cada um. Eu levo a minha vida adiante com gratidão e sem culpa»?",
    ],
  },
  {
    id: "3.10",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O peso que meu projeto carrega é... o fechamento absoluto ao contato e à troca, usando a desculpa de \"estar em transformação\" para fugir dos riscos da vida em sociedade.",
    titulo: "A Trincheira do Isolamento",
    subtitulo: "O Casulo como Refúgio e a Fuga da Vida Social",
    reflexao_sistemica:
      "A crisálida deve ser uma estação de passagem, não uma residência perpétua. O casulo é sequestrado pelo medo quando o indivíduo utiliza o pretexto espiritual ou terapêutico de «estar em processo de cura e transformação» para se esconder do mundo real, da competição de mercado e das exigências da convivência humana. A solidão vira uma trincheira covarde contra a vida.",
    dinamica_interna:
      "Terror do contato desarmado. A alma sentiu tanta dor em antigas relações que prefere o entorpecimento seguro da caverna escura. A pessoa teoriza sobre a metamorfose, mas recusa-se a romper a seda protetora para encarar o oxigênio cru da realidade.",
    dinamica_externa:
      "Eterno estudante ou preparador: faz dezenas de cursos e pós-graduações, mas nunca abre a agenda nem atende ninguém; isolamento absoluto em home office sem contato humano; recusa de parcerias e palestras; projeto que vive na teoria e nunca fatura.",
    perguntas_autoindagacao: [
      "De qual dor do contato humano você está fugindo sob o pretexto de «ainda não estar pronto»?",
      "Há quanto tempo você está usando a desculpa da autoanálise e do recolhimento para não encarar o mercado?",
      "Você tem coragem de rasgar o casulo seguro agora e dizer: «Eu saio da toca. Eu aceito o risco e a beleza de viver entre os outros»?",
    ],
  },
  {
    id: "3.11",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a dor necessária e madura de ver hipóteses desmoronarem, desmontando planos prévios para que a realidade mostre sua verdadeira feição.",
    titulo: "A Desconstrução de Certezas Antigas",
    subtitulo: "A Morte dos Dogmas e a Queda das Máscaras",
    reflexao_sistemica:
      "A liquefação das células da lagarta é real e dolorosa: todas as certezas arrogantes construídas no passado são desfeitas no caldeirão da verdade. Esta carta não revela um trauma, mas a nobreza da desilusão madura. Como ensina Hellinger, a desilusão é a maior bênção do caminho interior, pois significa o término definitivo de uma ilusão infantil que asfixiava o projeto.",
    dinamica_interna:
      "A alma adulta assiste à quebra de seus castelos de areia sem desespero. Há um luto lúcido por teorias que pareciam infalíveis, mas que a matéria provou serem inadequadas. O realizador recolhe-se em silêncio humilde para aprender com a realidade concreta dos fatos.",
    dinamica_externa:
      "Cancelamento de metodologias que se tornaram obsoletas; reestruturação profunda do modelo de negócios após feedback duro do público; coragem de admitir perante sócios que a estratégia original falhou; início de um redesenho muito mais sóbrio e eficiente.",
    perguntas_autoindagacao: [
      "Qual certeza pétrea sobre o seu trabalho ou vida acabou de ser destruída pelos fatos?",
      "Você é capaz de agradecer pela desilusão que te livrou de continuar perseguindo uma fantasia ingênua?",
      "Como seria respirar no vazio das certezas perdidas e dizer: «Eu abro mão de saber tudo. Eu me curvo diante da realidade como ela é»?",
    ],
  },
  {
    id: "3.12",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a exigência de suportar períodos de aparente estagnação e falta de retorno visível, enquanto a estrutura se reorganiza nas profundezas.",
    titulo: "A Paciência no Silêncio do Inverno",
    subtitulo: "A Maturação Invisível e a Gestação no Escuro",
    reflexao_sistemica:
      "Na natureza, nada floresce o ano inteiro: a terra fértil necessita do descanso severo do inverno, onde toda a seiva desce para as raízes sob a neve. O peso vivido nesta crisálida é a ascese da paciência: suportar o silêncio do mercado e a aparente falta de resultados sem entrar em desespero neurótico de inventar modismos. A gestação mais profunda ocorre no escuro.",
    dinamica_interna:
      "Fé inabalável nos ritmos biológicos e cósmicos da existência. A alma não exige frutos fora de estação. O realizador habita o silêncio com serenidade, sabendo que as árvores que crescem mais alto são aquelas cujas raízes penetraram mais fundo na escuridão da terra.",
    dinamica_externa:
      "Sustentação financeira e emocional em meses de baixa sazonal; dedicação focada ao estudo, pesquisa, aprimoramento interno de processos e infraestrutura de bastidores; recusa em queimar cartuchos em promoções desesperadas e vazias.",
    perguntas_autoindagacao: [
      "Onde a sua pressa ansiosa está tentando colher mangas em pleno inverno congelante?",
      "Você suporta o silêncio da espera sem preenchê-lo com ativismo tolo e desnecessário?",
      "Como seria confiar plenamente na inteligência do casulo e dizer: «Eu repouso na quietude. No tempo exato da estação, a vida romperá a casca»?",
    ],
  },
  {
    id: "3.13",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a responsabilidade difícil de dissolver contratos e parcerias que chegaram ao fim, agindo com sobriedade e honradez sem criar dramas infantis.",
    titulo: "O Encerramento Ético de Vínculos",
    subtitulo: "A Honra na Despedida e o Fim das Parcerias",
    reflexao_sistemica:
      "Para que duas asas se formem com simetria, os vínculos antigos precisam estar pacificados. Em A Alma do Negócio, Jan Jacob Stam dedica capítulos inteiros à arte da separação limpa: sociedades que chegam ao fim precisam ser encerradas com partilha justa, reconhecimento mútuo dos ganhos e respeito absoluto à história compartilhada. Dissolver com honra liberta ambas as partes para voar.",
    dinamica_interna:
      "Maturidade relacional de alto nível. A alma resiste à tentação infantil de transformar o antigo parceiro em monstro para justificar o divórcio. O realizador carrega o peso da despedida com coração aberto, reconhecendo o que foi bom e o que atingiu seu limite natural.",
    dinamica_externa:
      "Acordos societários de dissolução redigidos com clareza e sem litígio; pagamento correto de indenizações e acertos financeiros; comunicação madura ao mercado sobre a cisão sem fofocas ou denegrimento mútuo; alívio imediato no fluxo de novos negócios.",
    perguntas_autoindagacao: [
      "Qual sociedade, contrato de prestação de serviços ou parceria profissional chegou ao seu limite final?",
      "Você é capaz de se despedir do outro agradecendo pelo que foi compartilhado, sem precisar torná-lo um inimigo?",
      "Como seria sentar à mesa com sobriedade e dizer: «O que construímos juntos teve grande valor. Agora os nossos caminhos se separam, com respeito e bênção mútua»?",
    ],
  },
  {
    id: "3.14",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... o ônus de arcar com perdas financeiras decorrentes de riscos inerentes à atividade, assumindo o preço do aprendizado sem terceirizar culpas.",
    titulo: "A Aceitação Lúcida do Prejuízo",
    subtitulo: "O Preço da Aprendizagem e a Dignidade da Perda",
    reflexao_sistemica:
      "Empreender na matéria envolve risco real de capital: investimentos dão errado, mercados mudam de rumo e apostas estratégicas falham. A postura de adulto aceita o prejuízo como a taxa de matrícula paga à universidade da realidade. Como observa Hellinger, a dor da perda limpa o coração da arrogância e ensina a reverência aos limites da previsão humana.",
    dinamica_interna:
      "Cessa todo o vitimismo e a busca paranoica por culpados ou conspirações. A alma olha para o rombo na conta bancária, respira fundo, engole o orgulho ferido e assume a responsabilidade pelas próprias decisões com dignidade inquebrantável.",
    dinamica_externa:
      "Renegociação sóbria de dívidas sem desespero; corte imediato de custos operacionais para estancar a sangria; assimilação técnica dos erros de cálculo que geraram o prejuízo para não repeti-los; reconstrução paciente da reserva financeira a partir de bases reais.",
    perguntas_autoindagacao: [
      "Qual perda financeira ou prejuízo recente você ainda está remoendo e tentando empurrar a culpa para outros?",
      "Você aceita pagar o preço amargo da realidade pelo aprendizado que essa perda te proporcionou?",
      "Como seria olhar para o dinheiro que se foi e dizer: «Eu paguei caro por esta lição, mas agora eu compreendo. Eu sigo em frente honrando o aprendizado»?",
    ],
  },
  {
    id: "3.15",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a necessidade de cortar linhas de produtos, reduzir excessos de tarefas e desapegar de vaidades secundárias para salvar o cerne da obra.",
    titulo: "A Poda do Supérfluo",
    subtitulo: "A Lâmina da Essência e a Morte das Vaidades",
    reflexao_sistemica:
      "A crisálida é um espaço de precisão milimétrica: não cabe nada além do essencial biológico da nova criatura. Na gestão de negócios e na vida pessoal, o crescimento saudável exige a tesoura de poda. Galhos secos, produtos secundários de baixa margem e tarefas dispersivas sugam a seiva vital do projeto. O peso sentido aqui é a dor do desapego das vaidades.",
    dinamica_interna:
      "O fim da onipotência infantil que queria fazer tudo para todos. A alma reconcilia-se com a sua finitude e com a beleza austera do foco. O realizador tem a coragem de ser menor exteriormente para ser incomensuravelmente mais profundo e verdadeiro no núcleo.",
    dinamica_externa:
      "Extinção corajosa de serviços e produtos que davam muito trabalho e pouco lucro; simplificação radical do organograma da empresa; redução de ferramentas de software redundantes; foco total em apenas um ou dois canais principais de entrega de valor.",
    perguntas_autoindagacao: [
      "Quais tarefas e projetos secundários estão roubando o foco e a energia da entrega principal do seu negócio?",
      "Qual vaidade ou oferta você precisa cortar agora com a lâmina da coragem para salvar a alma da sua obra?",
      "Como seria olhar para o essencial do seu trabalho e dizer: «Eu abro mão de todo o resto. Eu dedico a minha força exclusivamente a este coração pulsante»?",
    ],
  },
  {
    id: "3.16",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a humildade de admitir que a força individual esgotou, abrindo espaço para pedir ajuda profissional, consultoria ou amparo técnico.",
    titulo: "O Reconhecimento da Fragilidade",
    subtitulo: "A Queda do Herói Solitário e o Pedido Maduro de Ajuda",
    reflexao_sistemica:
      "Na crisálida, a lagarta atinge a impotência total: ela já não tem pernas para caminhar e ainda não tem asas para alçar voo. Em Ordens da Ajuda, Hellinger ensina que tomar ajuda de quem realmente sabe e se submeter à orientação técnica de especialistas é o ato supremo da humildade adulta. Ninguém constrói nada grandioso no mundo sozinho.",
    dinamica_interna:
      "Morte do mito do herói autossuficiente. A alma desiste da fantasia de que precisa ser perfeita e invulnerável. Reconhecer a própria limitação técnica ou emocional traz um alívio oceânico: o peso deixa de estar concentrado em um único par de ombros cansados.",
    dinamica_externa:
      "Contratação de consultoria especializada em áreas onde o fundador é leigo (financeiro, jurídico, tecnologia); busca de mentoria ou terapia pessoal para processar bloqueios; delegação real de responsabilidades operacionais a profissionais capacitados.",
    perguntas_autoindagacao: [
      "Em qual área do seu negócio você esgotou a sua capacidade técnica individual e precisa urgentemente de ajuda especializada?",
      "Qual vergonha ou medo impede você de levantar a mão e dizer com honestidade: «Eu não sei fazer isso sozinho»?",
      "Como seria se abrir para receber o amparo de mestres e parceiros técnicos e dizer: «Eu acolho a ajuda de vocês com profunda gratidão e respeito»?",
    ],
  },
  {
    id: "3.17",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a lentidão dos trâmites legais, das regras regulatórias e dos tempos do Estado, demandando paciência cívica e respeito aos processos do mundo.",
    titulo: "O Confronto com a Burocracia Real",
    subtitulo: "A Paciência Cívica e as Leis do Estado",
    reflexao_sistemica:
      "Todo projeto espiritual, criativo ou terapêutico precisa de um corpo jurídico para caminhar no mundo dos homens. Esta carta coloca o realizador diante da dimensão institucional: alvarás, conselhos de classe, tributação, cartórios e regulamentações. Em Jan Jacob Stam, a ordem social maior exige submissão respeitosa às regras da comunidade cívica em que o negócio opera.",
    dinamica_interna:
      "Cessa a rebeldia adolescente contra as leis dos homens. A alma compreende que pagar tributos e cumprir formalidades sanitárias e jurídicas é o preço saudável da cidadania e da ancoragem da obra na realidade concreta.",
    dinamica_externa:
      "Espera paciente pela liberação de licenças e registros de marca no INPI; organização meticulosa de contratos e conformidade com a LGPD; pagamento em dia de tributos e taxas públicas; respeito aos tempos burocráticos sem desespero e sem subornos.",
    perguntas_autoindagacao: [
      "Qual pendência legal, contratual ou fiscal você está negligenciando por preguiça ou aversão à burocracia do mundo?",
      "Você é capaz de respeitar o tempo das instituições públicas e cívicas sem revolta infantil?",
      "Como a regularização plena da estrutura jurídica da sua empresa pode trazer um escudo invisível de proteção para o seu trabalho?",
    ],
  },
  {
    id: "3.18",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... o desapego de ver o projeto crescer e precisar de outros líderes, aceitando que a criação já não depende do olhar onipresente de quem a criou.",
    titulo: "O Passo Atrás do Fundador",
    subtitulo: "A Emancipação da Criatura e o Desapego do Criador",
    reflexao_sistemica:
      "A crisálida prepara o ser para uma vida autônoma: os pais geram os filhos para o mundo, não para si mesmos. Nas constelações organizacionais, Stam adverte sobre o drama do fundador que asfixia a própria empresa por ciúme patológico, querendo que todas as decisões continuem passando por suas mãos. A maturidade espiritual do criador se mede pela sua capacidade de se retirar no momento certo.",
    dinamica_interna:
      "Renúncia generosa ao controle narcísico. O fundador contempla sua criação e compreende: «Você é maior do que eu. Você tem um destino próprio e agora pertence à sociedade e aos clientes». Há um misto sublime de saudade e orgulho maduro.",
    dinamica_externa:
      "Implementação de governança corporativa e sucessão de liderança; empoderamento de diretores e gerentes para tomarem decisões sem consulta prévia ao fundador; redução da carga horária operacional do criador para atuar apenas como conselheiro estratégico.",
    perguntas_autoindagacao: [
      "Em que pontos você está tratando a sua empresa como um filho bebê possessivo que não pode dar um passo sem você?",
      "Você suporta ver seu projeto adotar caminhos e formatos criados por outras pessoas da sua equipe?",
      "Como seria abençoar a autonomia da sua criação e dizer: «Eu te dei a vida. Agora você caminha com as suas próprias pernas a serviço do mundo»?",
    ],
  },
  {
    id: "3.19",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... a sobriedade de constatar as limitações reais de sócios e colaboradores, desistindo de esperar deles aquilo que não têm capacidade de entregar.",
    titulo: "O Fim das Projeções no Outro",
    subtitulo: "A Desilusão Restauradora com Sócios e Pares",
    reflexao_sistemica:
      "A casca escura dissolve todas as ilusões de espelho. Muitas crises societárias e profissionais ocorrem porque o realizador projetou em seus sócios e colaboradores a imagem de salvadores perfeitos, heróis infalíveis ou irmãos ideais. Na crisálida lúcida, essa máscara cai: o outro se revela exatamente como é — um ser humano imperfeito, com limites técnicos, fragilidades emocionais e interesses próprios.",
    dinamica_interna:
      "Perdão e paz através da realidade. A alma liberta os companheiros de jornada do fardo insuportável de terem que ser sobre-humanos para mantê-la feliz. Ao aceitar o limite real do parceiro, estabelece-se uma relação de trabalho sólida e desprovida de cobranças neuróticas.",
    dinamica_externa:
      "Readequação realista de metas e papéis na equipe baseada nas competências verdadeiras de cada um; encerramento de queixas ressentidas sobre «falta de proatividade» de funcionários; contratação de novos perfis para suprir lacunas sem dramas emocionais.",
    perguntas_autoindagacao: [
      "O que você continua exigindo de um sócio ou colaborador que ele já provou repetidas vezes que não tem capacidade de entregar?",
      "Você é capaz de olhar para os limites reais das pessoas da sua equipe com respeito e sobriedade, sem desilusão raivosa?",
      "Como a aceitação da imperfeição humana dos seus pares pode trazer paz imediata à rotina do seu negócio?",
    ],
  },
  {
    id: "3.20",
    quadrante_id: 3,
    quadrante_nome: "A Crisálida",
    quadrante_arquetipo: "O Arquétipo da Morte e Renascimento | O Casulo Escuro e a Alquimia do Peso",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O peso que meu projeto carrega é... o esforço estritamente individual de romper a casca endurecida do casulo, suportando o cansaço da transformação sem esperar salvadores externos.",
    titulo: "A Tensão Solitária da Ruptura",
    subtitulo: "O Esforço Sozinho do Parto e o Limiar das Asas",
    reflexao_sistemica:
      "Ninguém pode abrir a crisálida de fora para dentro: se alguém corta o casulo para ajudar a borboleta, suas asas não recebem o fluido circulatório necessário e ela perece no solo. A metamorfose exige a pressão solitária e vigorosa do próprio ser contra as paredes do casulo. Esta última carta da Crisálida celebra a força incomensurável do realizador que assume o parto do seu próprio destino sem esperar que ninguém o salve.",
    dinamica_interna:
      "Cura radical de qualquer resquício de vitimismo. A alma compreende que a travessia final para a liberdade é intransferível. Há uma dignidade heroica e silenciosa em sustentar o próprio esforço até o limite da casca se fender para a luz.",
    dinamica_externa:
      "Tomada final de decisões difíceis e corajosas que vinham sendo adiadas; lançamento definitivo da nova fase do negócio sem depender da aprovação de terceiros; rompimento com padrões de conforto e segurança anteriores; entrada triunfal na maturidade profissional.",
    perguntas_autoindagacao: [
      "Qual passo final e corajoso depende única e exclusivamente de você, e você ainda estava esperando alguém autorizar ou facilitar?",
      "Você confia na força do seu próprio peito para empurrar as paredes do casulo e vir à luz?",
      "Como seria respirar fundo, reunir toda a sua dignidade e dizer: «Eu rompo a casca. Eu assumo a minha vida inteira e dou à luz as minhas próprias asas»?",
    ],
  },

  // ============================================================================
  // QUADRANTE 4: A BORBOLETA (4.01 a 4.20)
  // ============================================================================
  {
    id: "4.01",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... o perigo de me embriagar com o sucesso inicial, subestimando as leis da matéria e desdenhando das raízes que sustentam o meu voo.",
    titulo: "O Voo Cego de Ícaro",
    subtitulo: "A Embriaguez do Sucesso e a Perda das Raízes",
    reflexao_sistemica:
      "A borboleta que acabou de abrir as asas deslumbra-se com a própria beleza e acredita que o céu não tem limites nem regras. Na mitologia e na fenomenologia de Bert Hellinger, o voo desmedido de Ícaro ilustra a hybris daquele que, ao experimentar o primeiro sopro de prosperidade, corta o cordão de humildade que o unia à terra e aos seus antepassados. O sucesso precoce, quando não enraizado na reverência à origem, desestabiliza o ego e precipita quedas vertiginosas.",
    dinamica_interna:
      "Soberba e desconexão ontológica. A alma diz em silêncio: \"Eu consegui sozinho; sou melhor e mais iluminado que meus pais rústicos\". Esse corte na conexão com o solo seca a seiva vital. Sem lastro ancestral, o indivíduo confunde a força que apenas atravessa o seu canal com um mérito pessoal exclusivo, tornando-se presa fácil da ilusão de onipotência.",
    dinamica_externa:
      "Alavancagem financeira temerária após meses de faturamento recorde; investimentos megalomaníacos sem estudo de viabilidade; ostentação narcísica nas redes sociais que atrai animosidade e processos; desdém pelos antigos parceiros e conselheiros que ajudaram na construção inicial; ruína súbita por quebra de liquidez.",
    perguntas_autoindagacao: [
      "Onde o sucesso recente deste projeto está subindo à sua cabeça e fazendo você se sentir invulnerável ou superior aos outros?",
      "De quem e de quais raízes você se desconectou no momento em que começou a ganhar mais visibilidade e dinheiro?",
      "Como seria olhar para a terra de onde você veio e dizer: «Eu sou apenas um galho desta árvore. Sem as minhas raízes, o meu voo é mera ilusão»?",
    ],
  },
  {
    id: "4.02",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a tentação de usar discursos holísticos e pretensa superioridade de alma para fugir do rigor dos números, dos prazos e da matéria concreta.",
    titulo: "O Refúgio da Falsa Espiritualidade",
    subtitulo: "O Bypass Espiritual e a Fuga da Matéria",
    reflexao_sistemica:
      "A borboleta recusa-se a pousar na lama e nas flores reais da terra, querendo habitar um éter puramente abstrato. Em constelações organizacionais, Jan Jacob Stam alerta contra o \"bypass espiritual\": o uso de chavões sistêmicos, energéticos e transcendentais como disfarce covarde para não encarar contratos, planilhas financeiras, cobranças e obrigações tributárias. Negar a matéria é negar a mãe e a própria vida.",
    dinamica_interna:
      "Medo infantil da gravidade e da responsabilidade mundana. A alma busca um refúgio celestial onde não haja fricção comercial nem julgamentos terrenos. O indivíduo arroga-se o título de \"ser de luz desapegado do vil metal\" para ocultar sua incompetência administrativa e sua recusa em amadurecer.",
    dinamica_externa:
      "Preços vagos baseados em \"troca de energia amorosa\"; relatórios financeiros caóticos e inexistentes; atrasos sistemáticos na entrega sob justificativa de \"estar esperando o fluxo cósmico\"; atração de seguidores deslumbrados, mas incapacidade de pagar o aluguel no final do mês; quebra da empresa por desordem contábil crônica.",
    perguntas_autoindagacao: [
      "Qual responsabilidade prática, financeira ou jurídica você está disfarçando sob um véu de discurso espiritualizado?",
      "Você compreende que cuidar com rigor dos números e dos contratos é a mais alta expressão de respeito e amor à realidade?",
      "Como seria olhar para a matéria crua do seu negócio e dizer: «Eu desço à terra. Honro o sagrado através da minha disciplina concreta»?",
    ],
  },
  {
    id: "4.03",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... o impulso inconsciente de cortar as próprias asas quando a colheita se aproxima, por medo de ultrapassar o patamar de realização da família.",
    titulo: "A Autossabotagem por Culpa",
    subtitulo: "O Medo do Voo Alto e a Culpa do Destaque",
    reflexao_sistemica:
      "A borboleta atinge a copa das árvores, vislumbra a imensidão do vale e, em pânico, dobra as próprias asas e se precipita contra o chão. Anne Ancelin Schützenberger e Bert Hellinger descrevem a neurose de classe e o tabu da lealdade: quando um membro da linhagem atinge um nível de faturamento, fama ou autoridade que ninguém do clã jamais experimentou, a consciência arcaica dispara um alarme de traição. Prosperar dói na alma infantil.",
    dinamica_interna:
      "A angústia da solidão de quem voa alto. Opera a crença secreta: \"Se eu for longe demais, serei desterrado do amor da minha família; ninguém mais me alcançará\". O indivíduo sabota os próprios contratos finais para manter o vínculo seguro com a mediocridade compartilhada da sua tribo de origem.",
    dinamica_externa:
      "Cancelamento de lançamentos vitoriosos na véspera; erros grosseiros cometidos de forma inexplicável em propostas comerciais decisivas; conflitos conjugais ou familiares súbitos que drenam o foco na hora da expansão; recusa a convites internacionais ou parcerias de grande escala por falso pudor.",
    perguntas_autoindagacao: [
      "Qual patamar financeiro ou de autoridade faz você se sentir em dívida ou distante da sua família de origem?",
      "A quem você ainda quer provar que continua sendo uma pessoa simples, sofredora e boazinha para não perder o afeto?",
      "Você tem coragem de sustentar a sua envergadura e dizer ao seu clã: «Eu honro a história de vocês voando alto. Em nome de vocês, eu acolho a minha grandeza»?",
    ],
  },
  {
    id: "4.04",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a necessidade egóica de usar a visibilidade e o prestígio como troféu para humilhar quem não acreditou em mim, atraindo rivalidade e solidão.",
    titulo: "O Brilho que Tenta Ofuscar",
    subtitulo: "O Prestígio como Vingança Narcísica",
    reflexao_sistemica:
      "A borboleta abre as asas coloridas não para polinizar as flores, mas para cegar os olhos daqueles que estão no solo. Quando a expansão profissional é movida pelo ressentimento, o sucesso não traz paz nem serviço à vida: torna-se um ato de vingança narcísica. Nas constelações familiares, quem usa o êxito para humilhar os outros gera um campo de inimizade e atrai concorrentes ferozes que buscam derrubá-lo.",
    dinamica_interna:
      "A ferida da criança humilhada que busca revanche. O indivíduo coleciona seguidores, prêmios e patrimônio apenas como armas simbólicas para esfregar na face dos antigos algozes. A alma permanece prisioneira do olhar alheio, incapaz de experimentar a verdadeira serenidade.",
    dinamica_externa:
      "Comunicação institucional arrogante e reativa; necessidade constante de desmerecer concorrentes e provar que os outros estão defasados; atração de processos por difamação ou ataques públicos de reputação; ambiente de trabalho tóxico onde a equipe serve apenas como espelho para bajular o líder.",
    perguntas_autoindagacao: [
      "Quem você quer que se sinta pequeno ou envergonhado ao assistir ao seu brilho e ao seu crescimento?",
      "O que restaria do seu projeto se você tirasse a necessidade de ter razão e de se vingar do passado?",
      "Como seria colocar os seus talentos a serviço da vida com discrição, sem precisar ofuscar ninguém?",
    ],
  },
  {
    id: "4.05",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a fantasia ingênua de ser um cidadão livre sem vínculos, esquecendo que o galho que me sustenta vem de uma terra e de uma linhagem concretas.",
    titulo: "A Borboleta Desarraigada",
    subtitulo: "A Falsa Liberdade do Nômade sem Origem",
    reflexao_sistemica:
      "A borboleta voa ao sabor de qualquer brisa e gaba-se de não ter pouso fixo nem raiz. Como Joan Garriga aponta em Onde Estão as Moedas?, a verdadeira liberdade não nasce do desenraizamento, mas da integração profunda das origens. Quem renega sua pátria, sua cultura familiar e sua terra natal vive uma pseudoautonomia volátil. As asas precisam do lastro da raiz; sem ele, a borboleta é tragada pela primeira rajada de vento.",
    dinamica_interna:
      "A ilusão do órfão emancipado. A alma acredita que se descolar da família a tornou livre de emaranhamentos. Há um desprezo disfarçado pelas tradições locais e pela sabedoria ancestral. Sem ancoragem no solo original, a criatividade torna-se dispersa e incapaz de gerar frutos duradouros.",
    dinamica_externa:
      "Mudanças incessantes de nicho, marca, cidade e modelo de negócio; incapacidade de consolidar um ecossistema com clientes fiéis; sensação crônica de não pertencimento e vazio existencial; projetos cosmopolitas atraentes na casca, mas desprovidos de densidade humana.",
    perguntas_autoindagacao: [
      "De qual aspecto da sua terra natal, classe social ou história familiar você sente vergonha e tenta se desvencilhar?",
      "Você confunde liberdade autêntica com fuga permanente de compromissos e raízes profundas?",
      "Como seria tocar o solo da sua história com reverência e dizer: «Eu venho deste chão. As minhas asas ganham força quando honro de onde vim»?",
    ],
  },
  {
    id: "4.06",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... um voo conduzido apenas pela oposição obstinada às tradições familiares, continuando aprisionado àquilo que rejeito pelo avesso.",
    titulo: "A Falsa Liberdade do Rebelde",
    subtitulo: "O Voo no Avesso da Tradição Familiar",
    reflexao_sistemica:
      "A borboleta decide voar para o norte unicamente porque seus pais mandaram que ela fosse para o sul. Bert Hellinger demonstra repetidamente que a rebeldia é a forma mais escravizante de dependência: o rebelde continua sendo pautado pelos pais em cada decisão, apenas fazendo exatamente o oposto. A expansão que nasce da contestação não é livre; é uma reação infantil que consome energia preciosa.",
    dinamica_interna:
      "Fidelidade pelo avesso. A alma não escolhe o que é bom, belo e útil; escolhe aquilo que contraria a moral da família de origem. O indivíduo permanece fixado na postura de adolescente contestador, confundindo agressividade com maturidade vocacional.",
    dinamica_externa:
      "Posicionamento comercial construído sobre o ataque ferrenho a métodos clássicos; boicote a normas contratuais por aversão a autoridades; atração de colaboradores anárquicos que reproduzem o motim contra o próprio fundador; desgaste em discussões ideológicas estéreis que não convertem em receita.",
    perguntas_autoindagacao: [
      "Quais escolhas do seu projeto atual foram feitas apenas para afrontar as crenças dos seus pais ou antepassados?",
      "Se a sua família concordasse plenamente com tudo o que você faz, você continuaria defendendo essa bandeira com tanta raiva?",
      "Como seria parar de voar contra o vento e escolher o seu caminho por puro amor à vida, sem precisar desafiar ninguém?",
    ],
  },
  {
    id: "4.07",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... o hábito infantil de voar freneticamente sobre dezenas de campos sem aprofundar raízes em nenhum, confundindo inconstância com liberdade criativa.",
    titulo: "A Dispersão sem Polinização",
    subtitulo: "A Inconstância Disfarçada de Criatividade",
    reflexao_sistemica:
      "A borboleta adeja de flor em flor, mas nunca para o tempo suficiente para beber o néctar ou depositar o pólen: ela apenas agita o ar. Empreendedores com excesso de criatividade e falta de gravidade sistêmica caem na armadilha da dispersão perene. Começam dez projetos monumentais e não concluem nenhum; o medo do compromisso adulto é maquiado como \"perfil multipotencial\".",
    dinamica_interna:
      "Pavor da entrega e da finitude. Fixar-se em um único serviço exige aceitar que as outras opções serão deixadas de lado. A alma infantil recusa o sacrifício da escolha e prefere a anestesia superficial de viver no plano das eternas possibilidades luminosas.",
    dinamica_externa:
      "Lançamento ininterrupto de novos produtos enquanto os anteriores agonizam sem suporte; clientes confusos quanto ao verdadeiro posicionamento da empresa; esgotamento financeiro em protótipos nunca monetizados; reputação de inconstância e falta de confiabilidade no mercado.",
    perguntas_autoindagacao: [
      "Qual é o projeto concreto que você precisa sustentar até o final, resistindo à tentação de criar mais uma novidade?",
      "Do que você está fugindo quando troca de foco no exato momento em que o trabalho exige aprofundamento e constância?",
      "Você é capaz de pousar serenamente sobre uma única flor e cumprir o ciclo completo da polinização?",
    ],
  },
  {
    id: "4.08",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... o recolhimento covarde das próprias asas por atribuir aos outros um poder mágico de destruição, usando o \"mau-olhado\" como desculpa para não ocupar meu espaço.",
    titulo: "O Pavor da Inveja Alheia",
    subtitulo: "O Recolhimento Covarde das Próprias Asas",
    reflexao_sistemica:
      "A borboleta esconde-se debaixo de folhas secas, apavorada de que as outras criaturas do jardim a olhem com ciúmes. Como Hellinger esclarece, o medo da inveja alheia esconde uma soberba disfarçada: a pessoa atribui ao outro o poder onipotente de secar a sua vida e, simultaneamente, acredita que o seu brilho é tão monumental que todos estão obcecados por ela. É a fuga covarde da autoridade.",
    dinamica_interna:
      "Projeção da própria hostilidade reprimida. A pessoa teme a inveja porque ela própria invejou secretamente aqueles que brilharam antes dela. Em vez de assumir a responsabilidade pelas suas asas, refugia-se na superstição paralisante do \"olho gordo\" para justificar o autoapagamento.",
    dinamica_externa:
      "Recusa em divulgar resultados, escrever livros ou ocupar palcos; autopunição financeira após grandes vitórias comerciais; ambiente de trabalho paranoico onde tudo é mantido em segredo absoluto; perda de autoridade perante o público.",
    perguntas_autoindagacao: [
      "A quem você está atribuindo o poder mágico de destruir a sua prosperidade apenas com o olhar?",
      "Onde o medo da inveja é apenas a sua desculpa confortável para não arcar com o peso de ser visto e liderar?",
      "Como seria abrir as asas diante do sol e dizer: «A minha luz não diminui ninguém. Eu ocupo o meu lugar sob a bênção da vida»?",
    ],
  },
  {
    id: "4.09",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a ilusão pueril de que a maturidade extingue todos os problemas, ficando desprevenido e ressentido diante das próximas tempestades da vida.",
    titulo: "A Quimera do Destino Perfeito",
    subtitulo: "A Ilusão da Vida sem Tempestades",
    reflexao_sistemica:
      "A borboleta acredita que, pelo fato de ter superado a crisálida, agora o jardim lhe deve um clima de eterna primavera sem chuva ou predadores. Bert Hellinger reforça que a sabedoria sistêmica não garante uma vida idílica sem perdas: a maturidade não elimina os temporais; ela nos dá a firmeza interior para atravessá-los. A revolta contra o inevitável é a marca da alma infantil.",
    dinamica_interna:
      "Exigência mágica de imunidade existencial. O indivíduo sente que \"já sofreu o suficiente\" na infância e nas fases anteriores, e que agora o universo tem a obrigação moral de fazê-lo prosperar sem qualquer atrito. Quando a primeira crise mercadológica chega, desmorona em vitimismo.",
    dinamica_externa:
      "Falta de provisões financeiras para contingências; desespero e paralisia decisória diante de oscilações normais de faturamento; quebra de relações comerciais ao primeiro sinal de desacordo; sensação de amargura e traição cósmica diante de imprevistos.",
    perguntas_autoindagacao: [
      "Em que ponto você ainda acredita que o sucesso verdadeiro significa a ausência total de conflitos e perdas?",
      "Você está preparado interiormente para sustentar a sua rota mesmo quando os ventos soprarem contrários?",
      "Como seria concordar com a imperfeição da existência e dizer: «Sim à bonança e sim à tempestade. Eu permaneço de pé em qualquer estação»?",
    ],
  },
  {
    id: "4.10",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "A",
    tipo: "ferida",
    categoria: "Ferida, Ego e Emaranhamento",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... o crescimento sustentado na exploração excessiva de pessoas e no desrespeito aos limites do entorno, semeando a ruína da própria reputação.",
    titulo: "A Expansão Predatória",
    subtitulo: "O Crescimento Tóxico e a Exploração do Entorno",
    reflexao_sistemica:
      "A borboleta multiplica-se descontroladamente, devora a própria flora que a sustentava e deixa para trás uma paisagem esterilizada. Jan Jacob Stam pontua que uma organização que cresce desrespeitando as ordens do pertencimento, da hierarquia e do equilíbrio ecológico comete suicídio sistêmico. O crescimento predatório é um tumor: expande o volume destruindo o organismo hospedeiro.",
    dinamica_interna:
      "Ganância cega gerada por um vazio ontológico insaciável. A alma tenta preencher um abismo afetivo através do acúmulo desmedido de poder, funcionários mal pagos e clientes explorados. Falta a sobriedade de quem compreende a medida sagrada do basta.",
    dinamica_externa:
      "Práticas comerciais predatórias com cláusulas abusivas; esgotamento desumano da equipe com metas inatingíveis; descarte de parceiros históricos sem honra; processos trabalhistas volumosos; quebra iminente da reputação da marca pelo boca a boca do mercado.",
    perguntas_autoindagacao: [
      "O crescimento deste projeto está respeitando a dignidade e a saúde das pessoas que trabalham com você?",
      "Onde a sua ambição deixou de ser um serviço à vida e se tornou uma voracidade que consome o ecossistema ao redor?",
      "Você é capaz de escolher o crescimento sustentável e justo, abrindo mão do ganho predatório imediato?",
    ],
  },
  {
    id: "4.11",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... que recebi o patrimônio exato das minhas origens e que a força para agir no mundo nasce de concordar com tudo tal como foi.",
    titulo: "As Moedas Assumidas na Ação",
    subtitulo: "A Concordância Plena com as Origens",
    reflexao_sistemica:
      "Inspirada na obra seminal de Joan Garriga Bacardí (Onde Estão as Moedas?), esta carta inaugura o voo lúcido. A borboleta olha para trás e reconhece que a lagarta, a terra escura e a seiva amarga foram os ingredientes perfeitos que possibilitaram o milagre das suas asas. Não há mais queixas contra os pais, mágoas da infância ou reivindicações ao destino. A gratidão pelas moedas recebidas converte-se em puro combustível de ação.",
    dinamica_interna:
      "Paz profunda e repouso no próprio centro. A alma abraça o ouro, o ferro e o barro da sua história. Cessa a postura de pedinte e inicia-se a de herdeiro legítimo. O indivíduo sente-se abastecido pela força cósmica dos antepassados, operando com firmeza inabalável.",
    dinamica_externa:
      "Capacidade natural de precificar e reter riqueza; relações comerciais baseadas na dignidade e na reciprocidade; segurança serena perante clientes difíceis; cessação definitiva de ciclos de escassez; prosperidade que flui com naturalidade orgânica.",
    perguntas_autoindagacao: [
      "Você já agradeceu sinceramente aos seus pais pelas moedas exatas que recebeu deles, sem pedir nada a mais?",
      "Como muda a sua postura no trabalho quando você percebe que já tem tudo de que necessita para prosperar?",
      "Como seria tocar o solo do seu coração e dizer: «Basta o que recebi. Com essas moedas eu construo a minha vida em paz»?",
    ],
  },
  {
    id: "4.12",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... que o êxito profissional e o fluxo dos recursos refletem a minha capacidade interna de tomar a mãe e dizer sim à vida com amor e respeito.",
    titulo: "A Força que Vem do Olhar Materno",
    subtitulo: "O Êxito como Espelho da Tomada da Mãe",
    reflexao_sistemica:
      "Bert Hellinger estabelece em Êxito na Vida, Êxito na Profissão a correlação ontológica: \"O êxito tem a cara da nossa mãe\". Assim como tomamos a nossa mãe — com sua carne, seus limites, seu leite e sua história —, nós tomamos a nossa profissão e os nossos clientes. Quem reconcilia o coração com a mãe é abraçado pelo dinheiro e pela fecundidade do trabalho. A borboleta voa nutrida pelo leite original da vida.",
    dinamica_interna:
      "O movimento interrompido foi plenamente restaurado. A alma desiste de querer corrigir a mãe e simplesmente descansa no seu colo ancestral. Há uma doçura firme na postura, um olhar aberto e acolhedor que transborda em magnetismo e presença pura.",
    dinamica_externa:
      "Clientes chegam de forma contínua e sentem-se profundamente nutridos pelas entregas; facilidade de atrair abundância material e parcerias prósperas; eliminação da ansiedade pelo futuro financeiro; fluidez na comunicação pública e nos relacionamentos de equipe.",
    perguntas_autoindagacao: [
      "Como está o seu abraço interno à sua mãe hoje: existe acolhimento pleno ou ainda resta alguma queixa na gaveta?",
      "Você percebe como o seu fluxo financeiro abre ou fecha conforme a sua proximidade afetiva com a sua mãe?",
      "Como seria fechar os olhos e dizer a ela: «Querida mamãe, tomo a vida de você com tudo o que custou. Em sua honra, eu serei muito feliz»?",
    ],
  },
  {
    id: "4.13",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a responsabilidade madura de gerir os excedentes com inteligência e retidão ética, garantindo que o fruto de hoje alimente a travessia de amanhã.",
    titulo: "A Administração Sóbria da Colheita",
    subtitulo: "A Gestão Ética dos Excedentes e Reservas",
    reflexao_sistemica:
      "A borboleta alimenta-se do néctar, mas não desperdiça a flor: sua polinização assegura os pomares do ano vindouro. Em constelações organizacionais, Jan Jacob Stam destaca que o verdadeiro lucro não é um troféu de exibição, mas a energia que garante a sobrevivência da organização nas entressafras e viabiliza novos investimentos a serviço da sociedade. A abundância requer a virtude austera da sobriedade.",
    dinamica_interna:
      "Equilíbrio entre generosidade e prudência. A alma renuncia à euforia do consumo exibicionista e assume a postura de guardiã responsável dos recursos. Há reverência pelo dinheiro gerado através do suor honesto e do serviço.",
    dinamica_externa:
      "Constituição de reservas financeiras sólidas para a empresa; diversificação inteligente de investimentos patrimoniais; reinvestimento consistente na capacitação da equipe e na qualidade da entrega; sustentabilidade a longo prazo sem sobressaltos.",
    perguntas_autoindagacao: [
      "Como você está administrando o lucro e a colheita material deste projeto: com impulsividade ou com maturidade estratégica?",
      "Quais reservas e investimentos de segurança precisam ser formalizados para proteger a obra nas próximas estações?",
      "Como o dinheiro em suas mãos pode atuar como uma força de proteção, inovação e bem-estar para o seu ecossistema?",
    ],
  },
  {
    id: "4.14",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a clareza de que voar alto amplia as correntes de vento contrárias, exigindo serenidade emocional e vigor para sustentar decisões de grande impacto.",
    titulo: "A Navegação em Céu Aberto",
    subtitulo: "A Firmeza nos Ventos Fortes da Liderança",
    reflexao_sistemica:
      "Quanto mais alto a borboleta voa, mais velozes e turbulentas são as correntes térmicas do ar. Liderar e ocupar um lugar de destaque no mercado não é um descanso paradisíaco: é a convocação para sustentar decisões difíceis sob tempestade. Como Hellinger ressalta em Ordens da Ajuda, o líder maduro permanece impassível no seu centro, sem se deixar abalar por louvores efêmeros ou críticas ruidosas.",
    dinamica_interna:
      "Coragem serena e clareza de propósito. A alma não procura a aprovação da arquibancada; ela guia-se pela bússola interior da responsabilidade com o todo. Há musculatura emocional para navegar na incerteza sem transferir pânico aos subordinados.",
    dinamica_externa:
      "Tomada firme de decisões estratégicas em cenários de crise; manutenção da calma da equipe em momentos de instabilidade; comunicação transparente com o mercado; capacidade de sustentar o ônus moral e legal do comando com serenidade.",
    perguntas_autoindagacao: [
      "Você está disposto a sustentar o vento frio e forte que sopra sobre quem ocupa a linha de frente da liderança?",
      "Onde a sua necessidade de agradar a todos está enfraquecendo a firmeza das suas decisões empresariais?",
      "Como seria respirar no olho do furacão e dizer: «Eu permaneço firme no meu leme. Sustento a direção com serenidade e afeto»?",
    ],
  },
  {
    id: "4.15",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... que a melhor forma de honrar as dores e os sacrifícios da minha linhagem é gerar empregos, formar pessoas e enriquecer o ecossistema à minha volta.",
    titulo: "A Compensação pelo Bem Gerado",
    subtitulo: "A Riqueza Distribuída e o Impacto Social",
    reflexao_sistemica:
      "A borboleta não guarda o pólen para si: ela fecunda o jardim inteiro, multiplicando as cores e os frutos de todas as árvores. Esta carta encarna o ápice da lei da compensação sistêmica positiva (Hellinger e Stam). A verdadeira riqueza de um empreendimento mede-se pela quantidade de vida que ele nutre: salários justos, fornecedores fortalecidos, alunos transformados e comunidades enriquecidas.",
    dinamica_interna:
      "A alma expande-se para além dos limites do interesse egoísta. O indivíduo compreende que seu negócio é um canal de circulação do bem maior. O enriquecimento pessoal deixa de ser um fim e torna-se a consequência natural do valor gerado para a sociedade.",
    dinamica_externa:
      "Geração de novos postos de trabalho dignos; criação de programas de formação e bolsas para pessoas vocacionadas; impacto comunitário positivo e reconhecido; relações comerciais de extrema confiança e lealdade duradoura.",
    perguntas_autoindagacao: [
      "Quantas vidas e famílias são direta ou indiretamente alimentadas e abençoadas pelo sucesso da sua atividade hoje?",
      "Como o seu negócio pode gerar ainda mais impacto social, riqueza compartilhada e formação para os mais jovens?",
      "Você se alegra em ver seus colaboradores e parceiros enriquecendo e crescendo junto com você?",
    ],
  },
  {
    id: "4.16",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a maturidade de aceitar que nem todos os companheiros de jornada conseguirão acompanhar o ritmo e a amplitude da nova fase.",
    titulo: "A Serenidade na Solidão do Ponto Mais Alto",
    subtitulo: "A Aceitação dos Caminhos Divergentes",
    reflexao_sistemica:
      "Nem todos os seres do solo têm asas para planar nas altas altitudes: querer forçar antigos amigos, parentes ou sócios a acompanharem um voo para o qual não têm vocação é uma violência. Em Ordens do Amor, Hellinger ensina a respeitar o destino e os limites de cada um. O líder adulto suporta a solidão da altitude sem mágoa, liberando aqueles que precisam permanecer em outras etapas do caminho.",
    dinamica_interna:
      "Desapego compassivo. Cessa a necessidade infantil de arrastar todos juntos para salvar o mundo. A alma acolhe o mistério dos destinos desiguais, abençoando com ternura aqueles que tomam caminhos diferentes sem julgá-los inferiores.",
    dinamica_externa:
      "Despedida serena de colaboradores e sócios que não têm mais alinhamento com a nova escala da empresa; fim do ressentimento quando antigas amizades se distanciam; formação de novos círculos de convivência maduros e proporcionais ao momento presente.",
    perguntas_autoindagacao: [
      "A quem você ainda está tentando carregar nas costas para as alturas, desrespeitando o limite e o ritmo dessa pessoa?",
      "Você é capaz de sustentar a solidão nobre de quem assume a vanguarda sem exigir que todos o compreendam?",
      "Como seria olhar para aqueles que ficaram em outras etapas e dizer: «Eu abençoo o caminho de vocês e sigo no meu com amor»?",
    ],
  },
  {
    id: "4.17",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... que a obra é maior do que o realizador, demandando generosidade para abrir espaço para os mais jovens sem apego possessivo ao comando.",
    titulo: "A Preparação do Legado e da Sucessão",
    subtitulo: "A Generosidade com os que Vêm Depois",
    reflexao_sistemica:
      "A vida da borboleta é breve, mas o pólen que ela espalhou assegura a floresta para as gerações que virão. Em constelações organizacionais, Jan Jacob Stam dedica atenção primordial à sucessão: um fundador atinge a imortalidade institucional não quando se eterniza na cadeira, mas quando forma sucessores autônomos e se retira no momento certo para que a obra respire novos ares.",
    dinamica_interna:
      "Superação do narcisismo do fundador. A alma reconhece a precedência do tempo: os mais velhos abrem o caminho e dão lugar aos mais novos. Há uma paz profunda em ver a criação ganhar vida própria nas mãos da geração seguinte.",
    dinamica_externa:
      "Estruturação de programas de governança e sucessão de liderança; documentação de métodos e processos para que a empresa não dependa do fundador; mentoria dedicada aos jovens líderes da organização; saída gradual e planejada do dia a dia executivo.",
    perguntas_autoindagacao: [
      "O seu projeto sobrevive e continua próspero se você se afastar completamente das operações por um ano?",
      "O que impede você de começar a treinar e empoderar agora os novos talentos que levarão a sua obra adiante?",
      "Como seria contemplar a sua criação e dizer: «Eu fiz a minha parte com amor. Agora eu confio o futuro às novas mãos»?",
    ],
  },
  {
    id: "4.18",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... a sabedoria de acolher as contradições do mercado e da convivência, operando com eficácia sem perder a compaixão e a integridade.",
    titulo: "O Abraço da Complexidade Humana",
    subtitulo: "A Acolhida das Contradições sem Perder a Ética",
    reflexao_sistemica:
      "O jardim contém flores perfumadas, espinhos pontiagudos, tempestades e predadores: a borboleta não exige um ecossistema asséptico para voar. Bert Hellinger denomina isso de concordância com o imperfeito. Liderar com maturidade exige abandonar o purismo ingênuo dos fanáticos e saber lidar com as ambiguidades humanas, políticas e mercadológicas mantendo o coração limpo e a retidão ética inegociável.",
    dinamica_interna:
      "Amplitude do coração e transcendência do julgamento moralista binário (certo/errado). A alma adulta compreende que a luz e a sombra coabitam em todas as instituições humanas. Há uma sabedoria flexível que atua com eficácia sem se corromper.",
    dinamica_externa:
      "Habilidade superior de negociação em cenários políticos e corporativos complexos; mediação bem-sucedida de conflitos entre facções divergentes; resiliência institucional em momentos de crise pública; tomada de decisões pragmáticas e éticas.",
    perguntas_autoindagacao: [
      "Onde o seu purismo ou perfeccionismo moral está travando a expansão prática do seu negócio no mundo real?",
      "Você é capaz de trabalhar com eficácia em meio às contradições do mercado sem perder a sua integridade interior?",
      "Como seria olhar para a complexidade humana ao seu redor e dizer: «Eu vejo tudo como é. Ocupo o meu lugar e faço o bem possível»?",
    ],
  },
  {
    id: "4.19",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... o repouso interior de reconhecer que nem tudo pôde ser consertado ou realizado, sentindo gratidão pelo que foi possível entregar dentro dos meus limites.",
    titulo: "A Paz com o Inacabado",
    subtitulo: "O Repouso nos Limites do Possível",
    reflexao_sistemica:
      "Nenhuma borboleta visita todas as flores da Terra; nenhum ser humano soluciona todas as dores da sua família ou do mundo. Em A Fonte Não Precisa Perguntar pelo Caminho, Bert Hellinger ensina que a paz suprema é o recolhimento perante os limites do nosso destino. Fazer as pazes com o que ficou incompleto liberta a alma da culpa e permite contemplar o trabalho realizado com reverência e gratidão.",
    dinamica_interna:
      "Humildade perante o Mistério Maior. A alma desiste de querer ser Deus. Ela reconhece que fez o melhor que pôde com as cartas que recebeu e entrega o restante à correnteza da vida. Cessa qualquer ansiedade de perfeição.",
    dinamica_externa:
      "Fechamento sereno de ciclos profissionais e encerramento de metas sem frustração neurótica; celebração sincera das vitórias reais obtidas pela empresa; transição tranquila para fases de menor ativismo; capacidade de usufruir do repouso sem remorso.",
    perguntas_autoindagacao: [
      "Qual sonho, projeto ou meta você precisa soltar em paz, aceitando que não dependia exclusivamente de você?",
      "Você é capaz de sentir orgulho e gratidão pelo que realizou até hoje, mesmo que nem tudo tenha saído perfeito?",
      "Como seria repousar no silêncio do seu coração e dizer: «Foi o suficiente. Eu cumpri a minha parte com integridade e agora descanso»?",
    ],
  },
  {
    id: "4.20",
    quadrante_id: 4,
    quadrante_nome: "A Borboleta",
    quadrante_arquetipo: "O Arquétipo da Expansão e do Serviço à Vida | O Céu Aberto e a Polinização",
    bloco: "B",
    tipo: "lucido",
    categoria: "Consciência Adulta e Desafios Reais",
    mensagem_completa:
      "O que o campo revela quando me coloco a serviço da vida é... que a borboleta não precisa caçar, acumular nem provar nada: sua beleza consiste em pousar suavemente nas flores, receber o néctar e servir à natureza ajudando a distribuir o pólen da vida.",
    titulo: "O Voo Leve da Polinização",
    subtitulo: "O Serviço Espontâneo e a Abundância sem Esforço",
    reflexao_sistemica:
      "A carta cúpula de todo o Jogo Sistêmico — A Metamorfose da Consciência. Aqui se completa a jornada iniciática da alma: da escuridão do Ovo, passando pelo solo pesado da Lagarta e pelo parto radical da Crisálida, atinge-se o serviço puro. A borboleta não caça como predadora, não vive em regime de escassez e não retém nada para si. Sua existência é uma bênção mútua: ela alimenta-se do néctar abundante e, no mesmo gesto despojado, fertiliza e renova a vida de todo o jardim.",
    dinamica_interna:
      "Concordância incondicional com a realidade (Hellinger). A alma está plenamente integrada aos seus pais, ao seu destino e à sua ancestralidade. Não há carência, medo ou arrogância. A pessoa atua no mundo sem intenção e sem medo: ela é apenas um instrumento lúcido a serviço do amor que cura e fertiliza.",
    dinamica_externa:
      "Prosperidade fluida, contínua e ética; autoridade magnética natural que dispensa artifícios ou agressividade; clientes e oportunidades chegam atraídos pela coerência viva da entrega; impacto profundo e multiplicador na vida de milhares de pessoas; paz, leveza e beleza em cada passo.",
    perguntas_autoindagacao: [
      "Como muda toda a sua rotina quando você percebe que não precisa provar nada, caçar nada, mas apenas entregar seus dons com presença?",
      "Onde e para quem o seu trabalho e a sua presença viva são uma bênção fertilizadora hoje?",
      "Você se autoriza a abrir plenamente as suas asas, descansar na brisa da vida e desfrutar da abundância do jardim?",
    ],
  },
];

export function obterCartasPorQuadrante(quadranteId: 1 | 2 | 3 | 4): CartaMetamorfose[] {
  return CARTAS_METAMORFOSE.filter((c) => c.quadrante_id === quadranteId);
}

export function obterCartaPorId(id: string): CartaMetamorfose | undefined {
  return CARTAS_METAMORFOSE.find((c) => c.id === id);
}
