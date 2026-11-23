using System.Text.Json.Serialization;

namespace MarketWizard.Contracts.Models;

public record PortfolioAssetDto(
    string Symbol,
    double NumberOfShares,
    double PricePerShare
);

public record PortfolioDto(
    string Id,
    string? Name = null,
    string? Description = null,
    string? ImageUrl = null,
    double? TotalValue = null,
    double? UnrealizedGain = null,
    DateTime? CreatedAt = null,
    int? Holdings = null,
    List<PortfolioAssetDto>? Assets = null
);

public record EtfThemeDto(
    int Id,
    string Name,
    string Theme,
    string? Description = null,
    string? ImageUrl = null
);

public record EtfByIdItemDto(
    long Isin,
    string Name,
    double FundSize,
    double Ter,
    string UseOfProfits,
    string FundDomicile,
    string ReplicationMethod
);

public record EtfThemeByIdDto(
    List<EtfByIdItemDto> Items,
    string? Name = null,
    string? ImageUrl = null,
    string? Description = null
);

public record IndiceSummaryDto(
    string Id,
    string? Name = null,
    string? Description = null,
    string? ImageUrl = null,
    double? TotalValue = null,
    double? UnrealizedGain = null,
    DateTime? CreatedAt = null,
    int? Holdings = null,
    List<PortfolioAssetDto>? Assets = null
);

public record IndicePerformancePointDto(
    string Name,
    double Performance
);

public record IndiceAreaDto(
    string Month,
    List<IndicePerformancePointDto> Indices
);

public record PortfolioPerformancePointDto(
    string Name,
    string Performance
);

public record PortfolioAreaDto(
    string Month,
    List<PortfolioPerformancePointDto> Portfolios
);

public record PortfoliosAreaDto(
    List<string> Portfolios,
    List<PortfolioAreaDto> Performance
);

public record IndicesAreaDto(
    List<string> Indices,
    List<IndiceAreaDto> Performance
);

// Watchlists

public record WatchlistItemDto(
    string Id,
    string Name,
    string Description,
    string Ticker
);

public record WatchListDto(
    string Id,
    string Name,
    List<WatchlistItemDto> Items
);

public record WatchListPageDto(
    List<WatchListDto> Items,
    string? NextCursor = null
);

// Others

public record TopNewsDto(
    int Id,
    string Text,
    long? Date = null,
    double? Sentiment = null,
    string? Country = null,
    string? Source = null,
    string? Description = null,
    string? Url = null
);

public record TopNewsDataDto(
    List<TopNewsDto> Items,
    DateTime? Date = null
);

public record PortfolioPerformanceDto(
    string Id,
    string PortfolioName,
    [property: JsonPropertyName("7d")] double SevenDay,
    [property: JsonPropertyName("1y")] double OneYear
);

public record IndicePerformanceDto(
    int Id,
    string Name,
    string CountryCode,
    double RegularMarketChangePercent,
    double RegularMarketPrice
);

public record IndicePerformanceDataDto(
    List<IndicePerformanceDto> Items,
    DateTime? Date = null
);

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SectorType
{
    [JsonStringEnumMemberName("Basic Materials")]
    BasicMaterials,

    [JsonStringEnumMemberName("Telecom")]
    Telecom,

    [JsonStringEnumMemberName("Consumer Goods")]
    ConsumerGoods,

    [JsonStringEnumMemberName("Customer Staples")]
    CustomerStaples,

    [JsonStringEnumMemberName("Consumer Services")]
    ConsumerServices,

    [JsonStringEnumMemberName("Energy")]
    Energy,

    [JsonStringEnumMemberName("Financials")]
    Financials,

    [JsonStringEnumMemberName("Health Care")]
    HealthCare,

    [JsonStringEnumMemberName("Industrials")]
    Industrials,

    [JsonStringEnumMemberName("Materials")]
    Materials,

    [JsonStringEnumMemberName("Utilities")]
    Utilities,

    [JsonStringEnumMemberName("Technology")]
    Technology
}

public record SectorPerformanceDto(
    SectorType Type,
    double Change,
    string Country
);

public record SectorPerformanceDataDto(
    List<SectorPerformanceDto> Items,
    DateTime? Date = null
);

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CountryType
{
    [JsonStringEnumMemberName("United States")]
    Us,

    [JsonStringEnumMemberName("Canada")]
    Ca,

    [JsonStringEnumMemberName("United Kingdom")]
    Gb,

    [JsonStringEnumMemberName("Germany")]
    De,

    [JsonStringEnumMemberName("France")]
    Fr,

    [JsonStringEnumMemberName("Australia")]
    Au
}

public record EquityDto(
    CountryType Country,
    double Change,
    double LastPrice,
    long Volume
);

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum LazyItemType
{
    [JsonStringEnumMemberName("s")]
    S,

    [JsonStringEnumMemberName("c")]
    C,

    [JsonStringEnumMemberName("f")]
    F
}

public record LazyPortfolioItemDto(
    int Id,
    double Weight,
    string Ticker,
    string Name,
    string Themes,
    LazyItemType Type
);

public record LazyPortfolioDtoItems(
    int NumberOfLazyPortfolios,
    LazyPortfolioDto[] Items);

public record LazyPortfolioDto(
    int Id,
    string Name,
    [property: JsonPropertyName("1d")] double OneDay,
    [property: JsonPropertyName("ytd")] double Ytd,
    double DividendYield,
    int PerformanceRank,
    double MaxDrawdown,
    double ExpenseRatio,
    double SharpeRatio,
    List<LazyPortfolioItemDto> Items,
    string? Description = null
);

public record TreeMapCompanyDto(
    string Company,
    double Change
);

public record TreeMapDto(
    SectorType Sector,
    List<TreeMapCompanyDto> Companies
);

public record GainersDto(
    SectorType Type,
    double Change,
    string Country
);

public record GainersDataDto(
    List<GainersDto> Items,
    DateTime? Date = null
);

public record LosersDto(
    SectorType Type,
    double Change,
    string Country
);

public record LosersDataDto(
    List<LosersDto> Items,
    DateTime? Date = null
);

public record TopIndustriesDto(
    SectorType Type,
    double Change,
    string Country
);

public record TopIndustriesDataDto(
    List<TopIndustriesDto> Items,
    DateTime? Date = null
);

public record WorstIndustriesDto(
    SectorType Type,
    double Change,
    string Country
);

public record WorstIndustriesDataDto(
    List<WorstIndustriesDto> Items,
    DateTime? Date = null
);