import { NextRequest, NextResponse } from "next/server";
import { miscRepository } from "@/app/database/repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const period = searchParams.get("period") ?? "";
  const countries = searchParams.get("countries") ?? "";

  const data = await miscRepository.fetchWorstIndustries(
    JSON.parse(countries) as string[],
    period,
  );
  return NextResponse.json(data);
}
