export type CaseStatus = "미검토" | "현장확인" | "처리중" | "보류" | "완료";

export type CaseActivityType = "status" | "note" | "submission";

export interface CaseActivity {
  id: string;
  at: string;
  type: CaseActivityType;
  label: string;
  note?: string;
}

export interface WorkCase {
  id: string;
  houseId: string;
  status: CaseStatus;
  memo: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
  activity: CaseActivity[];
}

export const CASE_STATUSES: CaseStatus[] = [
  "미검토",
  "현장확인",
  "처리중",
  "보류",
  "완료",
];

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  미검토: "미검토",
  현장확인: "현장확인",
  처리중: "처리중",
  보류: "보류",
  완료: "완료",
};

export const CASE_STATUS_STYLES: Record<CaseStatus, string> = {
  미검토: "bg-slate-50 text-slate-700 ring-slate-200",
  현장확인: "bg-red-50 text-red-700 ring-red-100",
  처리중: "bg-blue-50 text-blue-700 ring-blue-100",
  보류: "bg-amber-50 text-amber-700 ring-amber-100",
  완료: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};
