import { NextRequest, NextResponse } from "next/server";
import { etfRepository } from "@/app/database/repository";

export async function GET(request: NextRequest) {
  const data = await etfRepository.fetchEtfs();

  return NextResponse.json(data);
}
