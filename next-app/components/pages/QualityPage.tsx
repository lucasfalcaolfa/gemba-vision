"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, integer, numberValue } from "@/lib/l2l";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { KpiCard } from "../KpiCard";
import { StatusBadge } from "../StatusBadge";

const today = () => new Date().toISOString().slice(0, 10);

export function QualityPage() {
  const [date, setDate] = useState(today());
  const [line, setLine] = useState("Todas");
  const [shift, setShift] = useState("Todos");
  const [product, setProduct] = useState("Todos");

  const loader = useCallback(
    () => l2l.scrap(date + " 00:00", date + " 23:59"),
    [date]
  );

  const { data = [], loading, error, updatedAt } = useAutoRefresh(loader);

  const lines = useMemo(
    () => [...new Set((data || []).map(r => String(r.line || "")).filter(Boolean))]
      .sort((a,b) => a.localeCompare(b, "pt-BR", { numeric: true })),
    [data]
  );

  const shifts = useMemo(
    () => [...new Set((data || []).map(r => String(r.shift || "")).filter(Boolean))].sort(),
    [data]
  );

  const products = useMemo(
    () => [...new Set((data || []).map(r => String(r.product || "")).filter(Boolean))]
      .sort((a,b) => a.localeCompare(b, "pt-BR", { numeric: true })),
    [data]
  );

  const rows = useMemo(
    () => (data || []).filter(r =>
      (line === "Todas" || String(r.line || "") === line) &&
      (shift === "Todos" || String(r.shift || "") === shift) &&
      (product === "Todos" || String(r.product || "") === product)
    ),
    [data, line, shift, product]
  );

  const totalScrap = rows.reduce((sum, row) => sum + numberValue(row.scrap), 0);

  const defectRanking = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const row of rows) {
      const defect = String(row.defect || "Sem categoria");
      grouped.set(defect, (grouped.get(defect) || 0) + numberValue(row.scrap));
    }

    return [...grouped.entries()]
      .map(([defect, qty]) => ({ defect, qty }))
      .sort((a, b) => b.qty - a.qty);
  }, [rows]);

  const productRanking = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const row of rows) {
      const name = String(row.product || "Sem modelo");
      grouped.set(name, (grouped.get(name) || 0) + numberValue(row.scrap));
    }

    return [...grouped.entries()]
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty);
  }, [rows]);

  const topDefect = defectRanking[0];
  const topProduct = productRanking[0];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">QUALIDADE • FND</span>
          <h1>Qualidade / Não Qualidade</h1>
          <p>Scrap real por defeito, modelo, turno e linha.</p>
        </div>
        <StatusBadge loading={loading} error={error} updatedAt={updatedAt} />
      </div>

      <section className="panel filter-panel">
        <div className="filter-head">
          <div>
            <h2>Filtros de qualidade</h2>
            <p>Dados carregados diretamente do Scrap Detail do L2L.</p>
          </div>
          <span className="auto-pill"><i /> Atualização automática</span>
        </div>

        <div className="filter-grid four">
          <label>
            Linha
            <select value={line} onChange={e => setLine(e.target.value)}>
              <option value="Todas">Todas as linhas</option>
              {lines.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label>
            Turno
            <select value={shift} onChange={e => setShift(e.target.value)}>
              <option value="Todos">Todos os turnos</option>
              {shifts.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label>
            Modelo
            <select value={product} onChange={e => setProduct(e.target.value)}>
              <option value="Todos">Todos os modelos</option>
              {products.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>

          <label>
            Data
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="kpi-grid three">
        <KpiCard
          label="Scrap total"
          value={integer(totalScrap)}
          tone={totalScrap > 0 ? "bad" : "good"}
        />
        <KpiCard
          label="Principal defeito"
          value={topDefect?.defect || "-"}
          helper={topDefect ? integer(topDefect.qty) + " peças" : "Sem registros"}
          tone={topDefect ? "bad" : "default"}
        />
        <KpiCard
          label="Modelo mais afetado"
          value={topProduct?.name || "-"}
          helper={topProduct ? integer(topProduct.qty) + " peças" : "Sem registros"}
        />
      </section>

      <section className="section-grid two">
        <article className="panel feature-panel">
          <div className="panel-title">
            <span>PARETO DE DEFEITOS</span>
            <h2>Maiores causas de não qualidade</h2>
          </div>

          <div className="rank-list">
            {defectRanking.slice(0, 10).map((item, index) => (
              <div className="rank-item" key={item.defect}>
                <span>{index + 1}</span>
                <div>
                  <b>{item.defect}</b>
                  <small>{totalScrap ? ((item.qty / totalScrap) * 100).toFixed(1) : "0.0"}% do scrap filtrado</small>
                </div>
                <strong>{integer(item.qty)}</strong>
              </div>
            ))}
            {!defectRanking.length && <div className="empty-state">Sem defeitos no período selecionado.</div>}
          </div>
        </article>

        <article className="panel feature-panel">
          <div className="panel-title">
            <span>MODELOS</span>
            <h2>Scrap por produto</h2>
          </div>

          <div className="rank-list">
            {productRanking.slice(0, 10).map((item, index) => (
              <div className="rank-item" key={item.name}>
                <span>{index + 1}</span>
                <div><b>{item.name}</b><small>Quantidade rejeitada</small></div>
                <strong>{integer(item.qty)}</strong>
              </div>
            ))}
            {!productRanking.length && <div className="empty-state">Sem modelos com scrap no período.</div>}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-title">
          <span>DETALHAMENTO</span>
          <h2>Registros de não qualidade</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Linha</th>
                <th>Turno</th>
                <th>Modelo</th>
                <th>Defeito</th>
                <th>Causa</th>
                <th>Scrap</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={String(row.id || index)}>
                  <td>{row.date ? new Date(row.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                  <td><b>{String(row.line || "-")}</b></td>
                  <td>{String(row.shift || "-")}</td>
                  <td>{String(row.product || "-")}</td>
                  <td>{String(row.defect || "-")}</td>
                  <td>{String(row.cause || "-")}</td>
                  <td><b>{integer(row.scrap)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
