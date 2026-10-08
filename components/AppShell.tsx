"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["/", "⌂", "Visão Geral"],
  ["/seguranca", "▦", "Momento de Segurança"],
  ["/oee", "⚙", "OEE / Eficiência"],
  ["/mapa-oee", "◫", "Mapa de Calor OEE"],
  ["/producao", "▥", "Produção em Tempo Real"],
  ["/estoque", "◆", "Controle de Estoque"],
  ["/absenteismo", "♟", "Absenteísmo"],
  ["/qualidade", "●", "Qualidade / Não Qualidade"],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="gv-app">
      <header className="gv-topbar">
        <div className="gv-brand">
          <strong>Astemo</strong>
          <small>Mobility Beyond</small>
        </div>

        <div className="gv-title">
          <b>GEMBA VISION</b>
          <small>FND • Gestão à vista</small>
        </div>

        <div className="gv-clock">
          <small>Manaus • atualização automática</small>
        </div>
      </header>

      <div className="gv-body">
        <aside className="gv-sidebar">
          <nav>
            {nav.map(([href, icon, label]) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link key={href} href={href} className={active ? "active" : ""}>
                  <span>{icon}</span>
                  <b>{label}</b>
                </Link>
              );
            })}
          </nav>

          <div className="gv-side-footer">
            <i />
            Gestão à vista
            <small>Dados L2L em tempo real</small>
          </div>
        </aside>

        <main className="gv-content">{children}</main>
      </div>
    </div>
  );
}
