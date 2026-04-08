import React from "react";

type KpiCardProps = {
  title: string;
  description: string;
  value: number;
  change: number;
  suffix?: string;
};

function formatValue(value: number, suffix = "") {
  if (!Number.isFinite(value)) return "-";
  return `${value.toLocaleString()}${suffix}`;
}

function getChangeStyle(change: number) {
  if (change > 0) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (change < 0) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

function getChangeLabel(change: number) {
  if (!Number.isFinite(change)) return "-";
  if (change > 0) return `▲ ${Math.abs(change).toFixed(1)}%`;
  if (change < 0) return `▼ ${Math.abs(change).toFixed(1)}%`;
  return "0.0%";
}

export default function KpiCard({
  title,
  description,
  value,
  change,
  suffix = "",
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>

      <div className="mt-6">
        <p className="text-5xl font-bold tracking-tight text-slate-900">
          {formatValue(value, suffix)}
        </p>
      </div>

      <div className="mt-5">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getChangeStyle(
            change
          )}`}
        >
          {getChangeLabel(change)} <span className="ml-1">(전월 대비)</span>
        </span>
      </div>
    </div>
  );
}
