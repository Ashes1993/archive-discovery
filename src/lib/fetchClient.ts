import axios, {
  type AxiosRequestConfig,
  type RawAxiosResponseHeaders,
} from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

type FetchClientResponse<T = unknown> = {
  ok: boolean;
  status: number;
  json: () => Promise<T>;
  headers?: RawAxiosResponseHeaders;
};

type FetchClientOptions = AxiosRequestConfig & {
  body?: unknown;
};

// Create a dedicated Axios instance
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
});

// Inject Proxy
if (process.env.NODE_ENV === "development") {
  // Use env var or fallback to standard V2Ray HTTP port
  const proxyUrl = process.env.DEV_PROXY_URL || "http://127.0.0.1:50765";

  try {
    const httpsAgent = new HttpsProxyAgent(proxyUrl);

    // Attach agent to the client instance
    apiClient.defaults.httpAgent = httpsAgent;
    apiClient.defaults.httpsAgent = httpsAgent;

    // Disable Axios default proxy handling so it uses my agent
    apiClient.defaults.proxy = false;

    console.log(`🔒 Proxy Active: Routing traffic through ${proxyUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("⚠️ Proxy setup failed:", message);
  }
}

// Wrapper to keep code looking like native 'fetch'
export async function fetchClient<T = unknown>(
  url: string,
  options: FetchClientOptions = {},
): Promise<FetchClientResponse<T>> {
  try {
    const response = await apiClient<T>({
      url,
      method: options.method || "GET",
      data: options.body,
      // Allow overriding defaults per request if needed
      ...options,
    });

    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      // Helper to match fetch API
      json: async () => response.data,
      headers: response.headers,
    };
  } catch (error) {
    if (axios.isAxiosError<T>(error) && error.response) {
      return {
        ok: false,
        status: error.response.status,
        json: async () => error.response?.data as T,
        headers: error.response.headers,
      };
    }

    // Handle Network Errors
    const message = error instanceof Error ? error.message : String(error);
    console.error(`🔥 Network Error on ${url}:`, message);
    throw error;
  }
}
