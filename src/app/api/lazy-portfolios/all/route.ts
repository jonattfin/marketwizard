import {NextRequest, NextResponse} from "next/server";
import {portfolioRepository} from "@/app/database/repository";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);

  const pageNumber = searchParams.get('pageNumber') ?? 1;
  const pageSize = searchParams.get('pageSize') ?? 10;

  const data = await portfolioRepository.fetchLazyPortfolios(
    Number.parseInt(pageNumber.toString(), 10),
    Number.parseInt(pageSize.toString(), 10)
  );

  return NextResponse.json(data);
}