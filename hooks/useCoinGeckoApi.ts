import { useQuery } from "@tanstack/react-query";

const coinGeckoApi = `https://api.coingecko.com/api/v3`;

const apiKey = process.env.EXPO_PUBLIC_X_CG_DEMO_API_KEY;

if (!apiKey) throw new Error("‼️🔑 Api key is a required env var.");

export const useCoinGeckoApi = (subroute: string) =>
  useQuery({
    queryKey: [subroute],
    queryFn: async () =>
      fetch(`${coinGeckoApi}/${subroute}`, {
        method: "GET",
        headers: { "x-cg-demo-api-key": apiKey },
      }).then((resp) => resp.json()),
  });
