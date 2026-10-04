import { TipoCronotipo } from "./cronotipo-data";

export interface TopicoPratico {
  numero: number;
  titulo: string;
  conteudo: string;
}

export interface CronotipoReportData {
  tipo: TipoCronotipo;
  titulo: string;
  subtitulo: string;
  arquetipo: string;
  introducao: string;
  fundamentacaoCientifica: {
    caracteristicas: string;
    desafios: string;
    tomadaDeDecisao: string;
    janelaEstudosAlerta: string;
    saudeMentalRegulacao: string;
  };
  topicos: TopicoPratico[];
}

export const CRONOTIPO_REPORTS_MAP: Record<TipoCronotipo, CronotipoReportData> = {
  matutino: {
    tipo: "matutino",
    titulo: "Cronotipo Matutino (Cotovia)",
    subtitulo: "O Ritmo do Amanhecer",
    arquetipo: "Cotovia",
    introducao:
      "Você tende a apresentar maior disposição física e mental nas primeiras horas do dia. Seu organismo costuma responder bem ao despertar precoce e, à medida que o dia avança, sua energia pode naturalmente diminuir.",
    fundamentacaoCientifica: {
      caracteristicas:
        "A preferência circadiana matutina é definida por um ponto médio de sono adiantado em dias livres. Indivíduos deste perfil apresentam maior ativação biológica logo ao despertar, sendo mais ativos no período da manhã e atingindo o pico de rendimento cognitivo por volta do meio-dia.",
      desafios:
        "O principal obstáculo reside na adaptação a turnos de trabalho, estudos ou compromissos sociais que se estendam até a noite. A necessidade de manter a vigília em horários tardios leva ao acúmulo de sonolência e à perda sustentada do estado de alerta.",
      tomadaDeDecisao:
        "Como o raciocínio, o julgamento e a tomada de decisão dependem neurologicamente da integridade do córtex pré-frontal e do sistema límbico, os matutinos tomam decisões mais rápidas e precisas durante a manhã, momento em que a velocidade de processamento de informações e a memória de trabalho estão no ápice.",
      janelaEstudosAlerta:
        "O período ideal para tarefas de alta complexidade cognitiva — como aprendizagem verbal, controle atencional e memória operacional — situa-se entre as primeiras horas da manhã e o meio-dia, acompanhando o pico circadiano.",
      saudeMentalRegulacao:
        "A preservação dos horários regulares de descanso mantém a conectividade funcional entre o córtex pré-frontal e a amígdala. Esse equilíbrio evita a hiperativação da 'rede do medo' (amígdala, córtex cingulado anterior e ínsula), assegurando que o cérebro diferencie corretamente estímulos neutros de ameaçadores, prevenindo estados de ansiedade e reatividade emocional.",
    },
    topicos: [
      {
        numero: 1,
        titulo: "Essência do perfil",
        conteudo:
          "Seu ritmo favorece o início, a organização e a antecipação. Você pode sentir que pensa melhor quando o dia ainda está começando e que determinadas tarefas ficam mais difíceis quando deixadas para a noite.",
      },
      {
        numero: 2,
        titulo: "Energia",
        conteudo:
          "A manhã tende a ser seu período de maior vitalidade, concentração e clareza. Aproveitar essa janela pode reduzir o esforço necessário para realizar tarefas complexas.",
      },
      {
        numero: 3,
        titulo: "Tomada de decisões",
        conteudo:
          "Decisões importantes, planejamento estratégico e atividades que exigem raciocínio podem ser favorecidos durante a manhã, quando sua atenção tende a estar mais disponível.",
      },
      {
        numero: 4,
        titulo: "Trabalho",
        conteudo:
          "Sempre que possível, concentre pela manhã aquilo que exige maior capacidade cognitiva e deixe atividades mais automáticas para os períodos de menor energia.",
      },
      {
        numero: 5,
        titulo: "Estudos",
        conteudo:
          "Leitura, aprendizagem, memorização e resolução de problemas podem ser especialmente produtivas nas primeiras horas do dia.",
      },
      {
        numero: 6,
        titulo: "Exercícios",
        conteudo:
          "Atividades físicas pela manhã podem combinar bem com seu ritmo, especialmente quando existe boa adaptação e aquecimento adequado. O melhor horário, porém, continua sendo aquele que você consegue sustentar com regularidade.",
      },
      {
        numero: 7,
        titulo: "Alimentação",
        conteudo:
          "Uma rotina alimentar regular tende a favorecer energia estável. Dê preferência a refeições nutritivas, com proteínas, fibras, frutas, vegetais e boa hidratação, evitando excesso de alimentos muito pesados logo no início do dia.",
      },
      {
        numero: 8,
        titulo: "Café e estimulantes",
        conteudo:
          "Como sua energia já tende a ser maior pela manhã, observe se o excesso de cafeína está sendo utilizado para compensar privação de sono. O objetivo não é estimular um organismo que já está naturalmente desperto.",
      },
      {
        numero: 9,
        titulo: "Meditação",
        conteudo:
          "A manhã pode ser um excelente momento para práticas contemplativas, respiração ou meditação. Antes que o excesso de estímulos do dia comece, você pode encontrar maior facilidade para estabelecer presença.",
      },
      {
        numero: 10,
        titulo: "Saúde mental",
        conteudo:
          "Seu desafio pode não ser começar, mas reconhecer quando é necessário desacelerar. Existe uma tendência possível a preencher o dia de tarefas e interpretar produtividade como sinônimo de bem-estar.",
      },
      {
        numero: 11,
        titulo: "Desafio principal",
        conteudo:
          "Aprender a respeitar a redução natural de energia ao longo do dia, sem transformar isso em culpa ou sensação de improdutividade.",
      },
      {
        numero: 12,
        titulo: "Vida profissional",
        conteudo:
          "Você pode se beneficiar de uma agenda que preserve suas primeiras horas para atividades de maior complexidade e evite concentrar decisões importantes no final do dia.",
      },
      {
        numero: 13,
        titulo: "Vida pessoal",
        conteudo:
          "O convívio social noturno pode exigir mais esforço. Conhecer esse padrão permite negociar horários sem interpretar sua necessidade de recolhimento como falta de interesse.",
      },
      {
        numero: 14,
        titulo: "Sono",
        conteudo:
          "Manter horários relativamente regulares e respeitar sua tendência natural de dormir mais cedo pode favorecer a qualidade do descanso.",
      },
      {
        numero: 15,
        titulo: "Luz",
        conteudo:
          "A exposição à luz natural pela manhã é especialmente interessante para a organização do ritmo circadiano.",
      },
      {
        numero: 16,
        titulo: "Quando há desalinhamento",
        conteudo:
          "Forçar rotinas noturnas repetidamente pode aumentar sonolência, irritabilidade e queda de desempenho.",
      },
      {
        numero: 17,
        titulo: "Relação com o corpo",
        conteudo:
          "Observe os sinais de cansaço antes de ultrapassar seus limites. Seu corpo pode comunicar necessidade de recolhimento antes que sua mente reconheça.",
      },
      {
        numero: 18,
        titulo: "Realização",
        conteudo:
          "Seu potencial pode aparecer na capacidade de iniciar, organizar, estruturar e transformar intenção em ação.",
      },
      {
        numero: 19,
        titulo: "Atenção emocional",
        conteudo:
          "Cuidado para não exigir de si o mesmo nível de desempenho durante todo o dia. Energia também possui ciclos.",
      },
      {
        numero: 20,
        titulo: "Movimento",
        conteudo:
          "Seu equilíbrio não está em permanecer constantemente ativo, mas em alternar expansão e recuperação.",
      },
      {
        numero: 21,
        titulo: "Uma prática útil",
        conteudo:
          "Comece o dia perguntando: “O que realmente merece minha melhor energia hoje?”",
      },
      {
        numero: 22,
        titulo: "Para estudar",
        conteudo:
          "Priorize conteúdos mais difíceis pela manhã e deixe revisões ou tarefas mecânicas para horários posteriores.",
      },
      {
        numero: 23,
        titulo: "Para trabalhar",
        conteudo:
          "Proteja sua primeira janela de concentração de interrupções desnecessárias.",
      },
      {
        numero: 24,
        titulo: "Para meditar",
        conteudo:
          "Experimente uma prática curta logo ao despertar ou antes de iniciar o trabalho.",
      },
      {
        numero: 25,
        titulo: "Para o esporte",
        conteudo:
          "Teste horários matinais, mas não force exercício imediatamente após acordar se seu corpo ainda estiver em transição.",
      },
      {
        numero: 26,
        titulo: "Para a alimentação",
        conteudo:
          "Evite passar muitas horas sem comer apenas porque sua manhã é produtiva. Regularidade também é cuidado.",
      },
      {
        numero: 27,
        titulo: "Para a saúde mental",
        conteudo:
          "Inclua pausas intencionais antes que o cansaço se transforme em irritabilidade.",
      },
      {
        numero: 28,
        titulo: "Para as relações",
        conteudo:
          "Comunique seu ritmo em vez de esperar que as pessoas o compreendam automaticamente.",
      },
      {
        numero: 29,
        titulo: "Seu aprendizado",
        conteudo:
          "Você não precisa utilizar toda a sua energia disponível apenas porque ela está disponível.",
      },
      {
        numero: 30,
        titulo: "Síntese",
        conteudo:
          "Seu convite é aprender a começar com presença e terminar com consciência. A sabedoria do seu ritmo está em reconhecer que produtividade não é permanecer em alta, mas saber quando agir e quando repousar.",
      },
    ],
  },

  intermediario: {
    tipo: "intermediario",
    titulo: "Cronotipo Intermediário (Urso)",
    subtitulo: "O Ritmo da Adaptação",
    arquetipo: "Urso",
    introducao:
      "Você tende a apresentar maior flexibilidade entre os extremos matutino e vespertino. Seu organismo pode se adaptar com relativa facilidade a diferentes horários, desde que exista regularidade suficiente para preservar o sono.",
    fundamentacaoCientifica: {
      caracteristicas:
        "Representa o padrão em que a fase do sono e o pico de alerta estão posicionados entre os dois extremos, abrangendo a maior parte da população.",
      desafios:
        "Embora possuam boa capacidade de adaptação às rotinas sociais convencionais, grandes variações nos horários de dormir e acordar entre dias úteis e fins de semana podem desencadear jetlag social moderado, gerando sonolência diurna e episódios de microssono.",
      tomadaDeDecisao:
        "Neurologicamente a capacidade de decisão, o planejamento executivo e a memória de trabalho mantêm-se estáveis entre o meio da manhã e o meio da tarde, período de melhor equilíbrio no funcionamento do lobo frontal.",
      janelaEstudosAlerta:
        "O aprendizado, a síntese de informações e o foco atencional são mais eficientes no período central do dia (aproximadamente das 09h às 16h), alinhados às oscilações fisiológicas normais do ritmo circadiano.",
      saudeMentalRegulacao:
        "A estabilidade psicológica é favorecida pela adoção dos princípios de saúde do sono (priorizar, personalizar e proteger o tempo de descanso). Garantir a duração adequada do sono previne distorções perceptuais, mantém a regulação emocional e evita estados de hiperalerta fisiológico.",
    },
    topicos: [
      {
        numero: 1,
        titulo: "Essência do perfil",
        conteudo:
          "Sua característica mais marcante pode ser a capacidade de transitar entre diferentes períodos do dia sem grandes prejuízos.",
      },
      {
        numero: 2,
        titulo: "Energia",
        conteudo:
          "Sua disposição tende a distribuir-se de maneira mais equilibrada ao longo do dia.",
      },
      {
        numero: 3,
        titulo: "Tomada de decisões",
        conteudo:
          "Você pode apresentar boa capacidade de decisão em diferentes horários, mas ainda assim é importante identificar suas próprias janelas de maior clareza.",
      },
      {
        numero: 4,
        titulo: "Trabalho",
        conteudo:
          "A flexibilidade pode ser uma vantagem profissional, especialmente em rotinas que exigem adaptação.",
      },
      {
        numero: 5,
        titulo: "Estudos",
        conteudo:
          "Experimente diferentes períodos e observe quando sua concentração, memória e compreensão ficam melhores.",
      },
      {
        numero: 6,
        titulo: "Exercícios",
        conteudo:
          "Manhã, tarde ou início da noite podem funcionar bem. O melhor horário será aquele em que você consegue manter constância.",
      },
      {
        numero: 7,
        titulo: "Alimentação",
        conteudo:
          "A regularidade tende a ser mais importante do que buscar uma alimentação específica para seu cronotipo. Priorize qualidade, variedade, hidratação e horários coerentes.",
      },
      {
        numero: 8,
        titulo: "Café e estimulantes",
        conteudo:
          "Observe se a cafeína está complementando sua rotina ou mascarando noites insuficientes de sono.",
      },
      {
        numero: 9,
        titulo: "Meditação",
        conteudo:
          "Você pode experimentar diferentes horários. O melhor momento será aquele em que sua mente consegue sustentar presença sem transformar a prática em mais uma obrigação.",
      },
      {
        numero: 10,
        titulo: "Saúde mental",
        conteudo:
          "Sua flexibilidade pode fazer com que você se adapte facilmente às demandas externas — mas isso também pode fazer com que você ignore seus próprios limites.",
      },
      {
        numero: 11,
        titulo: "Desafio principal",
        conteudo:
          "Não confundir capacidade de adaptação com necessidade de estar sempre disponível.",
      },
      {
        numero: 12,
        titulo: "Vida profissional",
        conteudo:
          "Você pode aproveitar sua flexibilidade para organizar tarefas conforme demandas e prioridades, sem abrir mão de pausas.",
      },
      {
        numero: 13,
        titulo: "Vida pessoal",
        conteudo:
          "Seu perfil pode facilitar a convivência com pessoas de ritmos diferentes.",
      },
      {
        numero: 14,
        titulo: "Sono",
        conteudo:
          "A flexibilidade não elimina a necessidade de regularidade. Variar excessivamente horários pode prejudicar a organização circadiana.",
      },
      {
        numero: 15,
        titulo: "Luz",
        conteudo:
          "A exposição à luz natural durante o dia ajuda a manter o relógio biológico sincronizado.",
      },
      {
        numero: 16,
        titulo: "Quando há desalinhamento",
        conteudo:
          "Mesmo um organismo relativamente adaptável pode sofrer quando há privação de sono ou mudanças constantes de horário.",
      },
      {
        numero: 17,
        titulo: "Relação com o corpo",
        conteudo:
          "Seu corpo pode tolerar adaptações por algum tempo, mas tolerância não significa ausência de custo.",
      },
      {
        numero: 18,
        titulo: "Realização",
        conteudo:
          "Seu potencial pode aparecer na capacidade de conciliar diferentes demandas sem perder completamente o eixo.",
      },
      {
        numero: 19,
        titulo: "Atenção emocional",
        conteudo:
          "Observe a tendência a dizer “eu dou conta” mesmo quando seu organismo pede pausa.",
      },
      {
        numero: 20,
        titulo: "Movimento",
        conteudo:
          "O equilíbrio para você está menos em encontrar um horário perfeito e mais em construir uma rotina sustentável.",
      },
      {
        numero: 21,
        titulo: "Uma prática útil",
        conteudo:
          "Pergunte diariamente: “Estou me adaptando porque escolhi ou porque estou ultrapassando meus limites?”",
      },
      {
        numero: 22,
        titulo: "Para estudar",
        conteudo:
          "Teste manhã, tarde e início da noite e identifique seu período de maior retenção.",
      },
      {
        numero: 23,
        titulo: "Para trabalhar",
        conteudo:
          "Use sua flexibilidade para alternar tarefas cognitivas, criativas e operacionais.",
      },
      {
        numero: 24,
        titulo: "Para meditar",
        conteudo:
          "Escolha o horário em que a prática tenha maior chance de se tornar consistente.",
      },
      {
        numero: 25,
        titulo: "Para o esporte",
        conteudo:
          "A regularidade provavelmente será mais importante do que buscar um horário biologicamente “perfeito”.",
      },
      {
        numero: 26,
        titulo: "Para a alimentação",
        conteudo:
          "Evite que a flexibilidade de horários transforme-se em alimentação desorganizada.",
      },
      {
        numero: 27,
        titulo: "Para a saúde mental",
        conteudo:
          "Reserve períodos do dia sem produtividade obrigatória.",
      },
      {
        numero: 28,
        titulo: "Para as relações",
        conteudo:
          "Sua capacidade de adaptação pode ser uma ponte, mas não precisa significar sempre ceder ao ritmo do outro.",
      },
      {
        numero: 29,
        titulo: "Seu aprendizado",
        conteudo:
          "Flexibilidade é uma potência quando existe centro; sem consciência, pode transformar-se em dispersão.",
      },
      {
        numero: 30,
        titulo: "Síntese",
        conteudo:
          "Seu convite é encontrar equilíbrio entre adaptação e limite. Assim como no Yin-Yang, equilíbrio não significa imobilidade: significa capacidade de ajustar-se sem perder a própria essência.",
      },
    ],
  },

  vespertino: {
    tipo: "vespertino",
    titulo: "Cronotipo Vespertino (Coruja)",
    subtitulo: "O Ritmo do Entardecer",
    arquetipo: "Coruja",
    introducao:
      "Você tende a apresentar maior disposição, criatividade e alerta em períodos mais tardios do dia. Para você, o início da manhã pode representar um período de transição, enquanto sua energia ganha força ao longo das horas.",
    fundamentacaoCientifica: {
      caracteristicas:
        "Caracteriza-se por uma preferência por horários noturnos e por uma fase de entrada do sono atrasada nos dias de folga. Vespertinos acumulam ativação fisiológica e alerta gradativamente ao longo do dia, alcançando o máximo desempenho cognitivo no final da tarde e durante a noite.",
      desafios:
        "Enfrentam frequentemente o jetlag social — o desalinhamento crônico entre o tempo biológico interno e as exigências das rotinas sociais e de trabalho. Esse conflito resulta em privação de sono, associada ao aumento de marcadores inflamatórios (proteína C reativa), alteração na secreção de cortisol e elevação do risco cardiometabólico (obesidade, diabetes e hipertensão).",
      tomadaDeDecisao:
        "Sob exigências precoces pela manhã, apresentam aumento no tempo requerido para tomar decisões, neurologicamente menor eficiência no processamento executivo e maior probabilidade de erros no ambiente de trabalho. A capacidade decisória e a resolução de problemas complexos otimizam-se nas horas vespertinas e noturnas.",
      janelaEstudosAlerta:
        "As atividades intelectuais e de aprendizado têm seu melhor rendimento no final da tarde e à noite, quando o alerta circadiano e a regulação das redes atencionais atingem o ponto máximo.",
      saudeMentalRegulacao:
        "O desalinhamento circadiano crônico enfraquece a modulação do córtex pré-frontal sobre as estruturas límbicas, potencializando reações emocionais aversivas. Isso favorece o aparecimento de traços ansiosos-ruminativos, hiperexcitação cortical e maior vulnerabilidade a transtornos do humor.",
    },
    topicos: [
      {
        numero: 1,
        titulo: "Essência do perfil",
        conteudo:
          "Seu organismo pode precisar de mais tempo para atingir seu melhor estado de alerta. Isso não significa falta de disposição, mas uma distribuição diferente da energia.",
      },
      {
        numero: 2,
        titulo: "Energia",
        conteudo:
          "A tarde e o início da noite podem representar períodos de maior vitalidade e concentração.",
      },
      {
        numero: 3,
        titulo: "Tomada de decisões",
        conteudo:
          "Quando possível, decisões complexas e tarefas criativas podem ser deslocadas para períodos nos quais você percebe maior clareza mental.",
      },
      {
        numero: 4,
        titulo: "Trabalho",
        conteudo:
          "Rotinas que permitem alguma flexibilidade de horário podem favorecer seu desempenho.",
      },
      {
        numero: 5,
        titulo: "Estudos",
        conteudo:
          "Você pode apresentar melhor concentração no final da tarde ou início da noite, desde que isso não comprometa o horário de sono.",
      },
      {
        numero: 6,
        titulo: "Exercícios",
        conteudo:
          "A tarde pode ser um período interessante para atividades físicas, quando o corpo já está mais desperto e aquecido.",
      },
      {
        numero: 7,
        titulo: "Alimentação",
        conteudo:
          "Evite utilizar sua maior energia noturna como justificativa para concentrar grande parte da alimentação no final do dia. Regularidade e qualidade continuam sendo fundamentais.",
      },
      {
        numero: 8,
        titulo: "Café e estimulantes",
        conteudo:
          "Atenção especial à cafeína no período da tarde e noite. Estimular um organismo já naturalmente vespertino pode atrasar ainda mais o sono.",
      },
      {
        numero: 9,
        titulo: "Meditação",
        conteudo:
          "O início da noite pode ser um momento interessante para uma prática de desaceleração, ajudando a fazer a transição entre atividade e repouso.",
      },
      {
        numero: 10,
        titulo: "Saúde mental",
        conteudo:
          "Seu maior desafio pode ser viver em uma sociedade estruturada predominantemente para pessoas que funcionam mais cedo.",
      },
      {
        numero: 11,
        titulo: "Desafio principal",
        conteudo:
          "Não transformar a dificuldade de acordar cedo em julgamento sobre sua disciplina, capacidade ou valor pessoal.",
      },
      {
        numero: 12,
        titulo: "Vida profissional",
        conteudo:
          "Quando possível, concentre tarefas de maior exigência cognitiva nos períodos em que sua mente está mais desperta.",
      },
      {
        numero: 13,
        titulo: "Vida pessoal",
        conteudo:
          "Você pode naturalmente ter mais energia para encontros e atividades no final do dia.",
      },
      {
        numero: 14,
        titulo: "Sono",
        conteudo:
          "O cuidado central é não transformar seu padrão vespertino em privação crônica de sono por precisar cumprir horários muito antecipados.",
      },
      {
        numero: 15,
        titulo: "Luz",
        conteudo:
          "A luz é um dos principais sinalizadores do relógio circadiano. A exposição à luz pela manhã pode ajudar na sincronização do ciclo sono-vigília.",
      },
      {
        numero: 16,
        titulo: "Quando há desalinhamento",
        conteudo:
          "Acordar muito antes do seu horário biológico, repetidamente, pode produzir sensação de “ressaca de sono”, lentidão e irritabilidade.",
      },
      {
        numero: 17,
        titulo: "Relação com o corpo",
        conteudo:
          "Seu organismo pode precisar de uma transição gradual entre sono e plena atividade.",
      },
      {
        numero: 18,
        titulo: "Realização",
        conteudo:
          "Sua criatividade, elaboração e capacidade de aprofundamento podem ganhar força quando você encontra espaço para trabalhar em horários compatíveis com seu ritmo.",
      },
      {
        numero: 19,
        titulo: "Atenção emocional",
        conteudo:
          "Evite comparar sua produtividade matinal com a de pessoas que possuem outro cronotipo.",
      },
      {
        numero: 20,
        titulo: "Movimento",
        conteudo:
          "Seu equilíbrio pode estar em respeitar seu horário de expansão sem permitir que a noite se transforme em extensão infinita do dia.",
      },
      {
        numero: 21,
        titulo: "Uma prática útil",
        conteudo:
          "Pergunte: “Como posso preservar minha energia sem precisar lutar contra o relógio?”",
      },
      {
        numero: 22,
        titulo: "Para estudar",
        conteudo:
          "Experimente concentrar conteúdos mais complexos no final da tarde ou início da noite.",
      },
      {
        numero: 23,
        titulo: "Para trabalhar",
        conteudo:
          "Se houver flexibilidade, reserve o período de maior alerta para atividades estratégicas ou criativas.",
      },
      {
        numero: 24,
        titulo: "Para meditar",
        conteudo:
          "Uma prática no início da noite pode ajudar a sinalizar ao organismo que o período de atividade está terminando.",
      },
      {
        numero: 25,
        titulo: "Para o esporte",
        conteudo:
          "A tarde pode oferecer uma boa janela para exercícios, mas respeite o impacto de atividades muito intensas próximas ao horário de dormir.",
      },
      {
        numero: 26,
        titulo: "Para a alimentação",
        conteudo:
          "Evite compensar a privação de energia diurna com excesso alimentar no período noturno.",
      },
      {
        numero: 27,
        titulo: "Para a saúde mental",
        conteudo:
          "Proteja o sono. A adaptação constante a horários muito antecipados pode cobrar um preço emocional e cognitivo.",
      },
      {
        numero: 28,
        titulo: "Para as relações",
        conteudo:
          "Explique seu ritmo sem transformá-lo em identidade rígida. O objetivo é criar compreensão, não justificar todos os comportamentos pelo cronotipo.",
      },
      {
        numero: 29,
        titulo: "Seu aprendizado",
        conteudo:
          "Você não precisa funcionar como a maioria para funcionar bem.",
      },
      {
        numero: 30,
        titulo: "Síntese",
        conteudo:
          "Seu convite é aprender a honrar seu próprio ritmo sem se afastar do mundo. Quando biologia e rotina encontram maior sintonia, o que parecia dificuldade pode revelar uma forma diferente de potência.",
      },
    ],
  },
};
