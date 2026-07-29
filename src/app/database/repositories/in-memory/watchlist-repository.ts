import {WatchlistItemType, WatchListPageType, WatchListType} from "@/shared/types";
import {LoremIpsum} from "lorem-ipsum";
import {IWatchlistRepository} from "@/app/database/repositories/interfaces/i-watchlist-repository";
import {random, range} from "es-toolkit";

const lorem = new LoremIpsum();

export class WatchlistRepository implements IWatchlistRepository {
  private readonly watchlists = createWatchlists();

  createWatchlist(name: string): Promise<WatchListType> {
    const newWatchlist = {
      id: lorem.generateWords(1),
      name,
      items: []
    }
    this.watchlists.items.push(newWatchlist);

    return Promise.resolve(newWatchlist);
  }

  createWatchlistItem(watchlistId: string, ticker: string): Promise<WatchlistItemType> {
    const watchlist = this.watchlists.items.find(w => w.id === watchlistId);
    const watchlistItem = {id: lorem.generateWords(1), name: ticker, ticker, description: lorem.generateSentences(1)};

    if (watchlist) {
      watchlist.items = [...watchlist.items, watchlistItem];
    }

    return Promise.resolve(watchlistItem);
  }

  deleteWatchlist(id: string): Promise<void> {
    this.watchlists.items = this.watchlists.items.filter(w => w.id !== id);

    return Promise.resolve(undefined);
  }

  deleteWatchlistItem(watchlistId: string, watchlistItemId: string): Promise<void> {
    const watchlist = this.watchlists.items.find(w => w.id === watchlistId);
    if (watchlist) {
      watchlist.items = watchlist.items.filter(i => i.id !== watchlistItemId);
    }

    return Promise.resolve(undefined);
  }

  fetchWatchlist(cursor: string = "0"): Promise<WatchListPageType> {
    const {items} = this.watchlists;

    const pageSize = 5;

    const start = Number.parseInt(cursor, 10);
    const end = Math.min(start + pageSize, items.length);

    return Promise.resolve({
      items: items.slice(start, end),
      nextCursor: end < items.length ? end.toString() : null
    });
  }

  updateWatchlist(id: string, name: string): Promise<void> {
    this.watchlists.items = this.watchlists.items.map(w => w.id === id ? {...w, name} : w);
    return Promise.resolve(undefined);
  }
}

function createWatchlists(): WatchListPageType {
  const items = range(20).map(index => {
    return {
      id: index.toString(),
      name: `${lorem.generateWords(1)}`,
      items: range(random(3)).map(jIndex => {
        return {
          id: `${index}${jIndex}`,
          name: `${lorem.generateWords(2)}`,
          description: `${lorem.generateSentences(2)}`,
          ticker: `${lorem.generateWords(1)}`,
        }
      })
    }
  })

  return {
    items,
    nextCursor: null
  }
}