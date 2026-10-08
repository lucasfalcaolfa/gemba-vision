"use client";

import { KpiCard } from "../KpiCard";

export function PeoplePage() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">PESSOAS • FND</span>
          <h1>Absenteísmo</h1>
          <p>Estrutura preparada para receber os indicadores reais de presença e ausência.</p>
        </div>
      </div>

      <section className="kpi-grid three">
        <KpiCard label="Presentes" value="—" />
        <KpiCard label="Ausentes" value="—" />
        <KpiCard label="Absenteísmo" value="—" />
      </section>

      <section className="section-grid two">
        <article className="panel feature-panel">
          <div className="panel-title">
            <span>STATUS DA INTEGRAÇÃO</span>
            <h2>Fonte de dados pendente</h2>
          </div>
          <div className="empty-state">
            A página React já está pronta. Falta apenas conectar a fonte real de absenteísmo
            utilizada pela operação.
          </div>
        </article>

        <article className="panel feature-panel">
          <div className="panel-title">
            <span>PRÓXIMA ETAPA</span>
            <h2>Indicadores planejados</h2>
          </div>
          <div className="rank-list">
            <div className="rank-item"><span>1</span><div><b>Absenteísmo por turno</b><small>1º, 2º e 3º turnos</small></div></div>
            <div className="rank-item"><span>2</span><div><b>Absenteísmo por área</b><small>Comparativo entre equipes</small></div></div>
            <div className="rank-item"><span>3</span><div><b>Tendência diária</b><small>Evolução no período</small></div></div>
          </div>
        </article>
      </section>
    </div>
  );
}
