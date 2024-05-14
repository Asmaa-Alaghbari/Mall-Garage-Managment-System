using mgms_backend.Entities.Services;

namespace mgms_backend.Repositories.Interface
{
    public interface IServiceRepository
    {
        Task<Service?> GetByServiceIdAsync(int serviceId); // Get a service by its ID
        Task<Service?> GetByNameAsync(string serviceName); // Get a service by its name
        Task<IList<Service>> GetAllAsync(); // Get all services
        Task<IList<Service>> SearchAsync(ServiceSearchCriteria? searchCriteria); // Search for services based on search criteria
        Task AddAsync(Service serviceToAdd); // Add a new service
        Task UpdateAsync(Service serviceToUpdate); // Update an existing service
        Task DeleteServiceAsync(int serviceId); // Delete a service by its ID
    }
}
