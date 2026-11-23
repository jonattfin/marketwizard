import { MiscRepository } from "@/app/database/repositories/in-memory/misc-repository";
import { PortfolioRepository } from "@/app/database/repositories/in-memory/portfolio-repository";
import { EtfRepository } from "@/app/database/repositories/in-memory/etf-repository";
import { WatchlistRepository } from "@/app/database/repositories/in-memory/watchlist-repository";

import { DbMiscRepository } from "@/app/database/repositories/real/db-misc-repository";

import { UpdateMiscRepository } from "@/app/database/repositories/real/update-misc-repository";
// import {RapidMiscRepository} from "@/app/database/repositories/rapid-api/rapid-misc-repository";

enum Environment {
  Development = "development",
  Production = "production",
}

class UnitOfWork {
  private readonly _miscRepository = this.createMiscRepository();
  private readonly _updateMiscRepository = this.createUpdateMiscRepository();
  private readonly _portfolioRepository = this.createPortfolioRepository();
  private readonly _watchlistRepository = this.createWatchlistRepository();
  private readonly _etfRepository = this.createEtfRepository();

  get miscRepository() { return this._miscRepository; }

  get updateMiscRepository() { return this._updateMiscRepository; }

  get portfolioRepository() { return this._portfolioRepository; }

  get watchlistRepository() { return this._watchlistRepository; }

  get etfRepository() { return this._etfRepository; }

  private getEnvironment(): Environment | undefined {
    console.log("Getting environment...", process.env.NODE_ENV);

    if (process.env.NODE_ENV === "production") {
      return Environment.Production;
    }

     return Environment.Development;
  }

  createMiscRepository() {
    return this.getEnvironment() === Environment.Development
      ? new MiscRepository()
      : new DbMiscRepository();
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
    const miscRepository = new MiscRepository();
    return new UpdateMiscRepository(miscRepository);
  }
}

export const unitOfWork = new UnitOfWork();