import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

// 1. Create a dedicated Axios instance
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
});

// 2. Inject Proxy
if (process.env.NODE_ENV === "development") {
  // Use env var or fallback to standard V2Ray HTTP port
  const proxyUrl = process.env.DEV_PROXY_URL || "http://127.0.0.1:10809";

  try {
    const httpsAgent = new HttpsProxyAgent(proxyUrl);

    // Attach agent to the client instance
    apiClient.defaults.httpAgent = httpsAgent;
    apiClient.defaults.httpsAgent = httpsAgent;

    // 🚨 CRITICAL FIX: Disable Axios default proxy handling so it uses our agent
    apiClient.defaults.proxy = false;

    console.log(`🔒 Proxy Active: Routing traffic through ${proxyUrl}`);
  } catch (err) {
    console.warn("⚠️ Proxy setup failed:", err.message);
  }
}

/**
 * Wrapper to keep our code looking like native 'fetch'
 */
export const fetchClient = async (url, options = {}) => {
  try {
    const response = await apiClient({
      url: url,
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
    // Handle Axios Error Responses (404, 500, etc)
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        json: async () => error.response.data,
      };
    }

    // Handle Network Errors
    console.error(`🔥 Network Error on ${url}:`, error.message);
    throw error;
  }
};
