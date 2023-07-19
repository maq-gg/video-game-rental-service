using GameRental.Data.Models;
using GameRental.Data.Settings;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System.Linq;

namespace GameRental.Data.Repositories
{
    public class ContractRepository
    {
        private readonly IMongoCollection<Contract> _contractsCollection;
        private readonly IMongoCollection<Game> _gamesCollection;
        private readonly IMongoCollection<Account> _accountsCollection;
        private readonly ILogger<ContractRepository> _logger;

        public ContractRepository(IMongoClient mongoClient, IOptions<GameRentalDatabaseSettings> settings, ILogger<ContractRepository> logger)
        {
            var mongoDatabase = mongoClient.GetDatabase(settings.Value.DatabaseName);

            _contractsCollection = mongoDatabase.GetCollection<Contract>(settings.Value.ContractsCollectionName);
            _gamesCollection = mongoDatabase.GetCollection<Game>(settings.Value.GamesCollectionName);
            _accountsCollection = mongoDatabase.GetCollection<Account>(settings.Value.AccountsCollectionName);

            _logger = logger;
        }

        public async Task<List<Contract>> GetAsync()
        {
            try
            {
                _logger.LogInformation("Querying contracts collection in database");

                var contracts = await _contractsCollection.Find(_ => true).ToListAsync();

                _logger.LogInformation("Retrieved {Count} contracts from database", contracts.Count);

                return contracts;
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while retrieving contracts from database");
                // ...
                throw;
            }
        }

        public async Task<Contract> GetAsync(string id)
        {
            try
            {
                _logger.LogInformation("Querying contract with id: {Id}", id);

                var contract = await _contractsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

                _logger.LogInformation("Retrieved contract with id: {Id}", contract.Id);

                return contract;
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while retrieving contracts with id: {Id} from database", id);
                // ...
                throw;
            }
        }

        public async Task CreateAsync(Contract newContract)
        {
            try
            {
                _logger.LogInformation("Creating new contract");

                await _contractsCollection.InsertOneAsync(newContract);

                _logger.LogInformation("Created new contract with id: {Id}", newContract.Id);
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while creating a new contract");
                // ...
                throw;
            }
        }

        public async Task UpdateAsync(string id, Contract updatedContract)
        {
            try
            {
                _logger.LogInformation("Updating contract with id: {Id}", id);

                await _contractsCollection.ReplaceOneAsync(x => x.Id == id, updatedContract);

                _logger.LogInformation("Updated contract with id: {Id}", updatedContract.Id);
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while updating contract with id: {Id}", id);
                // ...
                throw;
            }
        }

        public async Task RemoveAsync(string id)
        {
            try
            {
                _logger.LogInformation("Removing contract with id: {Id}", id);

                await _contractsCollection.DeleteOneAsync(x => x.Id == id);

                _logger.LogInformation("Removed contract with id: {Id}", id);
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while removing contract with id: {Id}", id);
                // ...
                throw;
            }
        }

        public async Task<List<Contract>> SearchAsync(string? searchTerm)
        {
            try
            {
                var contracts = await GetAsync();

                if(searchTerm == null || searchTerm.Trim() == " ")
                {
                    return contracts;
                }

                var toLowerTrimSearchTerm = searchTerm.Trim().ToLower();

                var searchedGamesByTitle = _gamesCollection.Find(x => x.Title.ToLower().Contains(toLowerTrimSearchTerm)).ToEnumerable();
                var searchedAccountsByUsername = _accountsCollection.Find(x => x.UserName.ToLower().Contains(toLowerTrimSearchTerm)).ToList();

                var res = await _contractsCollection.Find(x => 
                    searchedGamesByTitle.Any(a => a.Id == x.GameId) 
                    || searchedAccountsByUsername.Any(a => (a == null ? false : (a.ContractIds == null ? false : (x.Id == null ? false : a.ContractIds.Contains(x.Id.ToString())))))
                    || x.CustomerInfo.Name.ToLower().Contains(toLowerTrimSearchTerm)
                    || x.CustomerInfo.Email.ToLower().Contains(toLowerTrimSearchTerm)
                    || x.CustomerInfo.Address.ToLower().Contains(toLowerTrimSearchTerm)
                    || x.CustomerInfo.PhoneNumber.ToLower().Contains(toLowerTrimSearchTerm)
                ).ToListAsync();

                return res;
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while searching for contracts (searchTerm: {SearchTerm})", searchTerm);
                // ...
                throw;
            }
        }

        public async Task CompleteAsync(string id)
        {
            try
            {
                _logger.LogInformation("Updating contract with id: {Id}", id);

                var filter = Builders<Contract>.Filter.Eq(contract => contract.Id, id);
                var update = Builders<Contract>.Update.Set(contract => contract.Status, "Completed");

                await _contractsCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Updated contract with id: {Id}", id);
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while updating contract with id: {Id}", id);
                // ...
                throw;
            }
        }

        public async Task CancelAsync(string id)
        {
            try
            {
                _logger.LogInformation("Updating contract with id: {Id}", id);


                var filter = Builders<Contract>.Filter.Eq(contract => contract.Id, id);
                var update = Builders<Contract>.Update.Set(contract => contract.Status, "Canceled");

                await _contractsCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Updated contract with id: {Id}", id);
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while updating contract with id: {Id}", id);
                // ...
                throw;
            }
        }

        public async Task ActivateAsync(string id)
        {
            try
            {
                var filter = Builders<Contract>.Filter.Eq(contract => contract.Id, id);
                var update = Builders<Contract>.Update.Set(contract => contract.Status, "Active");

                await _contractsCollection.UpdateOneAsync(filter, update);

                _logger.LogInformation("Updated contrat with id: {Id}", id);
            }
            catch (MongoException ex)
            {
                _logger.LogError(ex, "An error occured while updating contract with id: {Id}", id);
                // ...
                throw;
            }
        }
    }
}