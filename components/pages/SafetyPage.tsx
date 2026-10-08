"use client";

const HSE: Record<number, { title:string; focus:string; points:string[]; action:string }> = {
  1:{title:"Pequenas Mudanças Podem Importar",focus:"Nem toda mudança parece significativa. Uma pequena alteração pode mudar a exposição ao risco.",points:["Verifique mudanças no processo.","Confirme os controles existentes.","Considere a tarefa completa."],action:"Pergunte antes de iniciar: algo nesta tarefa mudou?"},
  2:{title:"Uma Mudança Pode Afetar Outra Coisa",focus:"Mudanças raramente existem isoladamente.",points:["Observe ferramentas e dispositivos.","Avalie materiais e recipientes.","Considere velocidade, sequência e layout."],action:"Olhe além da mudança e verifique o que mais ela pode afetar."},
  3:{title:"Não Esqueça os Controles",focus:"Um controle antigo pode não proteger da mesma forma depois de uma mudança.",points:["Revise proteções e sensores.","Confirme procedimentos e instruções.","Não presuma que o controle continua eficaz."],action:"Confirme que os controles ainda correspondem ao trabalho real."},
  4:{title:"Mudanças Temporárias Ainda São Mudanças",focus:"Algumas das mudanças mais fáceis de ignorar são as que assumimos como temporárias.",points:["Avalie ferramentas substitutas e reparos temporários.","Valide testes de produção e configurações temporárias.","Não deixe uma solução temporária virar processo permanente."],action:"Identifique qualquer mudança temporária e verifique seus riscos."},
  5:{title:"Mudar Deve Gerar uma Pergunta",focus:"Reconheça quando uma mudança merece uma nova análise.",points:["Pergunte quais novos perigos foram introduzidos.","Confirme se os controles continuam eficazes.","Envolva o suporte apropriado."],action:"Torne a análise de risco um hábito sempre que algo mudar."},
};

export function SafetyPage() {
  const now = new Date();
  const item = HSE[now.getDay()];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">HSE • ROTINA DIÁRIA</span>
          <h1>Momento de Segurança</h1>
          <p>Conteúdo diário de HSE para abertura de turno e reunião de equipe.</p>
        </div>
      </div>

      <section className="hse-modern">
        <div className="hse-visual">
          <span className="hse-day">
            {now.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase()}
          </span>
          <small>{now.toLocaleDateString("pt-BR")}</small>
          <div className="hse-symbol">✓</div>
          <h2>{item?.title || "Sem conteúdo programado"}</h2>
          <p>{item?.focus || "O conteúdo diário é exibido de segunda a sexta-feira."}</p>
        </div>

        {item ? (
          <div className="hse-details">
            <article>
              <span>FOCO</span>
              <h3>{item.title}</h3>
              <p>{item.focus}</p>
            </article>

            <article>
              <span>PONTOS-CHAVE</span>
              <ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
            </article>

            <article className="action">
              <span>AÇÃO DO DIA</span>
              <h3>Pense antes de executar</h3>
              <p>{item.action}</p>
            </article>
          </div>
        ) : (
          <div className="panel empty-state">
            Sem conteúdo programado para hoje.
          </div>
        )}
      </section>
    </div>
  );
}
