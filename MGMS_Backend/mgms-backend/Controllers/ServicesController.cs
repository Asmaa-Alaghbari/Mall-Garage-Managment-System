using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using mgms_backend.DTO.ServiceDTO;
using mgms_backend.Exceptions;
using mgms_backend.Mappers.Interface;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Controllers
{
    [Route("api/[controller]")] // Route to the controller endpoint 
    [ApiController] // Attribute for Web API controller
    [Authorize] // Secure the controller with JWT authentication
    public class ServicesController : Controller
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IServiceMapper _serviceMapper;

        public ServicesController(IServiceRepository serviceRepository, IServiceMapper serviceMapper)
        {
            _serviceRepository = serviceRepository;
            _serviceMapper = serviceMapper;
        }

        // GET: api/GetServicesStatistics: Get the total number of services
        [HttpGet("GetServicesStatistics")] // Route to the GetAll endpoint
        public async Task<IActionResult> GetServicesStatistics()
        {
            var services = await _serviceRepository.GetAllAsync();
            return Ok(new { Total = services?.Count ?? 0 });
        }

        // POST: api/AddService: Create a new service
        [HttpPost("AddService")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateService([FromBody] ServiceDto serviceDto)
        {
            var newService = _serviceMapper.ToModel(serviceDto);

            // Check if another service with the same name exists
            var existingService = await _serviceRepository.GetByNameAsync(serviceDto.Name);
            if (existingService != null && existingService.ServiceId != newService.ServiceId)
            {
                throw new ServerValidationException($"Another service with the name \"{serviceDto.Name}\" already exists.");
            }

            await _serviceRepository.AddAsync(newService);

            return Ok(new { message = $"Service with Id {newService.ServiceId} created successfully!" });
        }

        // POST: api/SearchPaginated: Search for services with pagination
        [HttpPost("SearchPaginated")]
        [Authorize]
        public async Task<IActionResult> SearchPaginated([FromQuery] int pageNumber = 0, [FromQuery] int pageSize = 0, [FromBody] ServiceSearchCriteriaDto? searchCriteria = null)
        {
            var searchCriteriaModel = _serviceMapper.ToSearchCriteriaModel(searchCriteria);
            var fetchedResults = await _serviceRepository.SearchAsync(searchCriteriaModel);

            if (pageSize == 0 || pageNumber == 0)
            {
                return Ok(_serviceMapper.ToCollectionDto(fetchedResults));
            }

            var totalRecords = fetchedResults.Count();
            var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
            var paginatedData = fetchedResults.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { TotalPages = totalPages, Data = _serviceMapper.ToCollectionDto(paginatedData) });
        }

        // PUT: api/UpdateService: Update a service by ID
        [HttpPut("UpdateService")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateService([FromQuery] int serviceId, [FromBody] ServiceDto serviceDto)
        {
            var serviceToUpdate = await _serviceRepository.GetByServiceIdAsync(serviceId);
            if (serviceToUpdate == null)
            {
                throw new EntityNotFoundException($"Service with ID {serviceId} was not found!");
            }

            // Check if another service with the same name exists
            var existingService = await _serviceRepository.GetByNameAsync(serviceDto.Name);
            if (existingService != null && existingService.ServiceId != serviceId)
            {
                throw new ServerValidationException($"Another service with the name \"{serviceDto.Name}\" already exists.");
            }

            // Update the parking spot with the new values
            serviceToUpdate.Name = serviceDto.Name;
            serviceToUpdate.Description = serviceDto.Description;
            serviceToUpdate.Price = serviceDto.Price;

            // Update the service in the database
            await _serviceRepository.UpdateAsync(serviceToUpdate);

            return Ok(new { message = "Service updated successfully!" });
        }

        // DELETE: api/DeleteService: Delete a service by ID
        [HttpDelete("DeleteService")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteService([FromQuery] int serviceId)
        {
            var service = await _serviceRepository.GetByServiceIdAsync(serviceId);

            if (ReferenceEquals(null, service))
            {
                throw new EntityNotFoundException("Service not found!");
            }

            await _serviceRepository.DeleteServiceAsync(serviceId);

            return Ok(new { message = $"Service with ID {serviceId} deleted successfully!" });
        }
    }
}
