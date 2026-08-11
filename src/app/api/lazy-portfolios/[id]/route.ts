import { NextRequest, NextResponse } from "next/server";
import { portfolioRepository } from "@/app/database/repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await portfolioRepository.fetchLazyPortfolioById(
    Number.parseInt(id),
  );
  return NextResponse.json(data);
}
