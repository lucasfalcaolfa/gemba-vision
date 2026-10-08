type Tone = "default" | "good" | "warn" | "bad";

export function KpiCard({
  label,
  value,
  helper,
  tone = "default",
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: Tone;
}) {
  return (
    <article className={`kpi-card tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  );
}
