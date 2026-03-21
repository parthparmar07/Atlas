"use client";

import { CheckCircle } from "lucide-react";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const formatLabel = (raw: string): string => {
  return raw
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

const scalarToText = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
  return String(value);
};

const previewValue = (value: unknown): string => {
  if (Array.isArray(value)) return `${value.length} items`;
  if (isPlainObject(value)) return `${Object.keys(value).length} fields`;
  return scalarToText(value);
};

function ValueRenderer({ value }: { value: unknown }) {
  if (!Array.isArray(value) && !isPlainObject(value)) {
    return <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{scalarToText(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-sm text-slate-400">No items</span>;
    }

    const primitives = value.every((item) => !Array.isArray(item) && !isPlainObject(item));
    if (primitives) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.slice(0, 10).map((item, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              {scalarToText(item)}
            </span>
          ))}
          {value.length > 10 ? <span className="text-xs text-slate-400">+{value.length - 10} more</span> : null}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {value.slice(0, 5).map((item, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 bg-white p-3">
            {isPlainObject(item) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(item).slice(0, 8).map(([itemKey, itemValue]) => (
                  <div key={itemKey} className="rounded-md bg-slate-50 border border-slate-100 px-2 py-1.5">
                    <div className="text-[10px] uppercase tracking-wider font-black text-slate-400">{formatLabel(itemKey)}</div>
                    <div className="text-xs font-semibold text-slate-700">{previewValue(itemValue)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm font-semibold text-slate-700">{scalarToText(item)}</span>
            )}
          </div>
        ))}
        {value.length > 5 ? <div className="text-xs text-slate-400">+{value.length - 5} additional records</div> : null}
      </div>
    );
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return <span className="text-sm text-slate-400">No fields</span>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {entries.slice(0, 10).map(([k, v]) => (
        <div key={k} className="rounded-md bg-white border border-slate-200 px-2.5 py-2">
          <div className="text-[10px] uppercase tracking-wider font-black text-slate-400">{formatLabel(k)}</div>
          <div className="text-xs font-semibold text-slate-700">{previewValue(v)}</div>
        </div>
      ))}
      {entries.length > 10 ? <div className="text-xs text-slate-400">+{entries.length - 10} more fields</div> : null}
    </div>
  );
}

export default function ExecutionTrace({ steps }: { steps: any[] }) {
  if (!steps?.length) return null;

  return (
    <div className="space-y-3">
      {steps.map((step: any, i: number) => {
        const rows = isPlainObject(step) ? Object.entries(step).filter(([key]) => key !== "status") : [];
        return (
          <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-2 mb-3 font-bold capitalize text-slate-800 dark:text-slate-100">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Step {i + 1}: {String(step?.status || "completed").replace(/_/g, " ")}
            </div>

            {!rows.length ? (
              <div className="text-sm text-slate-500">No additional details.</div>
            ) : (
              <div className="space-y-3">
                {rows.map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 mb-1.5">{formatLabel(key)}</div>
                    <ValueRenderer value={value} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
