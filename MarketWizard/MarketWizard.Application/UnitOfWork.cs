using MarketWizard.Contracts.Interfaces;

namespace MarketWizard.Application;

public interface IAppService
{
    public IMiscRepository MiscRepository { get; }
    public ICronJobRepository CronJobRepository { get; }
}

public class AppService(IMiscRepository miscRepository, ICronJobRepository cronJobRepository) : IAppService
{
    public IMiscRepository MiscRepository => miscRepository;
    public ICronJobRepository CronJobRepository => cronJobRepository;
}