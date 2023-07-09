using GameRental.Data.Models;
using GameRental.Logic.Services;
using Microsoft.AspNetCore.Mvc;
using Sieve.Services;
using Sieve.Models;

namespace GameRental.Presentation.Controllers;

[ApiController]
[Route("api")]
public class ContractController : ControllerBase
{
    private readonly ContractService _contractService;
    private readonly ILogger<ContractController> _logger;
    private readonly ISieveProcessor _sieveProcessor;

    public ContractController(ContractService contractService, ILogger<ContractController> logger, ISieveProcessor sieveProcessor)
    {
        _contractService = contractService;
        _logger = logger;
        _sieveProcessor = sieveProcessor;
    }

    [HttpGet("contracts")]
    public async Task<IActionResult> Get([FromQuery] SieveModel sieveModel)
    {
        try
        {
            _logger.LogInformation("Received GET request to /contract endpoint");

            var contracts = await _contractService.Get();

            var result = _sieveProcessor.Apply(sieveModel, contracts.AsQueryable());

            _logger.LogInformation("Retrieved {Count} contracts from database", result.Count());

            // auto update contracts depending on the # of contracts in that page
            foreach (var contract in result)
            {
                if (contract.Id != null)
                {
                    await _contractService.Update(contract.Id, contract);
                }
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing GET request to /contract endpoint");
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("contract/{id}")]
    public async Task<IActionResult> Get(string id)
    {
        try
        {
            _logger.LogInformation("Received GET request to /contract/{Id} endpoint", id);

            var contract = await _contractService.Get(id);

            if (contract == null)
            {
                _logger.LogInformation("Contract with id: {Id} not found", id);

                return NotFound();
            }
            else if (contract.Id != null) // auto update this contract
            {
                await _contractService.Update(contract.Id, contract);
            }

            _logger.LogInformation("Retrieved contract with id: {Id} from database", contract.Id);

            return Ok(contract);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing GET request to /contract/{Id} endpoint", id);
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("contracts/search")]
    public async Task<IActionResult> Get([FromQuery] ParameterModel sieveModel)
    {
        try
        {
            _logger.LogInformation("Received GET request to /contract/search endpoint");

            var contracts = await _contractService.Search(sieveModel.searchTerm);

            var result = _sieveProcessor.Apply(sieveModel, contracts.AsQueryable());

            _logger.LogInformation("Retrieved {Count} contracts from database", contracts.Count);

            return Ok(result) ;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing GET request to /contract/search endpoint");
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPost("contract/create")]
    public async Task<IActionResult> Post([FromBody] Contract newContract)
    {
        try
        {
            _logger.LogInformation("Received POST request to /contract endpoint");

            await _contractService.Create(newContract);

            _logger.LogInformation("Created new contract with id: {Id}", newContract.Id);

            return CreatedAtAction(nameof(Get), new { id = newContract.Id }, newContract);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing POST request to /contract endpoint");
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPut("contract/update/{id}")]
    public async Task<IActionResult> Put(string id, [FromBody] Contract updatedContract)
    {
        try
        {
            _logger.LogInformation("Received PUT request to /contract/{Id} endpoint", id);

            await _contractService.Update(id, updatedContract);

            _logger.LogInformation("Updated contract with id: {Id}", id);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing PUT request to /contract/{Id} endpoint", id);
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpDelete("contract/delete/{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            _logger.LogInformation("Received DELETE request to /contract/{Id} endpoint", id);

            var contractToDelete = await _contractService.Get(id);

            if (contractToDelete == null)
            {
                _logger.LogInformation("Contract with id: {Id} not found", id);

                return NotFound();
            }

            await _contractService.Delete(id);

            _logger.LogInformation("Deleted contract with id: {Id}", id);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing DELETE request to /contract/{Id} endpoint", id);
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("contract/complete/{id}")]
    public async Task<IActionResult> UpdateContractToCompleted(string id)
    {
        try
        {
            _logger.LogInformation("Received GET request to /contract/complete/{Id} endpoint", id);
            
            // Get contract to mark as completed
            var contractToMark = await _contractService.Get(id);

            if (contractToMark == null)
            {
                _logger.LogInformation("Contract with id: {Id} not found", id);

                return NotFound();
            }

            if (contractToMark.Status == "Completed" || contractToMark.Status == "Canceled")
                return NoContent();

            await _contractService.Complete(id);

            return NoContent();
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured while processing GET request to /contract/complete/{Id} endpoint", id);
            // ...
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}