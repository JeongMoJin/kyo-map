"use client";

import { useCallback, useEffect, useState } from "react";
import type { CaseActivity, CaseStatus, WorkCase } from "@/lib/workflow";

const STORAGE_KEY = "gonggajido-work-cases-v1";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`.toUpperCase();
}

function createActivity(type: CaseActivity["type"], label: string, note?: string) {
  return {
    id: createId("ACT"),
    at: nowIso(),
    type,
    label,
    note,
  };
}

function readCases(): WorkCase[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WorkCase[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCases(cases: WorkCase[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

function createWorkCase(
  houseId: string,
  status: CaseStatus,
  label: string,
  note?: string,
  contact?: string,
): WorkCase {
  const createdAt = nowIso();

  return {
    id: createId(`CASE-${houseId}`),
    houseId,
    status,
    memo: note ?? "",
    contact,
    createdAt,
    updatedAt: createdAt,
    activity: [createActivity("submission", label, note)],
  };
}

export function useWorkCases() {
  const [cases, setCases] = useState<WorkCase[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCases(readCases());
    setLoaded(true);
  }, []);

  const persist = useCallback((updater: (current: WorkCase[]) => WorkCase[]) => {
    setCases((current) => {
      const next = updater(current);
      writeCases(next);
      return next;
    });
  }, []);

  const getCase = useCallback(
    (houseId: string) => cases.find((item) => item.houseId === houseId),
    [cases],
  );

  const getStatus = useCallback(
    (houseId: string): CaseStatus => getCase(houseId)?.status ?? "미검토",
    [getCase],
  );

  const updateStatus = useCallback(
    (houseId: string, status: CaseStatus, note?: string) => {
      persist((current) => {
        const existing = current.find((item) => item.houseId === houseId);
        const label = `상태를 ${status}(으)로 변경`;
        if (!existing) {
          return [
            ...current,
            createWorkCase(houseId, status, label, note),
          ];
        }

        return current.map((item) => {
          if (item.houseId !== houseId) return item;
          const activity = createActivity("status", label, note);
          return {
            ...item,
            status,
            memo: note?.trim() ? note : item.memo,
            updatedAt: nowIso(),
            activity: [activity, ...item.activity],
          };
        });
      });
    },
    [persist],
  );

  const addNote = useCallback(
    (houseId: string, note: string) => {
      const cleaned = note.trim();
      if (!cleaned) return;

      persist((current) => {
        const existing = current.find((item) => item.houseId === houseId);
        if (!existing) {
          return [
            ...current,
            createWorkCase(houseId, "처리중", "업무 메모 추가", cleaned),
          ];
        }

        return current.map((item) => {
          if (item.houseId !== houseId) return item;
          const activity = createActivity("note", "업무 메모 추가", cleaned);
          return {
            ...item,
            memo: cleaned,
            updatedAt: nowIso(),
            activity: [activity, ...item.activity],
          };
        });
      });
    },
    [persist],
  );

  const createSubmission = useCallback(
    ({
      houseId,
      status,
      label,
      note,
      contact,
    }: {
      houseId: string;
      status: CaseStatus;
      label: string;
      note?: string;
      contact?: string;
    }) => {
      persist((current) => {
        const existing = current.find((item) => item.houseId === houseId);
        if (!existing) {
          return [
            ...current,
            createWorkCase(houseId, status, label, note, contact),
          ];
        }

        return current.map((item) => {
          if (item.houseId !== houseId) return item;
          const activity = createActivity("submission", label, note);
          return {
            ...item,
            status,
            contact: contact?.trim() || item.contact,
            memo: note?.trim() ? note : item.memo,
            updatedAt: nowIso(),
            activity: [activity, ...item.activity],
          };
        });
      });
    },
    [persist],
  );

  return {
    cases,
    loaded,
    getCase,
    getStatus,
    updateStatus,
    addNote,
    createSubmission,
  };
}
