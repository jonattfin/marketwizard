import {Hono} from 'hono'
import {handle} from 'hono/vercel'
import {unitOfWork} from '@/app/database/unit-of-work'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello World!',
  })
})

app.get('/indices', async (c) => {
  const data = await unitOfWork.miscRepository.fetchIndicesPerformance()

  return c.json(data);
})

app.get('/top-gainers', async (c) => {
  const {countries, period} = c.req.query();

  const data = await unitOfWork.miscRepository.fetchGainers(
    JSON.parse(countries) as string[],
    period,
  )

  return c.json(data);
})

app.get('/top-losers', async (c) => {
  const {countries, period} = c.req.query();

  const data = await unitOfWork.miscRepository.fetchLosers(
    JSON.parse(countries) as string[],
    period,
  )

  return c.json(data);
})

app.get('/top-news', async (c) => {
  const {countries} = c.req.query();

  const data = await unitOfWork.miscRepository.fetchTopNews(
    JSON.parse(countries) as string[],
  )

  return c.json(data);
})

app.get('/top-industries', async (c) => {
  const {countries, period} = c.req.query();

  const data = await unitOfWork.miscRepository.fetchTopIndustries(
    JSON.parse(countries) as string[],
    period
  )

  return c.json(data);
})

app.get('/worst-industries', async (c) => {
  const {countries, period} = c.req.query();

  const data = await unitOfWork.miscRepository.fetchWorstIndustries(
    JSON.parse(countries) as string[],
    period
  )

  return c.json(data);
})

app.get('/sector-performance', async (c) => {
  const {countries} = c.req.query();

  const data = await unitOfWork.miscRepository.fetchSectorPerformance(
    JSON.parse(countries) as string[],
  )

  return c.json(data);
})

app.get('/map-performance', async (c) => {
  const data = await unitOfWork.miscRepository.fetchMapPerformance()
  return c.json(data);
})

// lazy portfolios

app.get('/lazy-portfolios', async (c) => {
  const data = await unitOfWork.portfolioRepository.fetchLazyPortfolios()
  return c.json(data);
})

app.get('/lazy-portfolios/:id', async (c) => {
  const {id} = c.req.param()

  const data = await unitOfWork.portfolioRepository.fetchPortfolioById(id)
  return c.json(data);
})

// etf

app.get('/etf', async (c) => {
  const data = await unitOfWork.etfRepository.fetchEtfs()
  return c.json(data);
})

app.get('/etf/:id', async (c) => {
  const {id} = c.req.param()

  const data = await unitOfWork.etfRepository.fetchEtfById(id)
  return c.json(data);
})

// watchlist

app.get('/watchlist', async (c) => {
  const {cursor} = c.req.query();

  const data = await unitOfWork.watchlistRepository.fetchWatchlist(cursor);
  return c.json(data);
});

app.post('/watchlist', async (c) => {
  const body = await c.req.json()

  const data = await unitOfWork.watchlistRepository.createWatchlist(body.name);
  return c.json(data);
});

app.put('/watchlist', async (c) => {
  const body = await c.req.json()
  await unitOfWork.watchlistRepository.updateWatchlist(body.id, body.name);
  return c.json({updated: true}, 200);
});

app.delete('/watchlist', async (c) => {
  const body = await c.req.json()

  const data = await unitOfWork.watchlistRepository.deleteWatchlist(body.id);
  return c.json(data);
});

app.post('/watchlist-item', async (c) => {
  const body = await c.req.json()

  const data = await unitOfWork.watchlistRepository.createWatchlistItem(body.watchlistId, body.ticker);
  return c.json(data);
});

app.delete('/watchlist-item', async (c) => {
  const body = await c.req.json()

  const data = await unitOfWork.watchlistRepository.deleteWatchlistItem(body.id, body.itemId);
  return c.json(data);
});

app.get('/cron-job', async (c) => {
  const data = await unitOfWork.updateMiscRepository.updateAll();
  return c.json({updated: true});
});


export const GET = handle(app)
export const POST = handle(app)