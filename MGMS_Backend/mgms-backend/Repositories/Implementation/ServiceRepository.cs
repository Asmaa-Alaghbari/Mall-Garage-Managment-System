using Microsoft.EntityFrameworkCore;
using mgms_backend.Data;
using mgms_backend.Entities.Services;
using mgms_backend.Extensions;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Repositories.Implementation
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get service by service ID
        public async Task<Service?> GetByServiceIdAsync(int serviceId)
        {
            return await _context.Services.FindAsync(serviceId);
        }

        // Get service by service name
        public async Task<Service?> GetByNameAsync(string serviceName)
        {
            return await _context.Services.SingleOrDefaultAsync(x => x.Name.Equals(serviceName));
        }

        // Get all services
        public async Task<IList<Service>> GetAllAsync()
        {
            return await _context.Services.ToListAsync();
        }

        // Search services
        public async Task<IList<Service>> SearchAsync(ServiceSearchCriteria? searchCriteria)
        {
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.Services.ToListAsync();
            }

            var query = _context.Services.AsQueryable();

            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.ServiceId.ToString().Contains(searchCriteria.Text) ||
                    x.Price.ToString().Contains(searchCriteria.Text) ||
                    x.Description.ToLower().Contains(searchCriteria.Text.ToLower()) ||
                    x.Name.ToLower().Contains(searchCriteria.Text.ToLower()));
            }

            if (!string.IsNullOrEmpty(searchCriteria.SortByProperty))
            {
                query = query.OrderByDynamic(searchCriteria.SortByProperty);
            }

            return await query.ToListAsync();
        }

        // Add service
        public async Task AddAsync(Service serviceToAdd)
        {
            _context.Services.Add(serviceToAdd);
            await _context.SaveChangesAsync();
        }

        // Update service
        public async Task UpdateAsync(Service serviceToUpdate)
        {
            _context.Services.Update(serviceToUpdate);
            await _context.SaveChangesAsync();
        }

        // Delete service by service ID
        public async Task DeleteServiceAsync(int serviceId)
        {
            var service = await _context.Services.FindAsync(serviceId);
            if (service != null)
            {
                _context.Services.Remove(service);
                await _context.SaveChangesAsync();
            }
        }
    }
}
