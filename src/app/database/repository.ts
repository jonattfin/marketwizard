import {MiscRepository} from "@/app/database/repositories/in-memory/misc-repository";
import {PortfolioRepository} from "@/app/database/repositories/in-memory/portfolio-repository";
import {EtfRepository} from "@/app/database/repositories/in-memory/etf-repository";
import {WatchlistRepository} from "@/app/database/repositories/in-memory/watchlist-repository";

import {DbMiscRepository} from "@/app/database/repositories/real/db-misc-repository";

import {UpdateMiscRepository} from "@/app/database/repositories/real/update-misc-repository";
import {RapidMiscRepository} from "@/app/database/repositories/rapid-api/rapid-misc-repository";

enum Environment {
	Development = 'development',
	Production = 'production',
}

class Factory {
	getEnvironment(): Environment {
		if (process.env.NODE_ENV === 'development') {
			return Environment.Development;
		} else if (process.env.NODE_ENV === 'production') {
			return Environment.Production;
		}

		return Environment.Development;
	}

	createMiscRepository() {
		return this.getEnvironment() === Environment.Development
			? new MiscRepository() : new DbMiscRepository();
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
		const rapidMiscRepository = new RapidMiscRepository();
		return new UpdateMiscRepository(rapidMiscRepository);
	}
}

const factory = new Factory();

export const miscRepository = factory.createMiscRepository();
export const updateMiscRepository = factory.createUpdateMiscRepository();

export const portfolioRepository = factory.createPortfolioRepository();
export const etfRepository = factory.createEtfRepository();
export const watchlistRepository = factory.createWatchlistRepository();
