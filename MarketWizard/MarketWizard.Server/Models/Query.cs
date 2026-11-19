namespace MarketWizard.Server.Models;

public class Query
{
    public Etf Etf(string isin = "")
    {
        return new Etf()
        {
            Isin = "IE00BK5BQT80",
            Name = "Vanguard FTSE All-World UCITS ETF",
            Ticker = "VWRA",
            Ter = 0.14,
            DistributionPolicy = Distribution.Acumulating,
            Replication = Replication.Physical,
            FundSize = 57.062,
            InceptionDate = new DateTime(2019, 05, 23),
            Holdings =
            [
                new Holding()
                {
                    Stock = new Stock()
                    {
                        Name = "NVIDIA Corp.",
                        Ticker = "NVIDIA Corp.",
                        Country = Country.UnitedStates,
                        Sector = Sector.Technology
                    },
                    Weight = 5.01
                },
                new Holding()
                {
                    Stock = new Stock()
                    {
                        Name = "Apple",
                        Ticker = "AAPL",
                        Country = Country.UnitedStates,
                        Sector = Sector.Technology
                    },
                    Weight = 4.52
                },
                new Holding()
                {
                    Stock = new Stock()
                    {
                        Name = "Microsoft Corp",
                        Ticker = "MSFT",
                        Country = Country.UnitedStates,
                        Sector = Sector.Technology
                    },
                    Weight = 3.58
                }
            ],
            Performance = new Performance()
            {
                YearToDate = 14.4,
                OneMonth = -2.56,
                ThreeMonths = -1.19
            }
        };
    }
}

public class Etf
{
    public string Isin { get; set; }
    public string Name { get; set; }
    public string Ticker { get; set; }

    public double Ter { get; set; }
    public Distribution DistributionPolicy { get; set; }

    public Replication Replication { get; set; }
    public double FundSize { get; set; }

    public DateTime InceptionDate { get; set; }

    public Holding[] Holdings { get; set; } = [];
    
    public Performance Performance { get; set; }
}

public class Holding
{
    public Stock Stock { get; set; }

    public double Weight { get; set; }
}

public class Stock
{
    public string Name { get; set; }
    public string Ticker { get; set; }

    public Country Country { get; set; }

    public Sector Sector { get; set; }
}

public class Performance
{
    public double YearToDate { get; set; }
    public double OneMonth { get; set; }
    public double ThreeMonths { get; set; }
}

public enum Distribution
{
    Acumulating,
    Distributing
}

public enum Replication
{
    Physical
}

public enum Country
{
    UnitedStates,
    Japan,
    UnitedKingdom,
}

public enum Sector
{
    Technology,
    Finance,
    Industrials,
    Healthcare
}