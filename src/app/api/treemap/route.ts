import {NextRequest, NextResponse} from "next/server";
import {miscRepository} from "@/app/database/repository";

export async function GET(request: NextRequest) {
  const data = await miscRepository.fetchMapPerformance();
  return NextResponse.json(data);
}