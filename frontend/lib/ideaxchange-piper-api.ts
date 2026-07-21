/**
 * Server-only Piper incentives API client (Career leaderboard).
 * @see https://api-incentives-prod.piper.tools
 */

const DEFAULT_BASE_URL = "https://api-incentives-prod.piper.tools";
const DEFAULT_KEY_HEADER = "x-api-key";

export type PiperLeaderboardMetadata = {
  endDate?: string;
  title?: string;
  poster?: string;
  processors?: string[];
};

export type PiperLeaderboardResponse = {
  data: Record<string, unknown>[];
  period?: string;
  periodType?: string;
  updated?: string;
  isFallbackData?: boolean;
  fallbackMessage?: string;
  periodClosed?: boolean;
  metadata?: PiperLeaderboardMetadata;
  coldefVersion?: string;
  schemaVersion?: string;
};

export type PiperLeaderboardFetchResult = {
  ok: boolean;
  status: number;
  data: PiperLeaderboardResponse | null;
  error?: string;
};

function getPiperApiConfig(): {
  baseUrl: string;
  apiKey: string;
  keyHeader: string;
} | null {
  const apiKey = process.env.PIPER_API_KEY?.trim();
  if (!apiKey) return null;

  const baseUrl = (process.env.PIPER_API_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(
    /\/$/,
    "",
  );
  const keyHeader = process.env.PIPER_API_KEY_HEADER?.trim() || DEFAULT_KEY_HEADER;

  return { baseUrl, apiKey, keyHeader };
}

export function isPiperApiConfigured(): boolean {
  return getPiperApiConfig() !== null;
}

/** Current calendar year/month for Piper leaderboard requests. */
export function getCurrentPiperPeriod(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function buildPiperAuthHeaders(apiKey: string, keyHeader: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const normalized = keyHeader.toLowerCase();
  if (normalized === "authorization" || normalized === "authorization-bearer") {
    headers.Authorization = `Bearer ${apiKey}`;
  } else if (normalized === "authorization-apikey") {
    headers.Authorization = `ApiKey ${apiKey}`;
  } else {
    headers[keyHeader] = apiKey;
    if (keyHeader !== "x-api-key") {
      headers["x-api-key"] = apiKey;
    }
  }

  return headers;
}

function formatPiperError(status: number, body: string): string {
  if (status === 401 || status === 403) {
    return [
      body || "Unauthorized",
      "Confirm PIPER_API_KEY, FQDN whitelist (amerilife.com / staging), and header with AmeriLife IT.",
    ].join(" — ");
  }
  return body || `HTTP ${status}`;
}

export async function fetchPiperLeaderboard(
  incentiveType: string,
  year: number,
  month: number,
  options?: { office?: string; processor?: string },
): Promise<PiperLeaderboardFetchResult> {
  const config = getPiperApiConfig();
  if (!config) {
    return { ok: false, status: 0, data: null, error: "PIPER_API_KEY is not configured" };
  }

  const params = new URLSearchParams();
  if (options?.office) params.set("office", options.office);
  if (options?.processor) params.set("processor", options.processor);
  const query = params.toString();

  // Piper web app uses unpadded month in the path (e.g. /2026/7).
  const path = `/leaderboard/${encodeURIComponent(incentiveType)}/${year}/${month}`;
  const url = `${config.baseUrl}${path}${query ? `?${query}` : ""}`;

  try {
    // Always hit Piper fresh — auth/whitelist fixes must show up immediately.
    const response = await fetch(url, {
      headers: buildPiperAuthHeaders(config.apiKey, config.keyHeader),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return {
        ok: false,
        status: response.status,
        data: null,
        error: formatPiperError(response.status, body),
      };
    }

    const data = (await response.json()) as PiperLeaderboardResponse;
    return { ok: true, status: response.status, data };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error instanceof Error ? error.message : "Piper API request failed",
    };
  }
}

/** Safe diagnostics for health checks (never includes the API key). */
export function getPiperApiDiagnostics(): {
  configured: boolean;
  baseUrl: string;
  keyHeader: string;
  keyLength: number;
} {
  const config = getPiperApiConfig();
  if (!config) {
    return {
      configured: false,
      baseUrl: DEFAULT_BASE_URL,
      keyHeader: DEFAULT_KEY_HEADER,
      keyLength: 0,
    };
  }
  return {
    configured: true,
    baseUrl: config.baseUrl,
    keyHeader: config.keyHeader,
    keyLength: config.apiKey.length,
  };
}
