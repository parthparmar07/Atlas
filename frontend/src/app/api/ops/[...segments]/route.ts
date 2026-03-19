import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_BASE_FALLBACK = "http://backend:8000";

type BackendRecord = {
  id: number | string;
  title?: string;
  status?: string;
  owner?: string;
  priority?: string;
  source?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
};

type LegacyOpsRecord = {
  id: string;
  data: Record<string, unknown>;
};

function toLegacyRecord(record: BackendRecord): LegacyOpsRecord {
  const fromMetadata =
    record.metadata && typeof record.metadata === "object"
      ? (record.metadata["raw"] as Record<string, unknown> | undefined)
      : undefined;

  const data: Record<string, unknown> =
    fromMetadata && typeof fromMetadata === "object"
      ? { ...fromMetadata }
      : {
          title: record.title ?? "Untitled Record",
          status: record.status ?? "new",
          owner: record.owner ?? "system",
          priority: record.priority ?? "medium",
          source: record.source ?? "manual",
          notes: record.notes ?? "",
        };

  data.id = String(record.id);
  return { id: String(record.id), data };
}

function toBackendPayload(data: Record<string, unknown>): Record<string, unknown> {
  const titleCandidate =
    (typeof data.title === "string" && data.title) ||
    (typeof data.name === "string" && data.name) ||
    (typeof data.faculty === "string" && data.faculty) ||
    (typeof data.student === "string" && data.student) ||
    (typeof data.applicant === "string" && data.applicant) ||
    (typeof data.vendor === "string" && data.vendor) ||
    "Untitled Record";

  return {
    title: titleCandidate,
    status: typeof data.status === "string" ? data.status : "new",
    owner: typeof data.owner === "string" ? data.owner : "system",
    priority: typeof data.priority === "string" ? data.priority : "medium",
    source: "frontend-records",
    notes: typeof data.notes === "string" ? data.notes : "",
    metadata: { raw: data },
  };
}

async function passThrough(req: NextRequest, targetUrl: string): Promise<NextResponse> {
  const contentType = req.headers.get("content-type") ?? "";
  const hasBody = !["GET", "HEAD"].includes(req.method);

  const upstream = await fetchOps(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": contentType.includes("application/json") ? "application/json" : "text/plain",
    },
    body: hasBody ? await req.text() : undefined,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

async function fetchOps(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    const shouldTryFallback =
      (input.includes("http://localhost:") || input.includes("http://127.0.0.1:")) && !input.includes(API_BASE_FALLBACK);

    if (!shouldTryFallback) {
      throw error;
    }

    const fallbackInput = input
      .replace("http://localhost:8000", API_BASE_FALLBACK)
      .replace("http://127.0.0.1:8000", API_BASE_FALLBACK);

    return fetch(fallbackInput, init);
  }
}

async function handleRecords(req: NextRequest, domain: string, module: string, tail: string[]): Promise<NextResponse> {
  const base = `${API_BASE}/api/ops/${domain}/${module}`;

  if (req.method === "GET" && tail.length === 0) {
    const upstream = await fetchOps(base, { cache: "no-store" });
    const json = (await upstream.json()) as { records?: BackendRecord[]; count?: number; detail?: string };
    if (!upstream.ok) {
      return NextResponse.json({ detail: json.detail ?? "Failed to load records" }, { status: upstream.status });
    }

    const mapped = (json.records ?? []).map(toLegacyRecord);
    return NextResponse.json({ records: mapped, count: mapped.length });
  }

  if (req.method === "POST" && tail.length === 0) {
    const body = (await req.json().catch(() => ({}))) as { data?: Record<string, unknown> };
    const payload = toBackendPayload(body.data ?? {});

    const upstream = await fetchOps(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await upstream.json()) as BackendRecord | { detail?: string };
    if (!upstream.ok) {
      return NextResponse.json({ detail: (json as { detail?: string }).detail ?? "Failed to create record" }, { status: upstream.status });
    }

    return NextResponse.json(toLegacyRecord(json as BackendRecord), { status: upstream.status });
  }

  if ((req.method === "PUT" || req.method === "PATCH") && tail.length === 1) {
    const recordId = Number(tail[0]);
    if (Number.isNaN(recordId)) {
      return NextResponse.json({ detail: "Invalid record id" }, { status: 400 });
    }

    const body = (await req.json().catch(() => ({}))) as { data?: Record<string, unknown> };
    const payload = toBackendPayload(body.data ?? {});

    const upstream = await fetchOps(`${base}/${recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = (await upstream.json()) as BackendRecord | { detail?: string };
    if (!upstream.ok) {
      return NextResponse.json({ detail: (json as { detail?: string }).detail ?? "Failed to update record" }, { status: upstream.status });
    }

    return NextResponse.json(toLegacyRecord(json as BackendRecord), { status: upstream.status });
  }

  if (req.method === "DELETE" && tail.length === 1) {
    const recordId = Number(tail[0]);
    if (Number.isNaN(recordId)) {
      return NextResponse.json({ detail: "Invalid record id" }, { status: 400 });
    }

    const upstream = await fetchOps(`${base}/${recordId}`, {
      method: "DELETE",
      cache: "no-store",
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
    });
  }

  return NextResponse.json({ detail: "Unsupported records operation" }, { status: 405 });
}

async function handler(req: NextRequest, { params }: { params: { segments: string[] } }): Promise<NextResponse> {
  const segments = params.segments ?? [];
  if (segments.length < 2) {
    return NextResponse.json({ detail: "Invalid ops path" }, { status: 400 });
  }

  const [domain, module, ...rest] = segments;

  if (rest[0] === "records") {
    return handleRecords(req, domain, module, rest.slice(1));
  }

  const query = req.nextUrl.search || "";
  const targetPath = `${API_BASE}/api/ops/${segments.join("/")}${query}`;
  return passThrough(req, targetPath);
}

export async function GET(req: NextRequest, context: { params: { segments: string[] } }) {
  return handler(req, context);
}

export async function POST(req: NextRequest, context: { params: { segments: string[] } }) {
  return handler(req, context);
}

export async function PUT(req: NextRequest, context: { params: { segments: string[] } }) {
  return handler(req, context);
}

export async function PATCH(req: NextRequest, context: { params: { segments: string[] } }) {
  return handler(req, context);
}

export async function DELETE(req: NextRequest, context: { params: { segments: string[] } }) {
  return handler(req, context);
}
