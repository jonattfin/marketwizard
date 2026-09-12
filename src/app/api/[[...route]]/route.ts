import {Hono} from 'hono'
import {handle} from 'hono/vercel'
import {miscRepository, portfolioRepository} from "@/app/database/repository";

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

app.get('/lazy-portfolios', async (c) => {
  const data = await portfolioRepository.fetchLazyPortfolios()

  return c.json(data);
})

app.get('/lazy-portfolios/:id', async (c) => {
  const {id} = c.req.param()

  const data = await portfolioRepository.fetchPortfolioById(id)

  return c.json(data);
})

export const GET = handle(app)
export const POST = handle(app)