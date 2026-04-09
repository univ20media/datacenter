import { Suspense } from "react";
import PlannerClient from "./PlannerClient";

function PlannerLoadingFallback() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          기획 추천
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          이번 달 반응과 다음 달 시즌 이슈를 연결해 다음 아이템을 찾습니다
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        플래너를 불러오는 중입니다...
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<PlannerLoadingFallback />}>
      <PlannerClient />
    </Suspense>
  );
}
