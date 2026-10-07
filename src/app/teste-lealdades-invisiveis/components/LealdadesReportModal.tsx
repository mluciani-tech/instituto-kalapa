"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Heart, ArrowRight, Printer, AlertTriangle } from "lucide-react";
import { ResultadoLealdadesCalculado } from "../lib/calculo-lealdades";

interface LealdadesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: ResultadoLealdadesCalculado;
}

export default function LealdadesReportModal({
  isOpen,
  onClose,
  resultado,
}: LealdadesReportModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const perfil = resultado.perfilDominante;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 print:p-0 print:block print:relative print:z-auto print:inset-auto bg-black/60 print:bg-white backdrop-blur-sm print:backdrop-blur-none transition-opacity">
      
      {/* Modal Principal */}
      <div className="relative bg-[#FDFBF7] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp print:shadow-none print:animate-none print:max-h-none print:rounded-none print:w-full print:max-w-none print:bg-white print:overflow-visible">
        
        {/* Header Fixo (apenas na tela) */}
        <div className="shrink-0 border-b border-[#E8DEC8] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between bg-white z-10 gap-4 print:hidden">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1A3C4D]">Mapa de Cura Sistêmica</h2>
            <p className="text-xs text-[#1A3C4D]/60 font-light mt-1">
              Perfil: {perfil.nome}
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
              title="Salvar como PDF ou Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-[#1A3C4D]/40 hover:text-[#1A3C4D] hover:bg-[#F8F4ED] rounded-xl transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto custom-scrollbar print:overflow-visible print:block print:p-0">
          
          {/* ========================================================= */}
          {/* VISUALIZAÇÃO NA TELA (Oculto na impressão para dar lugar ao PDF completo) */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto space-y-10 print:hidden">
            <section className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-sm">
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#1A3C4D] mb-2">
                Raiz Oculta e Amor Cego
              </h3>
              <p className="text-[#1A3C4D]/80 leading-relaxed font-light">
                {perfil.raizOculta}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#B8965A] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Sintomas no Cotidiano
              </h3>
              <p className="text-[#1A3C4D]/80 leading-relaxed font-light bg-white p-5 rounded-2xl border border-[#E8DEC8]">
                {perfil.sintomas}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#B8965A] mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                O Passo Adulto (Má Consciência)
              </h3>
              <p className="text-[#1A3C4D]/80 leading-relaxed font-light bg-white p-5 rounded-2xl border border-[#E8DEC8]">
                {perfil.passoAdulto}
              </p>
            </section>

            <section className="bg-emerald-50 rounded-[2rem] p-6 sm:p-8 border border-emerald-100">
              <h3 className="text-sm font-bold tracking-widest uppercase text-emerald-800 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Exercício Somático e Falas de Cura
              </h3>
              <p className="text-emerald-900/80 leading-relaxed font-light mb-6">
                {perfil.exercicioSomatico.instrucao}
              </p>
              
              <div className="space-y-3">
                {perfil.exercicioSomatico.falas.map((fala, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="text-emerald-900 font-medium italic">"{fala}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ========================================================= */}
          {/* LAYOUT DE IMPRESSÃO (Oculto na tela, visível no PDF) */}
          {/* ========================================================= */}
          <div className="hidden print:block bg-white text-black w-full text-[12px] leading-relaxed max-w-[210mm] mx-auto">
            
            {/* PÁGINA 1: Introdução (Baseada na Página 1 do PDF) */}
            <div className="print:break-after-page space-y-6 pt-4 pb-8">
              <div className="text-center space-y-2 mb-8 border-b-2 border-[#B8965A] pb-6">
                <p className="text-[#B8965A] font-bold text-[10px] uppercase tracking-widest">
                  Constelação Familiar Sistêmica • Autoavaliação e Ordens do Amor
                </p>
                <h1 className="text-2xl font-serif font-extrabold text-[#1A3C4D]">
                  A SABEDORIA DAS LEALDADES INVISÍVEIS
                </h1>
                <p className="text-[#1A3C4D]/70 italic text-sm">
                  Qual é o seu emaranhamento sistêmico? Descubra o padrão que atua na sua história.
                </p>
              </div>

              <p className="text-justify print-avoid-break">
                Este teste foi criado para mapear as lealdades inconscientes que influenciam silenciosamente suas escolhas profissionais, seus relacionamentos e seus bloqueios no dia a dia. Por meio de situações existenciais baseadas nas Constelações Familiares de Bert Hellinger, você identificará qual dos seis grandes emaranhamentos sistêmicos está operando com maior intensidade em sua vida atual. Ao concluir, você encontrará um diagnóstico preciso sobre a dinâmica oculta do seu sistema familiar, o caminho de consciência para transformar o amor cego em força e as frases de solução exatas para se libertar de repetições e seguir em direção ao seu próprio destino com ordem e leveza.
              </p>

              <div className="border border-[#B8965A] p-4 bg-[#FDFBF7] print-avoid-break">
                <h3 className="font-bold text-[#B8965A] uppercase text-[11px] mb-2">Aviso Ético e Postura Fenomenológica</h3>
                <p className="text-justify text-[11px]">
                  Este material é um teste introdutório de autopercepção e reflexão consciente. <strong>A real profundidade da experiência terapêutica e o desatamento dos emaranhamentos sistêmicos devem ser realizados com o acompanhamento de um profissional com formação certificada em Constelação Familiar Sistêmica.</strong> Como ensina a própria postura fenomenológica de Bert Hellinger: <em>não tome nada aqui exposto como verdade dogmática absoluta — experiencie internamente, sinta no corpo e observe os efeitos na sua vida prática.</em>
                </p>
              </div>

              <div className="space-y-2 pt-2 print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[13px] border-b border-[#1A3C4D] pb-1">
                  O Que é um Emaranhamento Sistêmico?
                </h2>
                <p className="text-justify">
                  Na abordagem desenvolvida por <strong>Bert Hellinger</strong>, o emaranhamento (ou envolvimento sistêmico) ocorre quando um membro de uma geração posterior assume, de forma inconsciente e por amor infantil, o destino, a culpa, a dor ou a exclusão de alguém que veio antes no sistema familiar. Isso não decorre de fraqueza pessoal ou defeito de caráter, mas de uma necessidade arcaica e biológica de vinculação e pertencimento ao clã. A alma infantil acredita magicamente: <em>'Eu sofro por você'</em>, <em>'Eu fracasso para ficar igual a você'</em> ou <em>'Antes eu do que você'</em>. Reconhecer esse padrão não serve para acusar a família, mas para devolver a dignidade a quem veio antes e permitir que a vida siga adiante com força.
                </p>
              </div>

              <div className="space-y-2 pt-2 print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[13px] border-b border-[#1A3C4D] pb-1">
                  As Três Ordens do Amor e o Conflito das Consciências
                </h2>
                <p className="text-justify mb-2">Todas as relações humanas são sustentadas por três leis naturais descobertas nas Constelações Familiares:</p>
                <ul className="space-y-2 text-justify ml-4 list-disc">
                  <li>
                    <strong>1. A Lei do Pertencimento:</strong> Todos concebidos ou acolhidos em um sistema têm o direito inalienável de pertencer — vivos, falecidos, natimortos, abortados, esquecidos ou julgados. Quando alguém é excluído, o sistema pressiona um descendente a repetir o seu destino até que a dignidade daquele antepassado seja restabelecida.
                  </li>
                  <li>
                    <strong>2. A Lei da Ordem (Hierarquia de Chegada):</strong> Quem chegou antes no sistema tem precedência sobre quem chegou depois. Os pais são os 'grandes' que transmitem o dom da vida, e os filhos são os 'pequenos' que recebem. Quando um filho se coloca como juiz, cuidador ou salvador de seus pais, desrespeita a ordem natural e atrai para si o fracasso e o esgotamento.
                  </li>
                  <li>
                    <strong>3. A Lei do Equilíbrio entre Dar e Tomar:</strong> Entre iguais (casais, sócios, amigos), as relações exigem reciprocidade proporcional. Apenas na relação entre pais e filhos existe uma assimetria sagrada: os pais dão a vida e os filhos tomam. O filho jamais retribui na mesma medida aos pais; sua forma legítima de compensação é passar a vida adiante para as próximas gerações ou em projetos para o mundo.
                  </li>
                </ul>
                <p className="text-justify pt-2">
                  <strong>A Ilusão da Boa Consciência vs. A Força da Má Consciência:</strong> Hellinger demonstrou que a <em>boa consciência</em> atua como o instinto infantil de pertencer: ela nos faz sentir inocentes quando repetimos a pobreza, o sofrimento ou as doenças da família. A cura exige a coragem da <strong>má consciência</strong>: suportar o peso momentâneo de ser mais próspero, saudável e feliz do que nossos pais puderam ser.
                </p>
              </div>

              {/* Rodapé Página 1 */}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-16 print-avoid-break">
                <span>Material de Autodiagnóstico e Falas Sistêmicas • Baseado no legado de Bert Hellinger</span>
                <span>Página 1</span>
              </div>
            </div>

            {/* PÁGINA 2: O Resultado do Usuário */}
            <div className="print:break-after-page space-y-6 pt-4 pb-8">
              <div className="border-b-2 border-[#1A3C4D] pb-4 mb-6 print-avoid-break">
                <p className="text-[#B8965A] font-bold text-[10px] uppercase tracking-widest mb-1">
                  Seu Diagnóstico Sistêmico
                </p>
                <h2 className="text-xl font-serif font-extrabold text-[#1A3C4D]">
                  [ PERFIL {perfil.letra} ] {perfil.nome.toUpperCase()}
                </h2>
                <p className="text-[#1A3C4D]/80 font-medium">{perfil.subtitulo}</p>
              </div>

              <div className="space-y-4 text-justify print-avoid-break">
                <div>
                  <strong className="text-[#1A3C4D] text-[13px] block mb-1">• Raiz Oculta e Amor Cego:</strong>
                  <p>{perfil.raizOculta}</p>
                </div>

                <div>
                  <strong className="text-[#1A3C4D] text-[13px] block mb-1">• Sintomas no Cotidiano:</strong>
                  <p>{perfil.sintomas}</p>
                </div>

                <div>
                  <strong className="text-[#1A3C4D] text-[13px] block mb-1">• O Passo Adulto (Má Consciência):</strong>
                  <p>{perfil.passoAdulto}</p>
                </div>
              </div>

              <div className="mt-8 border border-[#7D8C6E] p-5 bg-[#F9FBF8] print-avoid-break">
                <strong className="text-[#7D8C6E] text-[13px] uppercase block mb-3 border-b border-[#7D8C6E]/30 pb-2">
                  • Exercício Somático e Falas de Solução
                </strong>
                <p className="mb-4 text-justify italic">{perfil.exercicioSomatico.instrucao}</p>
                
                <ul className="space-y-2 ml-4 list-disc text-[#1A3C4D] font-medium">
                  {perfil.exercicioSomatico.falas.map((fala, idx) => (
                    <li key={idx}>
                      &ldquo;{fala}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 text-[10px] text-gray-500 print-avoid-break">
                <p>Pontuações Registradas: {
                  Object.entries(resultado.pontuacoes)
                    .map(([letra, pontos]) => `Perfil ${letra}: ${pontos}`)
                    .join(" | ")
                }</p>
              </div>

              {/* Rodapé Página 2 */}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-16 print-avoid-break">
                <span>Material de Autodiagnóstico e Falas Sistêmicas • Baseado no legado de Bert Hellinger</span>
                <span>Página 2</span>
              </div>
            </div>

            {/* PÁGINA 3: Princípios para a Integração e a Prática no Cotidiano (Pág 8 do PDF) */}
            <div className="print:break-after-page space-y-6 pt-4 pb-8">
              <div className="space-y-2 border-b border-[#1A3C4D] pb-2 mb-6 print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[15px]">
                  PRINCÍPIOS PARA A INTEGRAÇÃO E A PRÁTICA NO COTIDIANO
                </h2>
              </div>

              <div className="space-y-2 text-justify print-avoid-break">
                <strong className="text-[#1A3C4D] text-[13px] block">Como Praticar a Cura no Dia a Dia:</strong>
                <p>
                  As soluções sistêmicas não são fórmulas intelectuais ou rituais mágicos; elas representam uma profunda <strong>mudança de postura na alma</strong> perante a realidade factual da vida. Quando você identifica o seu emaranhamento dominante através deste teste, o primeiro passo é <strong>concordar com tudo exatamente como foi e como é</strong>. A resistência, a queixa e o julgamento amarram a alma ao passado; a aceitação humilde e serena devolve a liberdade e a força.
                </p>
                <p>
                  Bert Hellinger ensina que <em>'a solução consiste sempre em soltar-se de algo'</em>. Soltar-se das pretensões de consertar os pais, soltar-se da necessidade infantil de ser leal à dor do clã e assumir a responsabilidade adulta sobre o próprio destino.
                </p>
              </div>

              <div className="space-y-4 pt-4 text-justify print-avoid-break">
                <h3 className="text-[#1A3C4D] font-bold uppercase text-[13px] border-b border-[#B8965A] pb-1">
                  Síntese das Três Leis e seus Antídotos Sistêmicos
                </h3>
                
                <table className="w-full border-collapse border border-gray-300 text-[11px] mt-4">
                  <thead>
                    <tr className="bg-[#1A3C4D] text-white">
                      <th className="border border-gray-300 p-2 text-left w-1/4">Lei Sistêmica</th>
                      <th className="border border-gray-300 p-2 text-left w-1/4">Transgressão Comum</th>
                      <th className="border border-gray-300 p-2 text-left w-1/4">Manifestação da Dor</th>
                      <th className="border border-gray-300 p-2 text-left w-1/4">Postura de Cura e Fala de Solução</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2 font-bold bg-[#FDFBF7]">Pertencimento</td>
                      <td className="border border-gray-300 p-2">Excluir, julgar ou esquecer membros do clã.</td>
                      <td className="border border-gray-300 p-2">Solidão crônica, sensação de desterro, perdas inexplicáveis.</td>
                      <td className="border border-gray-300 p-2 italic bg-[#F9FBF8]">'Eu vejo você. Você faz parte da nossa história e tem um bom lugar em meu coração.'</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-bold bg-[#FDFBF7]">Ordem (Hierarquia)</td>
                      <td className="border border-gray-300 p-2">Querer ser maior que os pais; julgar quem veio antes.</td>
                      <td className="border border-gray-300 p-2">Esgotamento, fracasso profissional, arrogância e impotência.</td>
                      <td className="border border-gray-300 p-2 italic bg-[#F9FBF8]">'Vocês são os grandes e eu sou o pequeno. Vocês dão e eu recebo.'</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2 font-bold bg-[#FDFBF7]">Equilíbrio</td>
                      <td className="border border-gray-300 p-2">Dar demais nas relações adultas; recusar-se a receber.</td>
                      <td className="border border-gray-300 p-2">Rupturas de casais, amargura, desvalorização e dependência.</td>
                      <td className="border border-gray-300 p-2 italic bg-[#F9FBF8]">'Eu dou na medida em que você pode retribuir; recebo com carinho o que me oferece.'</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 border border-[#B8965A] p-4 bg-[#FDFBF7] text-justify print-avoid-break">
                <h3 className="font-bold text-[#B8965A] uppercase text-[11px] mb-2">A Solução pelo Desprendimento e pelo Amor Maduro:</h3>
                <p className="italic text-[11px]">
                  &ldquo;Muitos problemas surgem quando alguém pensa que pode superar a ordem por meio do amor infantil. A ordem nos é preestabelecida e não pode ser substituída pelo amor: a ordem precede o amor e lhe dá suporte. Quando nos voltamos para o essencial e concordamos com a realidade pelo preço que custou, encontramos a força que cura. Ser feliz e bem-sucedido é para os corajosos — exige a ousadia de fazer algo de bom com a própria vida em honra àqueles que nos deram a existência.&rdquo;
                </p>
                <p className="text-right font-bold mt-2 text-[10px]">— Bert Hellinger (Ordens do Amor)</p>
              </div>

              {/* Rodapé Página 3 */}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-16 print-avoid-break">
                <span>Material de Autodiagnóstico e Falas Sistêmicas • Baseado no legado de Bert Hellinger</span>
                <span>Página 3</span>
              </div>
            </div>

            {/* PÁGINA 4: Bert Hellinger Bio e Referências (Pág 9 do PDF) */}
            <div className="space-y-6 pt-4 pb-8">
              <div className="space-y-2 border-b border-[#1A3C4D] pb-2 mb-6 print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[15px]">
                  BERT HELLINGER: UMA VIDA A SERVIÇO DA CONSCIÊNCIA
                </h2>
              </div>

              <div className="space-y-4 text-justify print-avoid-break">
                <div>
                  <strong className="text-[#1A3C4D] text-[12px] block mb-1">Origens e Trajetória Formativa:</strong>
                  <p>
                    Anton Suitbert Hellinger, conhecido mundialmente como <strong>Bert Hellinger</strong>, nasceu em Leimen, na Alemanha, em 16 de dezembro de 1925, e faleceu em 19 de setembro de 2019. Formou-se em Filosofia, Teologia e Pedagogia. Convocado como soldado em 1943 durante a Segunda Guerra Mundial, foi capturado como prisioneiro na Bélgica — experiência que curou sua alma de julgamentos morais sobre o bem e o mal.
                  </p>
                </div>

                <div>
                  <strong className="text-[#1A3C4D] text-[12px] block mb-1">A Vivência Missionária entre os Zulus (16 Anos na África do Sul):</strong>
                  <p>
                    Após ingressar na ordem dos missionários de Marianhill e ser ordenado sacerdote católico, viveu e trabalhou durante dezesseis anos na África do Sul, onde dirigiu escolas de nível superior. Ali aprendeu fluentemente a língua zulu e observou fascinado uma comunidade regida por princípios naturais de profunda reverência à hierarquia, respeito sagrado aos pais e antepassados e ausência de neuroses típicas do mundo ocidental. Entre os zulus, era impensável falar depreciativamente dos próprios pais — constatação que marcou indelevelmente sua compreensão das relações humanas.
                  </p>
                </div>

                <div>
                  <strong className="text-[#1A3C4D] text-[12px] block mb-1">O Retorno à Europa e a Síntese Terapêutica:</strong>
                  <p>
                    Nos anos 1970, Hellinger desligou-se da ordem religiosa para se dedicar à psicoterapia. Estudou Psicanálise em Viena, Dinâmica de Grupos, Terapia Primal e Análise Transacional (aprofundando com a Análise do Script de Eric Berne a percepção de roteiros repetitivos). Nos Estados Unidos, incorporou métodos hipnoterapêuticos de Milton Erickson com Jeff Zeig e Stephen Lankton. O contato com o trabalho de Thea Schönfelder foi o catalisador que o levou a desenvolver sua própria abordagem fenomenológica: as <strong>Constelações Familiares Sistêmicas</strong>.
                  </p>
                </div>

                <div>
                  <strong className="text-[#1A3C4D] text-[12px] block mb-1">Autodefinição:</strong>
                  <p>
                    Bert Hellinger recusava o rótulo de mero psicoterapeuta, definindo-se como <em>'um filósofo a serviço da vida, como ela é, sem desejar que seja diferente'</em>.
                  </p>
                </div>
              </div>

              <div className="border border-[#1A3C4D] p-4 mt-6 print-avoid-break">
                <h3 className="font-bold text-[#1A3C4D] uppercase text-[11px] mb-2">Diretriz Ética e Compromisso com a Experiência Viva</h3>
                <p className="text-justify text-[11px]">
                  Este instrumento é um teste introdutório de autoavaliação e sensibilização pessoal. A amplitude e a profundidade transformadora da experiência sistêmica demandam o campo prático e o acompanhamento cuidadoso de um <strong>profissional com formação certificada em Constelação Familiar</strong>. A alma humana não obedece a regras dogmáticas nem a diagnósticos fechados. Como sintetizava Bert Hellinger: <strong>não tome nada aqui como verdade inquestionável — experiencie, observe os movimentos da sua alma e sinta com honestidade a resposta que o seu próprio corpo oferece à realidade da vida.</strong>
                </p>
              </div>

              <div className="space-y-2 pt-6 print-avoid-break">
                <h3 className="text-[#1A3C4D] font-bold uppercase text-[13px] border-b border-[#1A3C4D] pb-1">
                  Referências Bibliográficas Recomendadas
                </h3>
                <ul className="text-[11px] space-y-1">
                  <li>• <strong>Hellinger, Bert.</strong> <em>Ordens do Amor: Um Guia para o Trabalho com Constelações Familiares.</em> São Paulo: Editora Cultrix.</li>
                  <li>• <strong>Hellinger, Bert.</strong> <em>Liberados Somos Concluídos.</em> Patos de Minas: Editora Atman.</li>
                  <li>• <strong>Hellinger, Bert.</strong> <em>O Amor do Espírito.</em> Patos de Minas: Editora Atman / Cultrix.</li>
                  <li>• <strong>Hellinger, Bert.</strong> <em>A Simetria Oculta do Amor: Por que o Amor Faz os Relacionamentos Darem Certo.</em> São Paulo: Editora Cultrix.</li>
                  <li>• <strong>Hellinger, Bert.</strong> <em>Ordens da Ajuda.</em> Patos de Minas: Editora Atman.</li>
                  <li>• <strong>Silva, M. I. A. G.; Farias, S. S. C.; Garlet, A. C.; Berndt, P. P.</strong> <em>Constelação Familiar: Um Caminho para a Vida.</em> Florianópolis: Instituto Ipê Roxo.</li>
                  <li>• <strong>Toman, Walter.</strong> <em>Family Constellation: Its Place in Personality Theory and Sibling Position.</em> Springer Publishing.</li>
                </ul>
              </div>

              {/* Rodapé Página 4 */}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-16 print-avoid-break">
                <span>Material de Autodiagnóstico e Falas Sistêmicas • Baseado no legado de Bert Hellinger</span>
                <span>Página 4 de 4</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>,
    document.body
  );

}
