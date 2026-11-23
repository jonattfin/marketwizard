using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;

namespace MarketWizard.Infrastructure.Repositories;

public sealed class PortfolioRepository : IPortfolioRepository
{
    private readonly IReadOnlyList<LazyPortfolioDto> _lazyPortfolios = CreateLazyPortfolios();

    public async Task<LazyPortfolioDto?> FetchLazyPortfolioById(int id)
    {
        var match = _lazyPortfolios.FirstOrDefault(p => p.Id == id);
        return await Task.FromResult(match);
    }

    public async Task<LazyPortfolioDtoItems> FetchLazyPortfolios(
        int pageNumber = 1,
        int pageSize = 5)
    {
        var safePageNumber = Math.Max(1, pageNumber);
        var safePageSize = Math.Max(1, pageSize);

        var items = _lazyPortfolios
            .Skip((safePageNumber - 1) * safePageSize)
            .Take(safePageSize)
            .ToArray();

        return await Task.FromResult(new LazyPortfolioDtoItems(_lazyPortfolios.Count, items));
    }
    

    private static List<LazyPortfolioDto> CreateLazyPortfolios() =>
    [
        new(
            Id: 1,
            Name: "Ray Dalio All Weather Portfolio",
            OneDay: 0.1,
            Ytd: 0.3,
            DividendYield: 2,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Ray Dalio All Weather Portfolio can be implemented with 5 ETFs. This portfolio has a medium risk, signifying moderate fluctuations in value. It is suitable for investors with a balanced approach to risk and return, seeking steady growth while tolerating some level of volatility.",
            Items:
            [
                new(11, 30, "VTI", "Vanguard Total Stock Market", "Equity US, Large Cap", LazyItemType.S),
                new(12, 40, "TLT", "iShares 20+ Year Treasury Bond", "Bond US, Long Term", LazyItemType.F),
                new(13, 15, "IEI", "iShares 3-7 Year Treasury Bond", "Equity US, Intermediate Term", LazyItemType.F),
                new(14, 7.5, "DBC", "Invesco DB Commodity Tracking", "Commodity, Broad Diversified", LazyItemType.C),
                new(15, 7.5, "GLD", "SDPR Gold Trust", "Commodity, Gold", LazyItemType.C)
            ]
        ),
        new(
            Id: 2,
            Name: "Warren Buffett Portfolio",
            OneDay: 0.01,
            Ytd: 0.3,
            DividendYield: 3,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Warren Buffett Portfolio can be implemented with 2 ETFs. This portfolio has a very high risk, meaning it can experience significant fluctuations in value. It is suitable for investors with a high risk tolerance who are seeking substantial returns and can withstand large drawdowns.",
            Items:
            [
                new(21, 90, "VV", "Vanguard Large Cap ETF", "Equity US, Large Cap", LazyItemType.S),
                new(22, 10, "SHY", "Bond, US, Short Term", "Bond US, Long Term", LazyItemType.F)
            ]
        ),
        new(
            Id: 3,
            Name: "Tyler Golden Butterfly Portfolio",
            OneDay: 0.02,
            Ytd: 0.3,
            DividendYield: 1,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Tyler Golden Butterfly Portfolio can be implemented with 5 ETFs. This portfolio has a high risk, indicating it can undergo considerable value changes. It is appropriate for investors with a high risk tolerance who are aiming for higher returns and can handle notable drawdowns.",
            Items:
            [
                new(31, 30, "IJS", "Equity, U.S., Small Cap, Value (USD)", "iShares S&P Small Cap ETF", LazyItemType.S),
                new(32, 20, "VTI", "Vanguard Total Stock Market", "Equity US, Large Cap", LazyItemType.S),
                new(33, 20, "SHY", "iShares 3-7 Year Treasury Bond", "Bond US, Short Term", LazyItemType.F),
                new(34, 20, "TLT", "IShares 20+ Year Treasury Bond", "Bond, US, Long Term", LazyItemType.F),
                new(35, 20, "GLD", "SDPR Gold Trust", "Commodity, Gold", LazyItemType.C)
            ]
        ),
        new(
            Id: 4,
            Name: "Bogleheads Three Funds Portfolio",
            OneDay: 0.01,
            Ytd: 0.1,
            DividendYield: 1,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "Bogleheads Three Funds Portfolio",
            Items:
            [
                new(41, 50, "VTI", "Vanguard Total Stock Market", "Equity US, Large Cap", LazyItemType.S),
                new(42, 30, "VEU", "Vanguard Total Stock Market", "Bond US, Long Term", LazyItemType.F),
                new(43, 20, "BND", "Vanguard Total Bond Market", "Bond US, Long Term", LazyItemType.F)
            ]
        ),
        new(
            Id: 5,
            Name: "Cathie Wood Ark Tech Portfolio",
            OneDay: -0.01,
            Ytd: 0.2,
            DividendYield: 1,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Cathie Wood Ark Tech Portfolio can be implemented with 4 ETFs. This portfolio has a very high risk, meaning it can experience significant fluctuations in value. It is suitable for investors with a high risk tolerance who are seeking substantial returns and can withstand large drawdowns.",
            Items:
            [
                new(51, 25, "ARKG", "ARK Genomic Revolution ETF", "Equity US, Large Cap", LazyItemType.S),
                new(52, 25, "ARKK", "ARK Innovation ETF", "Equity US, Large Cap", LazyItemType.S),
                new(53, 25, "ARKQ", "ARK Autonomous Tech ETF", "Equity US, Large Cap", LazyItemType.S),
                new(54, 25, "ARKW", "ARK Next Gen Internet ETF", "Equity US, Large Cap", LazyItemType.S)
            ]
        ),
        new(
            Id: 6,
            Name: "Davide Pisicchio Diavola Portfolio",
            OneDay: 0.2,
            Ytd: -0.3,
            DividendYield: 1,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Davide Pisicchio Diavola Portfolio can be implemented with 4 ETFs. This portfolio has a very high risk, meaning it can experience significant fluctuations in value. It is suitable for investors with a high risk tolerance who are seeking substantial returns and can withstand large drawdowns.",
            Items:
            [
                new(61, 65, "VTI", "Vanguard Total Stock Market", "Equity US, Large Cap", LazyItemType.S),
                new(62, 25, "QQQ", "Invesco QQQ Trust", "Equity US, Large Cap", LazyItemType.S),
                new(63, 5, "BSV", "Vanguard Short Term Bond Market", "Equity US, Large Cap", LazyItemType.F),
                new(64, 5, "ARKW", "iShares 3-7 Year Treasury Bond", "Bond US, Short Term", LazyItemType.S)
            ]
        ),
        new(
            Id: 7,
            Name: "Developed World ex-US 20/80 Portfolio",
            OneDay: 0.1,
            Ytd: 0.4,
            DividendYield: 1,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Developed World ex-US 20/80 Portfolio can be implemented with 2 ETFs. This portfolio has a low risk, suggesting it experiences minor value changes. It is ideal for conservative investors who prioritize capital preservation and prefer stable, predictable returns.",
            Items:
            [
                new(71, 20, "VEA", "Vanguard FTSE Developed Markets", "Equity US, Large Cap", LazyItemType.S),
                new(72, 80, "BNDX", "Vanguard Total International Bond", "Equity US, Large Cap", LazyItemType.F)
            ]
        ),
        new(
            Id: 8,
            Name: "Scott Burns Couch Potato Portfolio",
            OneDay: 0.01,
            Ytd: 0.1,
            DividendYield: 3,
            PerformanceRank: 1,
            MaxDrawdown: 1,
            ExpenseRatio: 1,
            SharpeRatio: 1,
            Description: "The Scott Burns Couch Potato Portfolio can be implemented with 2 ETFs. This portfolio has a medium risk, signifying moderate fluctuations in value. It is suitable for investors with a balanced approach to risk and return, seeking steady growth while tolerating some level of volatility.",
            Items:
            [
                new(81, 50, "VTI", "Vanguard Total Stock Market", "Equity US, Large Cap", LazyItemType.S),
                new(82, 50, "TIP", "iShared TIPS Bond", "Bond US, Long Term", LazyItemType.F)
            ]
        )
    ];
}