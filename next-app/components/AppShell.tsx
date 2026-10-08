"use client";

import { useState } from "react";
import { OverviewPage } from "./pages/OverviewPage";
import { OeePage } from "./pages/OeePage";
import { ProductionPage } from "./pages/ProductionPage";
import { GenericPage } from "./pages/GenericPage";

type PageKey = "home" | "safety" | "oee" | "heatmap" | "production" | "stock" | "people" | "quality";

const nav = [
  ["home", "⌂", "Visão Geral"],
  ["safety", "▦", "Momento de Segurança"],
  ["oee", "⚙", "OEE / Eficiência"],
  ["heatmap", "◫", "Mapa de Calor OEE"],
  ["production", "▥", "Produção em Tempo Real"],
  ["stock", "◆", "Controle de Estoque"],
  ["people", "♟", "Absenteísmo"],
  ["quality", "●", "Qualidade / Não Qualidade"],
] as const;

export function AppShell() {
  const [page, setPage] = useState<PageKey>("home");

  return (
    <div className="gv-app">
      <header className="gv-topbar">
        <div className="gv-brand"><strong>Astemo</strong><small>Mobility Beyond</small></div>
        <div className="gv-title"><b>GEMBA VISION</b><small>FND • Gestão à vista</small></div>
        <div className="gv-clock"><small>Manaus • atualização automática</small></div>
      </header>

      <div className="gv-body">
        <aside className="gv-sidebar">
          <nav>
            {nav.map(([key, icon, label]) => (
              <button
                key={key}
                type="button"
                className={page === key ? "active" : ""}
                onClick={() => setPage(key)}
              >
                <span>{icon}</span><b>{label}</b>
              </button>
            ))}
          </nav>
          <div className="gv-side-footer"><i /> Gestão à vista<small>Dados L2L em tempo real</small></div>
        </aside>

        <main className="gv-content">
          {page === "home" && <OverviewPage />}
          {page === "oee" && <OeePage />}
          {page === "production" && <ProductionPage />}
          {page === "safety" && <GenericPage title="Momento de Segurança" subtitle="Conteúdo diário de HSE" mode="safety" />}
          {page === "heatmap" && <GenericPage title="Mapa de Calor OEE" subtitle="Eficiência diária por turno, linha e período" mode="heatmap" />}
          {page === "stock" && <GenericPage title="Controle de Estoque" subtitle="Estoque inacabado, acabado e consolidado" mode="stock" />}
          {page === "people" && <GenericPage title="Absenteísmo" subtitle="Indicadores de pessoas e presença" mode="people" />}
          {page === "quality" && <GenericPage title="Qualidade / Não Qualidade" subtitle="Defeitos de produto e scrap" mode="quality" />}
        </main>
      </div>
    </div>
  );
}
