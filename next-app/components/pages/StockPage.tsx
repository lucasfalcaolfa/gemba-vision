"use client";

import { useCallback, useMemo, useState } from "react";
import { l2l, integer, numberValue } from "@/lib/l2l";
import type { DailyRow } from "@/lib/types";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { KpiCard } from "../KpiCard";
import { StatusBadge } from "../StatusBadge";

type StockPosition = {
  model: string;
  foundry: number;
  finishing: number;
  downstream: number;
  inacabado: number;
  acabado: number;
  total: number;
};

const today = () => new Date().toISOString().slice(0, 10);

function productsOf(row: DailyRow) {
  const raw = row.products;
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? Object.values(raw)
      : [];

  const parsed = list
    .filter(Boolean)
    .map((product: any) => ({
      model: String(
        product.product_name ??
        product.product ??
        product.name ??
        product.model ??
        product.product_code ??
        product.part_number ??
        ""
      ).trim(),
      qty: numberValue(
        product.actual ??
        product.production_actual ??
        product.quantity ??
        product.qty
      ),
    }))
    .filter(item => item.model);

  return parsed.length
    ? parsed
    : [{ model: "GERAL", qty: numberValue(row.actual) }];
}

function stageOf(row: DailyRow) {
  const area = String(row.area || "").toUpperCase();
  const line = String(row.line || "").toUpperCase();
  const source = area + " " + line;

  if (/ACAB/.test(source)) return "finishing";
  if (/^(FND)(?!.*ACAB)/.test(area) || /INJETORA|FUND/.test(source)) return "foundry";
  if (/USI|USIN|MACH|MECAN/.test(source)) return "downstream";

  return "";
}

export function StockPage() {
  const [startDate, setStartDate] = useState("2026-09-15");
  const [endDate, setEndDate] = useState(today());
  const [model, setModel] = useState("Todos");

  const loader = useCallback(
    () => l2l.dailyWindow(startDate + " 00:00", endDate + " 23:59"),
    [startDate, endDate]
  );

  const { data = [], loading, error, updatedAt } = useAutoRefresh(loader);

  const position = useMemo(() => {
    const map = new Map<
      string,
      { model: string; foundry: number; finishing: number; downstream: number }
    >();

    (data || []).forEach(row => {
      const stage = stageOf(row);
      if (!stage) return;

      productsOf(row).forEach(product => {
        const item = map.get(product.model) || {
          model: product.model,
          foundry: 0,
          finishing: 0,
          downstream: 0,
        };

        item[stage] += product.qty;
        map.set(product.model, item);
      });
    });

    return [...map.values()]
      .map(item => {
        const inacabado = Math.max(0, item.foundry - item.finishing);
        const acabado = Math.max(0, item.finishing - item.downstream);

        return {
          ...item,
          inacabado,
          acabado,
          total: inacabado + acabado,
        };
      })
      .sort((a, b) => a.model.localeCompare(b.model, "pt-BR", { numeric: true })) as StockPosition[];
  }, [data]);

  const models = position.map(item => item.model);

  const filtered = model === "Todos"
    ? position
    : position.filter(item => item.model === model);

  const inacabado = filtered.reduce((sum, item) => sum + item.inacabado, 0);
  const acabado = filtered.reduce((sum, item) => sum + item.acabado, 0);
  const total = inacabado + acabado;

  const biggest = [...filtered].sort((a, b) => b.total - a.total)[0];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <span className="eyebrow">ESTOQUE • FND</span>
          <h1>Controle de Estoque</h1>
          <p>Posição calculada a partir do fluxo Fundição → Acabamento → Processo seguinte.</p>
        </div>
        <StatusBadge loading={loading} error={error} updatedAt={updatedAt} />
      </div>

      <section className="panel filter-panel">
        <div className="filter-head">
          <div>
            <h2>Filtros de estoque</h2>
            <p>O saldo é reconstruído a partir dos movimentos encontrados no L2L.</p>
          </div>
          <span className="auto-pill"><i /> Atualização automática</span>
        </div>

        <div className="filter-grid three">
          <label>
            Data inicial
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </label>

          <label>
            Data final
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </label>

          <label>
            Modelo
            <select value={model} onChange={e => setModel(e.target.value)}>
              <option value="Todos">Todos os modelos</option>
              {models.map(value => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>
      </section>

      <section className="kpi-grid three">
        <KpiCard label="STK Inacabado" value={integer(inacabado)} />
        <KpiCard label="STK Acabado" value={integer(acabado)} />
        <KpiCard
          label="Estoque total"
          value={integer(total)}
          helper={biggest ? "Maior saldo: " + biggest.model : "Sem saldo no período"}
        />
      </section>

      <section className="section-grid two">
        <article className="panel feature-panel">
          <div className="panel-title">
            <span>COMPOSIÇÃO</span>
            <h2>Distribuição do estoque</h2>
          </div>

          <div className="hero-number">
            <strong>{integer(total)}</strong>
            <span>peças em estoque</span>
          </div>

          <div className="metric-row">
            <span>Inacabado</span>
            <b>{integer(inacabado)}</b>
          </div>

          <div className="metric-row">
            <span>Acabado</span>
            <b>{integer(acabado)}</b>
          </div>
        </article>

        <article className="panel feature-panel">
          <div className="panel-title">
            <span>RANKING</span>
            <h2>Maiores saldos por modelo</h2>
          </div>

          <div className="rank-list">
            {[...filtered]
              .sort((a, b) => b.total - a.total)
              .slice(0, 10)
              .map((item, index) => (
                <div className="rank-item" key={item.model}>
                  <span>{index + 1}</span>
                  <div>
                    <b>{item.model}</b>
                    <small>
                      Inacabado {integer(item.inacabado)} • Acabado {integer(item.acabado)}
                    </small>
                  </div>
                  <strong>{integer(item.total)}</strong>
                </div>
              ))}

            {!filtered.length && (
              <div className="empty-state">Sem saldo para os filtros selecionados.</div>
            )}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-title">
          <span>DETALHAMENTO POR MODELO</span>
          <h2>Posição de estoque</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Fundição</th>
                <th>Acabamento</th>
                <th>Processo seguinte</th>
                <th>Inacabado</th>
                <th>Acabado</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(item => (
                <tr key={item.model}>
                  <td><b>{item.model}</b></td>
                  <td>{integer(item.foundry)}</td>
                  <td>{integer(item.finishing)}</td>
                  <td>{integer(item.downstream)}</td>
                  <td><b>{integer(item.inacabado)}</b></td>
                  <td><b>{integer(item.acabado)}</b></td>
                  <td><b>{integer(item.total)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
