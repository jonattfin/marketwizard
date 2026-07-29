import { NextRequest, NextResponse } from "next/server";
import {portfolioRepository} from "@/app/database/repository";

export async function GET(request: NextRequest) {
  const data = await portfolioRepository.fetchPortfoliosArea();
  return NextResponse.json(data);
}