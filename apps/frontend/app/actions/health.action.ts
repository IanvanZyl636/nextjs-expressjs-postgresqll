"use server";

import { apiFetch } from "@/lib/api";

export async function health() {
  return apiFetch("/api/health");
}