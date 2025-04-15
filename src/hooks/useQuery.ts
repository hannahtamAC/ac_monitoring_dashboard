import { useCallback, useEffect, useRef, useState } from "react";
import apiService from "../services/api-service";
import { ApiMethods, ServerError } from "../types/shared";
import { objectToQueryParams } from "../utils/utils";

export function useQuery<FlightQueryBodyParams, TResponse>(
  url: string,
  method: ApiMethods = "GET"
) {
  const [error, setError] = useState<ServerError>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TResponse>();

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const makeRequest = useCallback(
    async (data?: FlightQueryBodyParams | { [key: string]: string }) => {
      let res;
      try {
        setLoading(true);
        setError({});

        if (method === "GET") {
          const queryParams = objectToQueryParams(data || {});
          const newURL = queryParams.length ? `${url}?${queryParams}` : url;
          res = await apiService.get(newURL);
        }
        if (method === "POST") {
          res = await apiService.post(url, data);
        }
        if (method === "PUT") {
          res = await apiService.put(url, data);
        }

        if (res && mounted.current) {
          setResponse(res);
          setLoading(false);
        }
      } catch (err) {
        if (mounted.current) {
          setError(err as ServerError);
          setLoading(false);
        }
      }
    },
    [method, url]
  );

  return {
    response,
    loading,
    error,
    makeRequest,
  };
}
