import {MiscRepository} from "@/app/database/repositories/in-memory/misc-repository";
import {PortfolioRepository} from "@/app/database/repositories/in-memory/portfolio-repository";
import {EtfRepository} from "@/app/database/repositories/in-memory/etf-repository";
import {WatchlistRepository} from "@/app/database/repositories/in-memory/watchlist-repository";

import {MiscRepository as RealMiscRepository} from "@/app/database/repositories/real/misc-repository";
import {MiscRepository as RapidApiMiscRepository} from "@/app/database/repositories/rapid-api/misc-repository";

import {UpdateMiscRepository} from "@/app/database/repositories/real/update-misc-repository";

class Factory {
  isDev() {
    return process.env.NODE_ENV !== 'production';
  }

  createMiscRepository() {
    return this.isDev() ? new MiscRepository() : new RealMiscRepository();
  }

  createPortfolioRepository() {
    return new PortfolioRepository();
  }

  createEtfRepository() {
    return new EtfRepository();
  }

  createWatchlistRepository() {
    return new WatchlistRepository();
  }

  createUpdateMiscRepository() {
    return new UpdateMiscRepository(new MiscRepository(), new RapidApiMiscRepository());
  }
}

const factory = new Factory();

export const miscRepository = factory.createMiscRepository();
export const updateMiscRepository = factory.createUpdateMiscRepository();

export const portfolioRepository = factory.createPortfolioRepository();
export const etfRepository = factory.createEtfRepository();
export const watchlistRepository = factory.createWatchlistRepository();
