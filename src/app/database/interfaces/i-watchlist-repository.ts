import {
  WatchlistItemType,
  WatchListPageType,
  WatchListType,
} from "@/shared/types";

export interface IWatchlistRepository {
  fetchWatchlist(cursor: string): Promise<WatchListPageType>;

  createWatchlist(name: string): Promise<WatchListType>;

  updateWatchlist(id: string, name: string): Promise<void>;

  deleteWatchlist(id: string): Promise<void>;

  createWatchlistItem(
    watchlistId: string,
    symbol: string,
  ): Promise<WatchlistItemType>;

  deleteWatchlistItem(
    watchlistId: string,
    watchlistItemId: string,
  ): Promise<void>;
}
