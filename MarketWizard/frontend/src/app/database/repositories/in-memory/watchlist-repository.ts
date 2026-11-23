import {
  WatchlistItemType,
  WatchListPageType,
  WatchListType,
} from "@/shared/types";
import {LoremIpsum} from "lorem-ipsum";
import {IWatchlistRepository} from "@/app/database/interfaces/i-watchlist-repository";

const lorem = new LoremIpsum();

export class WatchlistRepository implements IWatchlistRepository {
  private readonly watchlists = createWatchlists();

  async createWatchlist(name: string): Promise<WatchListType> {
    const newWatchlist = {
      id: lorem.generateWords(1),
      name,
      items: [],
    };
    this.watchlists.items.push(newWatchlist);

    return newWatchlist;
  }

  async createWatchlistItem(
    watchlistId: string,
    ticker: string,
  ): Promise<WatchlistItemType> {
    const watchlist = this.watchlists.items.find((w) => w.id === watchlistId);
    const watchlistItem = {
      id: lorem.generateWords(1),
      name: ticker,
      ticker,
      description: lorem.generateSentences(1),
    };

    if (watchlist) {
      watchlist.items = [...watchlist.items, watchlistItem];
    }

    return watchlistItem;
  }

  async deleteWatchlist(id: string): Promise<void> {
    this.watchlists.items = this.watchlists.items.filter((w) => w.id !== id);

    return undefined;
  }

  async deleteWatchlistItem(
    watchlistId: string,
    watchlistItemId: string,
  ): Promise<void> {
    const watchlist = this.watchlists.items.find((w) => w.id === watchlistId);
    if (watchlist) {
      watchlist.items = watchlist.items.filter((i) => i.id !== watchlistItemId);
    }

    return undefined;
  }

  async fetchWatchlist(cursor: string = "0"): Promise<WatchListPageType> {
    const {items} = this.watchlists;

    const pageSize = 2;

    const start = Number.parseInt(cursor, 10);
    const end = Math.min(start + pageSize, items.length);

    return {
      items: items.slice(start, end),
      nextCursor: end < items.length ? end.toString() : null,
    };
  }

  async updateWatchlist(id: string, name: string): Promise<void> {
    this.watchlists.items = this.watchlists.items.map((w) =>
      w.id === id ? {...w, name} : w,
    );
    return undefined;
  }
}

function createWatchlists(): WatchListPageType {

  const mag_seven = ["Nvidia", "Apple", "Microsoft", "Amazon", "Alphabet", "Tesla"];
  const cryptocurrencies = ["Bitcoin", "Ethereum", "XRP"];
  const futures = ["Gold", "Silver", "Cooper", "Crude Oil"]

  const getItems = (values: string[]) => {
    return values.map(v => ({
        id: v,
        ticker: v,
        name: v,
        description: v,
      }))
  }

  const items: WatchListType[] = [
    {
      id: "Mag 7",
      name: "Magnificent 7",
      items: getItems(mag_seven),
    },
    {
      id: "Futures",
      name: "Futures",
      items: getItems(futures)
    },
    {
      id: "Crypto",
      name: "Crypto",
      items: getItems(cryptocurrencies),
    },
  ]

  return {
    items,
    nextCursor: null,
  };
}
