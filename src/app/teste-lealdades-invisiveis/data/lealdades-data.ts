export interface LealdadeOption {
  letra: "A" | "B" | "C" | "D" | "E" | "F";
  texto: string;
}

export interface LealdadeQuestion {
  id: number;
  tema: string;
  pergunta: string;
  opcoes: LealdadeOption[];
}

export interface LealdadeProfile {
  letra: "A" | "B" | "C" | "D" | "E" | "F";
  nome: string;
  subtitulo: string;
  raizOculta: string;
  sintomas: string;
  passoAdulto: string;
  exercicioSomatico: {
    instrucao: string;
    falas: string[];
  };
}

export const LEALDADES_PERGUNTAS: LealdadeQuestion[] = [
  {
    id: 1,
    tema: "RELAÇÃO COM DINHEIRO, CARREIRA E MOVIMENTO PARA A VIDA",
    pergunta: "Como a abundância material e o sucesso profissional fluem em seu dia a dia?",
    opcoes: [
      { letra: "A", texto: "Sinto que o dinheiro nunca para em minhas mãos; sinto-me invisível para as oportunidades, como se não tivesse direito à fartura e à estabilidade material." },
      { letra: "B", texto: "Minha trajetória profissional e financeira repete ciclos idênticos aos dos meus pais ou avós: crises repentinas, falências ou a mesma estagnação econômica crônica." },
      { letra: "C", texto: "Quando começo a prosperar ou ganhar bem, sinto uma culpa incômoda por superar minha família de origem, e acabo sabotando meus ganhos para continuar pertencendo." },
      { letra: "D", texto: "Trabalho de forma exaustiva e sacrificada para sustentar, socorrer ou cobrir dívidas de parentes e amigos, colocando a necessidade de todos antes da minha própria." },
      { letra: "E", texto: "Minhas escolhas profissionais servem mais para cumprir os sonhos não realizados dos meus pais (ou agradar parceiros) do que para expressar meu dom autêntico." },
      { letra: "F", texto: "Tenho a sensação de que o dinheiro e a prosperidade só têm valor se forem conquistados com dor e sofrimento extremo, vivenciando perdas que parecem expiações do destino." },
    ]
  },
  {
    id: 2,
    tema: "RELAÇÕES AFETIVAS E PARCERIAS DE CASAL",
    pergunta: "Qual é a dinâmica predominante nos seus relacionamentos amorosos?",
    opcoes: [
      { letra: "A", texto: "Vivo com receio crônico da rejeição e do abandono; sinto-me deslocado(a) nas relações, com a sensação de que sou um 'estranho' e logo serei descartado(a)." },
      { letra: "B", texto: "Atraio parceiros que reproduzem exatamente os conflitos, distanciamentos, traições ou vícios presentes no casamento dos meus pais ou antepassados." },
      { letra: "C", texto: "Sinto uma lealdade invisível que me impede de ser mais feliz no amor do que minha mãe ou meu pai; se eles foram solitários ou amargurados, saboto minhas relações." },
      { letra: "D", texto: "Entro nas relações como cuidador(a), enfermeiro(a) ou salvador(a); tento consertar a vida do parceiro e acabo sobrecarregado(a) e desvalorizado(a)." },
      { letra: "E", texto: "Sinto que disputo espaço com fantasmas do passado do parceiro ou dos meus pais; vivencio ciúmes desmedidos ou a sensação de ser um estepe afetivo." },
      { letra: "F", texto: "Atraio parceiros com destinos muito pesados (doenças graves, dívidas impagáveis, vícios) e permaneço na relação absorvendo todo o sofrimento para poupá-los." },
    ]
  },
  {
    id: 3,
    tema: "POSTURA DIANTE DOS PAIS E FAMÍLIA DE ORIGEM",
    pergunta: "Qual o seu lugar emocional em relação à sua linhagem e aos seus pais?",
    opcoes: [
      { letra: "A", texto: "Sinto-me como a 'ovelha negra' ou o 'peixe fora d'água' na família; carrego a dor de não ser visto(a), acolhido(a) ou compreendido(a) em minha essência." },
      { letra: "B", texto: "Critico abertamente as atitudes dos meus pais, mas me flagro repetindo os mesmos comportamentos, falas e decisões que sempre julguei neles." },
      { letra: "C", texto: "Preciso da aprovação dos meus pais para qualquer decisão importante; romper com as expectativas familiares me gera um pânico insuportável de deslealdade." },
      { letra: "D", texto: "Inverto a hierarquia familiar cuidando dos meus pais como se eles fossem meus filhos; assumo as dores, as decisões e os conflitos do casamento deles." },
      { letra: "E", texto: "Tomei partido de um dos meus pais contra o outro (ex.: aliei-me à mãe contra o pai ou vice-versa), funcionando como parceiro(a) emocional ou juiz do casal." },
      { letra: "F", texto: "Olho para os sofrimentos, perdas e lutos dos meus pais ou antepassados e sinto uma vontade inconsciente de tomar o peso deles para mim: 'Eu carrego por você'." },
    ]
  },
  {
    id: 4,
    tema: "SENSAÇÃO CORPORAL, CARGA DIÁRIA E VITALIDADE",
    pergunta: "Como o seu corpo e o seu nível de energia vital reagem ao peso do dia a dia?",
    opcoes: [
      { letra: "A", texto: "Sinto um vazio crônico no peito e uma desconexão interior, como se parte da minha alma estivesse ausente ou como se faltasse alguém essencial ao meu lado." },
      { letra: "B", texto: "Apresento sintomas físicos, queixas corporais ou problemas de saúde que se manifestam nas mesmas idades e circunstâncias em que membros da família adoeceram." },
      { letra: "C", texto: "Fico angustiado(a) e tenso(a) quando a vida fica 'boa e calma demais', criando crises inconscientes porque não suporto a sensação de leveza." },
      { letra: "D", texto: "Carrego uma sobrecarga física e tensional crônica nos ombros e costas, fruto de viver em prontidão contínua para acudir e resolver problemas alheios." },
      { letra: "E", texto: "Minha energia vital oscila drasticamente dependendo do humor ou da aprovação do outro; somatizo angústias não resolvidas da história do casal de origem." },
      { letra: "F", texto: "Acordo com a sensação física de carregar um fardo pesado que não me pertence; tenho inclinação inexplicável pela melancolia, lutos não elaborados e autopunição." },
    ]
  },
  {
    id: 5,
    tema: "REAÇÃO AO PRÓPRIO SUCESSO E RECONHECIMENTO",
    pergunta: "O que acontece em sua vida emocional quando você atinge o êxito?",
    opcoes: [
      { letra: "A", texto: "Mesmo conquistando vitórias expressivas, sinto-me uma fraude ou intruso(a), como se aquele lugar de destaque não me pertencesse e eu não merecesse estar ali." },
      { letra: "B", texto: "Sempre que chego próximo ao ápice de uma realização, algo inesperado acontece e perco tudo, esbarrando em um teto invisível que limita a história familiar." },
      { letra: "C", texto: "O sucesso me causa aflição e medo da exclusão: sinto que, se eu for próspero(a) ou feliz, serei rejeitado(a) ou causarei inveja e mágoa na minha família." },
      { letra: "D", texto: "Quando venço, sinto que não posso usufruir sozinho(a); passo imediatamente a distribuir recursos e a assumir obrigações financeiras de terceiros." },
      { letra: "E", texto: "Conquistei diplomas ou cargos importantes impulsionado(a) pelo desejo inconsciente de vingar as frustrações dos pais ou compensar o que lhes faltou." },
      { letra: "F", texto: "Desconfio da facilidade; acredito que a verdadeira vitória exige sacrifício doloroso, renúncia e provações trágicas para ser legítima." },
    ]
  },
  {
    id: 6,
    tema: "LUGAR NO MUNDO E SENTIMENTO EXISTENCIAL",
    pergunta: "Qual é a sua postura perante os grupos e a sua sensação de propósito na vida?",
    opcoes: [
      { letra: "A", texto: "Passo a vida buscando uma comunidade ou espaço que me acolha, sentindo-me frequentemente incompreendido(a), solitário(a) e desterrado(a)." },
      { letra: "B", texto: "Tenho a sensação de que minha vida é uma cópia de roteiros já vividos; vejo as mesmas tramas familiares se desenrolando ciclicamente em minha trajetória." },
      { letra: "C", texto: "Minha bússola existencial é governada pela lealdade ao clã: prefiro abdicar da minha realização pessoal a desafiar as regras não ditas da minha linhagem." },
      { letra: "D", texto: "Nos grupos profissionais e sociais, assumo compulsoriamente a resolução de crises; sinto que, se eu não intervir, tudo ruirá." },
      { letra: "E", texto: "Sinto que vim ao mundo para mediar conflitos afetivos, unir partes desunidas ou curar as feridas dos relacionamentos alheios." },
      { letra: "F", texto: "Carrego uma reverência melancólica diante da dor alheia, alimentando a crença de que sofrer e passar privações purifica a alma e honra os antepassados." },
    ]
  }
];

export const LEALDADES_PROFILES: Record<string, LealdadeProfile> = {
  "A": {
    letra: "A",
    nome: "O Excluído",
    subtitulo: "Pertencimento e Histórias Esquecidas",
    raizOculta: "Conexão inconsciente com ancestrais ou parentes que foram rejeitados, expulsos, esquecidos ou censurados pelo clã (como abortos não contabilizados, filhos ilegítimos, dependentes químicos, falecidos prematuros ou pessoas envolvidas em escândalos morais). Por lealdade arcaica, sua alma reproduz a dor do banimento para manter a memória do excluído viva no sistema.",
    sintomas: "Sensação crônica de não ter um lugar no mundo ('peixe fora d'água'); medo paralisante de rejeição; sentimento de que não tem o direito de prosperar ou de ser visto; autossabotagem quando ganha visibilidade.",
    passoAdulto: "Concordar que todos têm o mesmo direito sagrado de pertencer. Incluir os esquecidos no próprio coração com reverência, deixando com eles o seu destino e assumindo o próprio lugar de filho(a) no presente.",
    exercicioSomatico: {
      instrucao: "Feche os olhos, visualize à sua frente todos os que foram banidos da linhagem. Incline a cabeça em respeito e declare interiormente que todos têm um bom lugar.",
      falas: [
        "Eu vejo você. Você faz parte da nossa família e da nossa história.",
        "Eu dou a você um bom lugar de honra em meu coração.",
        "Eu tomo o meu lugar de filho(a) e deixo o seu lugar com você.",
        "Vocês vieram antes e eu vim depois. Eu respeito o que foi de vocês."
      ]
    }
  },
  "B": {
    letra: "B",
    nome: "O Repetidor",
    subtitulo: "Padrões que Atravessam Gerações",
    raizOculta: "Expressão do amor infantil que diz aos pais ou avós: 'Eu faço exatamente como você para continuar sendo um dos seus'. Manifesta-se pela repetição involuntária de divórcios, falências na mesma faixa etária, vícios, escolhas de parceiros difíceis ou doenças na exata idade em que os pais sofreram.",
    sintomas: "Sensação de viver um roteiro pré-escrito; frustração ao se perceber cometendo os mesmos erros que antes criticava severamente nos pais; sentimento de impotência perante ciclos que se repetem.",
    passoAdulto: "Compreender que repetir o sofrimento dos antepassados não diminui a dor deles — apenas a duplica inutilmente. A honra legítima está em ter a coragem de fazer diferente, transformando a vida recebida em abundância em memória dos pais.",
    exercicioSomatico: {
      instrucao: "Visualize seus pais e avós atrás de você. Sinta a corrente da vida fluindo das costas para a frente. Vire-se de costas para eles, olhe para a sua vida e dê um passo firme adiante.",
      falas: [
        "Queridos pais, eu honro o seu destino exatamente como foi.",
        "Em sua memória e homenagem, agora eu faço diferente.",
        "Por favor, olhem com benevolência se a minha vida for mais leve e próspera.",
        "Eu deixo o que é seu com você e assumo com coragem o que é meu."
      ]
    }
  },
  "C": {
    letra: "C",
    nome: "O Leal",
    subtitulo: "Fidelidades Invisíveis e Medo do Sucesso",
    raizOculta: "Aprisionamento à chamada 'boa consciência' infantil. O indivíduo associa inconscientemente o enriquecimento, a felicidade plena e o destaque a uma traição à família que viveu na escassez ou na dor. A criança teme ser expulsa se for mais feliz que os pais.",
    sintomas: "Autossabotagem financeira logo após grandes vitórias; culpa, angústia ou mal-estar inexplicável quando a vida está calma e próspera; necessidade compulsiva de agradar e receber validação contínua da família de origem.",
    passoAdulto: "Suportar a má consciência: a coragem de ser mais feliz e realizado do que os pais puderam ser. Entender que os pais sacrificaram suas forças para que os filhos fossem mais longe, e que a estagnação desvaloriza o dom da vida.",
    exercicioSomatico: {
      instrucao: "Coloque a mão no peito, respire fundo e declare interiormente: 'Recebi de vocês o dom da vida; foi suficiente. O restante agora é por minha conta'.",
      falas: [
        "Querida mãe, querido pai, tomo a vida pelo preço total que lhes custou.",
        "O que vocês passaram não foi em vão: farei algo grandioso e bom com a minha existência.",
        "Eu suporto a culpa de ser feliz, próspero(a) e realizado(a).",
        "Vocês continuam sendo meus pais e eu continuo sendo o seu filho querido."
      ]
    }
  },
  "D": {
    letra: "D",
    nome: "O Salvador",
    subtitulo: "Excesso de Responsabilidade e Inversão de Papéis",
    raizOculta: "Violação direta da Lei da Ordem (Hierarquia de Chegada). O filho se coloca como pai ou mãe dos próprios pais, tentando resolver seus casamentos ou salvá-los do sofrimento. Essa arrogância infantil assume responsabilidades alheias por crer que é maior do que quem veio antes.",
    sintomas: "Esgotamento físico e tensional crônico; incapacidade severa de dizer 'não' ou colocar limites; atração por pessoas problemáticas que exigem resgate; sobrecarga profissional por assumir tarefas de equipes inteiras.",
    passoAdulto: "Retornar com humildade ao lugar de pequeno. Reconhecer que os pais são os adultos que sobreviveram para transmitir a vida e que possuem força e dignidade próprias para carregar seus fardos e escolhas.",
    exercicioSomatico: {
      instrucao: "Visualize seus pais como adultos fortes. Incline o tronco em uma reverência profunda, soltando a tensão acumulada nos ombros e no pescoço.",
      falas: [
        "Queridos pais, vocês são os grandes e eu sou apenas o(a) pequeno(a).",
        "Vocês dão e eu recebo. O que é de vocês fica com vocês.",
        "Eu deixo com vocês a responsabilidade e o destino que pertencem a vocês.",
        "Entre vocês como casal eu não interfiro; sou apenas o fruto do amor de vocês."
      ]
    }
  },
  "E": {
    letra: "E",
    nome: "O Herdeiro dos Amores",
    subtitulo: "Relacionamentos, Triangulações e Vínculos",
    raizOculta: "Emaranhamento gerado pela identificação com parceiros anteriores significativos dos pais (noivos do passado, primeiros amores que foram esquecidos ou injustiçados), ou por triangulação afetiva direta ('filhinha do papai' rivalizando com a mãe, ou 'filhinho da mamãe' ocupando o lugar do marido). Na alma, a pessoa permanece ligada aos pais e indisponível para o parceiro real.",
    sintomas: "Dificuldade em se vincular profundamente no amor; atração por parceiros indisponíveis ou casados; ciúme desmedido; sensação de estar sempre disputando espaço com fantasmas do passado; cobranças infantis ao cônjuge para que atue como pai/mãe.",
    passoAdulto: "Sair do casamento dos pais e relacionar-se com o parceiro como iguais (adulto com adulto). Honrar os ex-parceiros dos pais que abriram caminho no sistema para que os pais pudessem se encontrar.",
    exercicioSomatico: {
      instrucao: "Visualize seus pais unidos como casal e diga: 'Vocês são os parceiros certos um para o outro e os pais certos para mim'. Depois, olhe nos olhos do seu parceiro real.",
      falas: [
        "Querida mãe (ou pai), sou apenas seu(sua) filho(a); o seu casamento pertence apenas a vocês dois.",
        "A todos os parceiros que vieram antes no coração dos meus pais: eu os respeito e honro o lugar que abriram para mim.",
        "Ao parceiro(a): 'Eu vejo você como você é. Nesta relação somos equivalentes e iguais.'",
        "Eu tomo 50% da responsabilidade pelo nosso relacionamento e deixo os outros 50% com você."
      ]
    }
  },
  "F": {
    letra: "F",
    nome: "O Carregador",
    subtitulo: "Prosperidade, Perdas e Destinos Difíceis",
    raizOculta: "Preso ao pensamento arcaico da expiação sacrificial: 'Antes eu do que você' ou 'Eu sigo você na dor, na ruína e na morte'. Tentativa de compensar tragédias familiares, mortes precoces na guerra, imigrações dolorosas ou culpas graves de antepassados por meio de autopunição e prejuízos materiais severos.",
    sintomas: "Perdas patrimoniais inexplicáveis; atração pela tristeza melancólica; crença de que a vida só tem mérito se for arrancada com dor e martírio; sensação contínua de carregar pedras invisíveis.",
    passoAdulto: "Compreender que o autossacrifício não repara o passado nem alivia os mortos. A verdadeira compensação nas Ordens do Amor consiste em olhar a dor dos antepassados nos olhos, respeitar a força do destino deles e transformar a vida recebida em ações benéficas e fecundas.",
    exercicioSomatico: {
      instrucao: "Sinta os pés firmes no solo. Olhe espiritualmente para o antepassado que teve o destino mais pesado. Incline-se respeitosamente e peça mentalmente a sua bênção para viver em paz.",
      falas: [
        "Eu respeito o seu destino e deixo o seu peso com você.",
        "Querido(a) antepassado(a), você já pagou o preço; farei algo de muito bom com a minha vida em sua honra.",
        "Agora você descansa em paz, e eu permaneço vivo(a) por mais algum tempo.",
        "Eu tomo a vida pelo preço total que ela custou a vocês e que me custa."
      ]
    }
  }
};
