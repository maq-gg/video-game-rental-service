using GameRental.Data.Models;
using GameRental.Data.Repositories;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace GameRental.Logic.Services
{
    public class ContractService
    {
        internal static readonly decimal LATE_FEE_PER_DAY = 1.0m;

        private readonly ContractRepository _contractRepository;
        private readonly GameRepository _gameRepository;
        private readonly ILogger<ContractRepository> _logger;

        public ContractService(ContractRepository contractRepository, GameRepository gameRepository, ILogger<ContractRepository> logger)
        {
            _contractRepository = contractRepository;
            _gameRepository = gameRepository;
            _logger = logger;
        }

        public async Task<List<Contract>> Get()
        {
            var contracts = await _contractRepository.GetAsync();

            return contracts;
        }

        public async Task<Contract> Get(string id)
        {
            var contract = await _contractRepository.GetAsync(id);

            return contract;
        }

        public async Task Create(Contract newContract)
        {
            await _contractRepository.CreateAsync(newContract);

            if (newContract.Id != null)
            {
                await Update(newContract.Id, newContract);
            }
        }

        public async Task Update(string id, Contract updatedContract)
        {
            await AutoUpdate(updatedContract);
            await _contractRepository.UpdateAsync(id, updatedContract);
        }

        public async Task Delete(string id)
        {
            await _contractRepository.RemoveAsync(id);
        }

        public async Task<List<Contract>> Search(string? searchTerm)
        {
            var contracts = await _contractRepository.SearchAsync(searchTerm);

            return contracts;
        }

        private async Task AutoUpdate(Contract contract)
        {
            UpdateStatus(contract);
            CalculateEndDate(contract);
            CalculateLateFee(contract);
            await CalculateTotalCost(contract);
        }

        private void CalculateEndDate(Contract contract)
        {
            DateOnly endDate = contract.StartDate.AddDays(contract.RentalDuration);

            contract.EndDate = endDate;
        }

        private void CalculateLateFee(Contract contract)
        {
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);
            int daysLate = currentDate.DayNumber - contract.EndDate.DayNumber;

            if (daysLate > 0)
            {
                decimal lateFee = daysLate * LATE_FEE_PER_DAY;

                contract.LateFee = lateFee;
            }
        }

        private async Task CalculateTotalCost(Contract contract)
        {
            try
            {
                var game = await _gameRepository.GetAsync(contract.GameId);

                if (game == null)
                {
                    throw new ArgumentException($"Game with id: {contract.GameId}");
                }

                decimal rentalCost;

                if (contract.RentalDuration <= 3)
                {
                    rentalCost = game.Price.ThreeDays;
                }
                else if (contract.RentalDuration <= 7)
                {
                    rentalCost = game.Price.SevenDays;
                }
                else if (contract.RentalDuration <= 14)
                {
                    rentalCost = game.Price.FourteenDays;
                }
                else
                {
                    rentalCost = game.Price.ThirtyDays;
                }

                decimal totalCost = rentalCost + (contract.ShippingFee ?? 0);

                contract.TotalCost = totalCost;
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "An error occured due to invalid arguments");
                throw;
            }
        }

        private void UpdateStatus(Contract contract)
        {
            if (contract.Status == "Completed" || contract.Status == "Canceled")
            {
                return;
            }

            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Today);

            int startDateDiff = currentDate.CompareTo(contract.StartDate);
            int endDateDiff = currentDate.CompareTo(contract.EndDate);

            if (startDateDiff <= 0)
            {
                if (contract.Status != "Active" || startDateDiff != 0)
                {
                    contract.Status = "Pending";
                }
            }
            else if (startDateDiff > 0 && endDateDiff <= 0)
            {
                if (contract.Status != "Active")
                {
                    contract.Status = "Canceled";
                }
            }
            else if (endDateDiff > 0)
            {
                if (contract.Status != "Completed")
                {
                    contract.Status = "Overdue";
                }
            }

        }

        public async Task Complete(string id)
        {
            await _contractRepository.CompleteAsync(id);
        }

        public async Task Cancel(string id)
        {
            await _contractRepository.CancelAsync(id);
        }

        public async Task Activate(string id)
        {
            await _contractRepository.ActivateAsync(id);
        }
    }
}