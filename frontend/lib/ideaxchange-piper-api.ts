/**
 * Server-only Piper incentives API client (Career leaderboard).
 * Partner/embed endpoint (API key auth):
 *   GET /embed-leaderboard?incentive={type}&year={year}&month={month}
 * @see https://api-incentives-prod.piper.tools
 */

const DEFAULT_BASE_URL = "https://api-incentives-prod.piper.tools";
const DEFAULT_KEY_HEADER = "x-api-key";

export type PiperLeaderboardColumnDef = {
  field?: string;
  headerName?: string;
  order?: number;
  formatter?: string;
  renderer?: string;
};

export type PiperLeaderboardMetadata = {
  endDate?: string;
  title?: string;
  poster?: string;
  processors?: string[];
};

export type PiperLeaderboardResponse = {
  /** Legacy Cognito web-app shape */
  data?: Record<string, unknown>[];
  /** Embed/partner API shape */
  rows?: Record<string, unknown>[];
  displayRows?: Record<string, unknown>[];
  rowCount?: number;
  columns?: PiperLeaderboardColumnDef[];
  incentive?: string;
  period?: string;
  periodType?: string;
  updated?: string;
  generatedAt?: number | string;
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

/** Normalize embed + legacy response row arrays. */
export function getPiperLeaderboardRows(
  response: PiperLeaderboardResponse | null | undefined,
): Record<string, unknown>[] {
  if (!response) return [];
  if (Array.isArray(response.rows)) return response.rows;
  if (Array.isArray(response.displayRows)) return response.displayRows;
  if (Array.isArray(response.data)) return response.data;
  return [];
}

/** Prefer `updated`, else convert embed `generatedAt` to ISO. */
export function getPiperLeaderboardUpdatedAt(
  response: PiperLeaderboardResponse | null | undefined,
): string | null {
  if (!response) return null;
  if (typeof response.updated === "string" && response.updated.trim()) {
    return response.updated.trim();
  }
  if (typeof response.generatedAt === "number" && Number.isFinite(response.generatedAt)) {
    const date = new Date(response.generatedAt);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (typeof response.generatedAt === "string" && response.generatedAt.trim()) {
    const asNumber = Number(response.generatedAt);
    if (Number.isFinite(asNumber)) {
      const date = new Date(asNumber);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    const date = new Date(response.generatedAt);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
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

  // Partner/embed API uses query params (not the Cognito web-app path style).
  const params = new URLSearchParams({
    incentive: incentiveType,
    year: String(year),
    month: String(month),
  });
  if (options?.office) params.set("office", options.office);
  if (options?.processor) params.set("processor", options.processor);

  const url = `${config.baseUrl}/embed-leaderboard?${params.toString()}`;

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
