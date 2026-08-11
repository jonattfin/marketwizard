import { NextRequest, NextResponse } from "next/server";
import { etfRepository } from "@/app/database/repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await etfRepository.fetchEtfById(id);
  return NextResponse.json(data);
}
