import { NextRequest, NextResponse } from "next/server";
import {miscRepository} from "@/app/database/repository";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const countries = searchParams.get('countries') ?? "";

  const data = await miscRepository.fetchSectorPerformance(JSON.parse(countries) as string[]);
  return NextResponse.json(data);
}