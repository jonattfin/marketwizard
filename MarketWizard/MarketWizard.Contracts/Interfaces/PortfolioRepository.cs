using MarketWizard.Contracts.Models;

namespace MarketWizard.Contracts.Interfaces;

public interface IPortfolioRepository
{
    Task<LazyPortfolioDto?> FetchLazyPortfolioById(int id);
    Task<LazyPortfolioDtoItems> FetchLazyPortfolios(int pageNumber = 1, int pageSize = 5);
}