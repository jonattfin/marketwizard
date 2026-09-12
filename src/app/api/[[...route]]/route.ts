import {Hono} from 'hono'
import {handle} from 'hono/vercel'
import {
  miscRepository,
  portfolioRepository,
  etfRepository,
  watchlistRepository,
  updateMiscRepository
} from "@/app/database/repository";

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello World!',
  })
})

app.get('/indices', async (c) => {
  const data = await miscRepository.fetchIndicesPerformance()

  return c.json(data);
})

app.get('/top-gainers', async (c) => {
  const {countries, period} = c.req.query();

  const data = await miscRepository.fetchGainers(
    JSON.parse(countries) as string[],
    period,
  )

  return c.json(data);
})

app.get('/top-losers', async (c) => {
  const {countries, period} = c.req.query();

  const data = await miscRepository.fetchLosers(
    JSON.parse(countries) as string[],
    period,
  )

  return c.json(data);
})

app.get('/top-news', async (c) => {
  const {countries} = c.req.query();

  const data = await miscRepository.fetchTopNews(
    JSON.parse(countries) as string[],
  )

  return c.json(data);
})

app.get('/top-industries', async (c) => {
  const {countries, period} = c.req.query();

  const data = await miscRepository.fetchTopIndustries(
    JSON.parse(countries) as string[],
    period
  )

  return c.json(data);
})

app.get('/worst-industries', async (c) => {
  const {countries, period} = c.req.query();

  const data = await miscRepository.fetchWorstIndustries(
    JSON.parse(countries) as string[],
    period
  )

  return c.json(data);
})

app.get('/sector-performance', async (c) => {
  const {countries} = c.req.query();

  const data = await miscRepository.fetchSectorPerformance(
    JSON.parse(countries) as string[],
  )

  return c.json(data);
})

app.get('/map-performance', async (c) => {
  const data = await miscRepository.fetchMapPerformance()
  return c.json(data);
})

// lazy portfolios

app.get('/lazy-portfolios', async (c) => {
  const data = await portfolioRepository.fetchLazyPortfolios()
  return c.json(data);
})

app.get('/lazy-portfolios/:id', async (c) => {
  const {id} = c.req.param()

  const data = await portfolioRepository.fetchPortfolioById(id)
  return c.json(data);
})

// etf

app.get('/etf', async (c) => {
  const data = await etfRepository.fetchEtfs()
  return c.json(data);
})

app.get('/etf/:id', async (c) => {
  const {id} = c.req.param()

  const data = await etfRepository.fetchEtfById(id)
  return c.json(data);
})

// watchlist

app.get('/watchlist', async (c) => {
  const {cursor} = c.req.query();

  const data = await watchlistRepository.fetchWatchlist(cursor);
  return c.json(data);
});

app.post('/watchlist', async (c) => {
  const body = await c.req.json()

  const data = await watchlistRepository.createWatchlist(body.name);
  return c.json(data);
});

app.put('/watchlist', async (c) => {
  const body = await c.req.json()
  await watchlistRepository.updateWatchlist(body.id, body.name);
  return c.json({updated: true}, 200);
});

app.delete('/watchlist', async (c) => {
  const body = await c.req.json()

  const data = await watchlistRepository.deleteWatchlist(body.id);
  return c.json(data);
});

app.post('/watchlist-item', async (c) => {
  const body = await c.req.json()

  const data = await watchlistRepository.createWatchlistItem(body.watchlistId, body.ticker);
  return c.json(data);
});

app.delete('/watchlist-item', async (c) => {
  const body = await c.req.json()

  const data = await watchlistRepository.deleteWatchlistItem(body.id, body.itemId);
  return c.json(data);
});

app.get('/cron-job', async (c) => {
  const data = await updateMiscRepository.updateAll();
  return c.json({updated: true});
});


export const GET = handle(app)
export const POST = handle(app)