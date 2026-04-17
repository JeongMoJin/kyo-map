import housesData from "@/data/houses.json";
import type { House } from "./types";

export const HOUSES = housesData as House[];

export function getHouseById(id: string): House | undefined {
  return HOUSES.find((h) => h.id === id);
}

export function getSidoList(): string[] {
  const set = new Set<string>();
  for (const h of HOUSES) set.add(h.address.split(" ")[0]);
  return Array.from(set).sort();
}
