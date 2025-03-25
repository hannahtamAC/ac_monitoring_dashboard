import { useState, useEffect, useCallback } from "react";
import { ApiMethods } from "../types/shared";
import { useQuery } from "./useQuery";

export const useDataRefresh = <TRequest, TResponse>(
  url: string,
  method: ApiMethods = "GET",
  interval = 30000,
  data?: unknown
) => {
  const { response, loading, error, makeRequest } = useQuery<
    TRequest,
    TResponse
  >(url, method);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refresh = useCallback(async () => {
    makeRequest(data);
    setLastUpdated(new Date());
  }, [data, makeRequest]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, interval);
    return () => clearInterval(timer);
  }, [interval, refresh]);

  return {
    response,
    lastUpdated,
    loading,
    error,
    refresh,
  };
};
