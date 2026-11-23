using MarketWizard.Contracts.Models;

namespace MarketWizard.Contracts.Interfaces;

public interface IEtfRepository
{
    Task<EtfThemeByIdDto?> FetchEtfById(string id);
    Task<IReadOnlyList<EtfThemeDto>> FetchEtfs();
}