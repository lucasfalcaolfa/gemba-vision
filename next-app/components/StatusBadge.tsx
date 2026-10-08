export function StatusBadge({
  loading,
  error,
  updatedAt,
}: {
  loading: boolean;
  error?: string;
  updatedAt?: Date | null;
}) {
  if (error) {
    return <div className="status-badge error"><i /> L2L com falha</div>;
  }
  return (
    <div className={`status-badge ${loading ? "loading" : ""}`}>
      <i />
      {loading
        ? "Atualizando L2L..."
        : `L2L atualizado às ${updatedAt?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) ?? "--:--:--"}`}
    </div>
  );
}
