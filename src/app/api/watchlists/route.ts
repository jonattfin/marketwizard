import {NextRequest, NextResponse} from "next/server";
import {watchlistRepository} from "@/app/database/repository";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const cursor = searchParams.get('cursor') ?? "";

  const data = await watchlistRepository.fetchWatchlist(cursor);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const created = await watchlistRepository.createWatchlist(body.name);
  return NextResponse.json(created, {status: 201});
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  await watchlistRepository.updateWatchlist(body.id, body.name);
  return NextResponse.json({success: true});
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  await watchlistRepository.deleteWatchlist(body.id);
  return NextResponse.json({success: true});
}