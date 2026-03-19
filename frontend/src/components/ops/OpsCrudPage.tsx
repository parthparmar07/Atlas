"use client";

import { useEffect, useMemo, useState } from "react";

type Primitive = string | number;
type RowData = Record<string, Primitive>;

type FieldSpec = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "select";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
};

type SummarySpec = {
  label: string;
  kind: "count" | "sum" | "avg" | "countWhere";
  field?: string;
  equals?: string;
  suffix?: string;
};

type OpsRecord = {
  id: string;
  data: RowData;
};

type Props = {
  title: string;
  subtitle: string;
  endpoint: string;
  fields: FieldSpec[];
  listTitle: string;
  createTitle: string;
  summary: SummarySpec[];
  seedData: RowData[];
  statusKey?: string;
  statusOptions?: string[];
  accentClass?: string;
};

function getDefaultValue(field: FieldSpec): Primitive {
  if (field.type === "number") return 0;
  if (field.type === "select") return field.options?.[0] ?? "";
  return "";
}

function formatMetric(value: number | string, suffix?: string): string {
  if (typeof value === "number") {
    return `${value.toLocaleString()}${suffix ?? ""}`;
  }
  return `${value}${suffix ?? ""}`;
}

export default function OpsCrudPage({
  title,
  subtitle,
  endpoint,
  fields,
  listTitle,
  createTitle,
  summary,
  seedData,
  statusKey,
  statusOptions,
  accentClass = "bg-indigo-600 hover:bg-indigo-700",
}: Props) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultDraft = useMemo(() => {
    const base: RowData = {};
    fields.forEach((f) => {
      base[f.key] = getDefaultValue(f);
    });
    return base;
  }, [fields]);

  const [draft, setDraft] = useState<RowData>(defaultDraft);

  async function loadRows() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${endpoint}/records`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load records");
      const json = (await res.json()) as { records?: OpsRecord[] };
      const records = json.records ?? [];
      setRows(records.map((r) => ({ ...r.data, id: r.id })));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function seedIfEmpty() {
    if (rows.length > 0) return;
    await Promise.all(
      seedData.map((row) =>
        fetch(`${endpoint}/records`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { ...row, id: crypto.randomUUID() } }),
        }),
      ),
    );
    await loadRows();
  }

  async function createRow() {
    await fetch(`${endpoint}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...draft, id: crypto.randomUUID() } }),
    });
    setDraft(defaultDraft);
    await loadRows();
  }

  async function updateStatus(row: RowData, status: string) {
    if (!statusKey) return;
    const id = String(row.id);
    await fetch(`${endpoint}/records/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { ...row, [statusKey]: status } }),
    });
    await loadRows();
  }

  const summaryValues = useMemo(() => {
    return summary.map((item) => {
      if (item.kind === "count") {
        return { label: item.label, value: rows.length, suffix: item.suffix };
      }
      if (item.kind === "sum") {
        const field = item.field ?? "";
        const value = rows.reduce((acc, row) => acc + Number(row[field] ?? 0), 0);
        return { label: item.label, value, suffix: item.suffix };
      }
      if (item.kind === "avg") {
        const field = item.field ?? "";
        const value = rows.length
          ? Math.round((rows.reduce((acc, row) => acc + Number(row[field] ?? 0), 0) / rows.length) * 10) / 10
          : 0;
        return { label: item.label, value, suffix: item.suffix };
      }
      const field = item.field ?? "";
      const expected = item.equals ?? "";
      const value = rows.filter((row) => String(row[field] ?? "") === expected).length;
      return { label: item.label, value, suffix: item.suffix };
    });
  }, [rows, summary]);

  useEffect(() => {
    setDraft(defaultDraft);
  }, [defaultDraft]);

  useEffect(() => {
    void loadRows();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-100 to-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {summaryValues.map((s) => (
              <div key={s.label} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{formatMetric(s.value, s.suffix)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{listTitle}</h2>
              <button onClick={seedIfEmpty} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Seed Sample Data</button>
            </div>
            {loading ? <p className="text-sm text-slate-500">Loading...</p> : null}
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={String(row.id)} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{String(row[fields[0].key] ?? "Item")}</p>
                      <p className="text-xs text-slate-500">
                        {fields.slice(1, 4).map((f) => `${f.label}: ${String(row[f.key] ?? "-")}`).join(" · ")}
                      </p>
                    </div>
                    {statusKey && statusOptions?.length ? (
                      <select
                        value={String(row[statusKey] ?? "")}
                        onChange={(e) => void updateStatus(row, e.target.value)}
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                </div>
              ))}
              {!loading && rows.length === 0 ? <p className="text-sm text-slate-500">No records yet. Seed or add one.</p> : null}
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">{createTitle}</h2>
            <div className="mt-3 space-y-3">
              {fields.map((field) => {
                const value = draft[field.key];
                if (field.type === "select") {
                  return (
                    <select
                      key={field.key}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                      value={String(value ?? "")}
                      onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                    >
                      {(field.options ?? []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  );
                }

                return (
                  <input
                    key={field.key}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    placeholder={field.label}
                    value={String(value ?? "")}
                    onChange={(e) => {
                      const nextValue: Primitive = field.type === "number" ? Number(e.target.value) || 0 : e.target.value;
                      setDraft((d) => ({ ...d, [field.key]: nextValue }));
                    }}
                  />
                );
              })}

              <button onClick={() => void createRow()} className={`w-full rounded-lg px-3 py-2 text-sm font-semibold text-white ${accentClass}`}>
                Save Record
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
