"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoRefresh<T>(loader: () => Promise<T>, intervalMs = 60000) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const next = await loader();
      if (!mounted.current) return;
      setData(next);
      setError("");
      setUpdatedAt(new Date());
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e.message : "Falha ao atualizar os dados");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const timer = window.setInterval(refresh, intervalMs);
    return () => {
      mounted.current = false;
      window.clearInterval(timer);
    };
  }, [refresh, intervalMs]);

  return { data, error, loading, updatedAt, refresh };
}
