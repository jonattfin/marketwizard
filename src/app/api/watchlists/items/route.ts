import { NextRequest, NextResponse } from "next/server";
import { watchlistRepository } from "@/app/database/repository";

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Assume the body contains new watchlist data
  const created = await watchlistRepository.createWatchlistItem(
    body.watchlistId,
    body.ticker,
  );
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  // Assume the body contains the id of the watchlist to delete
  await watchlistRepository.deleteWatchlistItem(body.id, body.itemId);
  return NextResponse.json({ success: true });
}
