using MarketWizard.Server.FinancialModels;

namespace MarketWizard.Server.Repositories;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public interface IEtfRepository
{
    Task<EtfThemeByIdDto?> FetchEtfByIdAsync(string id);
    Task<IReadOnlyList<EtfThemeDto>> FetchEtfsAsync();
}

public sealed class EtfRepository : IEtfRepository
{
    private const string SampleParagraphs =
        "Global equity benchmarks continue to attract institutional and retail flows across core index strategies. " +
        "Index replication offers broad market exposure with transparent holdings and low turnover.\n\n" +
        "Investors weigh expense ratios, tracking difference, and currency exposure when selecting thematic or broad-market funds. " +
        "Periodic rebalancing keeps weights aligned with underlying index rules.\n\n" +
        "Liquidity depth and fund domicile remain key considerations for cross-border allocation.";

    private readonly IReadOnlyList<EtfThemeDto> _etfThemes = CreateEtfThemes();

    public Task<EtfThemeByIdDto?> FetchEtfByIdAsync(string id)
    {
        var theme = _etfThemes.FirstOrDefault(t => t.Theme == id);
        var dto = CreateEtfByIdDto(theme?.Name, theme?.ImageUrl, theme?.Description);

        return Task.FromResult<EtfThemeByIdDto?>(dto);
    }

    public Task<IReadOnlyList<EtfThemeDto>> FetchEtfsAsync()
    {
        return Task.FromResult(_etfThemes);
    }

    private static List<EtfThemeDto> CreateEtfThemes() =>
    [
        new(
            Id: 1,
            Name: "S&P 500 ETFs",
            Theme: "SP500-ETFs",
            Description: SampleParagraphs,
            ImageUrl: "https://plus.unsplash.com/premium_photo-1663931932687-c4c2366a5c61?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ),
        new(
            Id: 2,
            Name: "Nasdaq 100 ETFs",
            Theme: "Nasdaq-100-ETFs",
            Description: SampleParagraphs,
            ImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ),
        new(
            Id: 3,
            Name: "MSCI World ETFs",
            Theme: "MSCI-World-ETFs",
            Description: SampleParagraphs,
            ImageUrl: "https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ),
        new(
            Id: 4,
            Name: "Defense ETFs",
            Theme: "Defense-ETFs",
            Description:
                "The military and defense industry is a controversial topic. " +
                "But even though stocks from the armaments sector are a no-go investment for many for understandable moral reasons, the industry flourishes especially in troubled times. " +
                "This is because the customers of the arms companies are almost exclusively states, which usually have large budgets. " +
                "In addition, the technologies of the aerospace, military and defense companies are often also used in civil aviation and space travel after their introduction.",
            ImageUrl: "https://images.unsplash.com/photo-1489223339793-de491ea9108b?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ),
        new(
            Id: 5,
            Name: "Artificial Intelligence ETFs",
            Theme: "AI-ETFs",
            Description:
                "Artificial Intelligence is an area of computer science that focuses the creation of intelligent machines that work and react like humans. Artificial Intelligence ETFs potentially stand to benefit from increased adoption and utilization of artificial intelligence, including those involved with industrial and non-industrial robotics, automation, 3D printing, natural language processing, social media, and autonomous vehicles.",
            ImageUrl: "https://images.unsplash.com/photo-1612010167108-3e6b327405f0?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        )
    ];

    private static EtfThemeByIdDto CreateEtfByIdDto(
        string? name = null,
        string? imageUrl = null,
        string? description = null)
    {
        List<EtfByIdItemDto> items =
        [
            new(
                Isin: 1,
                Name: "VanEck Defense UCITS Etf",
                FundSize: 6118,
                Ter: 0.99,
                UseOfProfits: "Accumulating",
                FundDomicile: "Ireland",
                ReplicationMethod: "Full replication"
            ),
            new(
                Isin: 2,
                Name: "WisdomTree Europe Defense UCITS",
                FundSize: 3099,
                Ter: 0.99,
                UseOfProfits: "Accumulating",
                FundDomicile: "Ireland",
                ReplicationMethod: "Full replication"
            ),
            new(
                Isin: 3,
                Name: "iShares Global Aerospace",
                FundSize: 2471,
                Ter: 0.99,
                UseOfProfits: "Accumulating",
                FundDomicile: "Ireland",
                ReplicationMethod: "Full replication"
            )
        ];

        return new EtfThemeByIdDto(
            Items: items,
            Name: name,
            ImageUrl: imageUrl,
            Description: description
        );
    }
}