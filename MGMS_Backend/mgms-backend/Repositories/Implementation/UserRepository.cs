using Microsoft.EntityFrameworkCore;
using mgms_backend.Data;
using mgms_backend.Entities.Users;
using mgms_backend.Extensions;
using mgms_backend.Repositories.Interface;

namespace mgms_backend.Repositories.Implementation
{
    // User repository implementation
    public class UserRepository : IUserRepository
    {
        // Dependency injection for the ApplicationDbContext service
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all users from the Users table in the database
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        // Search for users based on search criteria
        public async Task<IEnumerable<User>> SearchAsync(UserSearchCriteria? searchCriteria)
        {
            // If the search criteria is null, return all users
            if (ReferenceEquals(null, searchCriteria))
            {
                return await _context.Users.ToListAsync();
            }

            // Build the query based on the search criteria
            var query = _context.Users.AsQueryable();
            if (!string.IsNullOrEmpty(searchCriteria.Text))
            {
                query = query.Where(x =>
                    x.UserId.ToString().Contains(searchCriteria.Text) ||
                    x.Username.ToLower().Contains(searchCriteria.Text.ToLower()) ||
                    x.Email.ToLower().Contains(searchCriteria.Text.ToLower()) ||
                    x.Role.ToLower().Contains(searchCriteria.Text.ToLower()) ||
                    x.Phone.ToLower().Contains(searchCriteria.Text.ToLower()));
            }

            // Filter by role if specified
            if (!string.IsNullOrEmpty(searchCriteria.Role))
            {
                query = query.Where(x => x.Role.ToLower().Equals(searchCriteria.Role.ToLower()));
            }

            // Sort the results if a sort property is specified
            if (!string.IsNullOrEmpty(searchCriteria.SortByProperty))
            {
                query = query.OrderByDynamic(searchCriteria.SortByProperty);
            }

            return await query.ToListAsync(); // Execute the query and return the results
        }

        // Get users by role from the database
        public async Task<IList<User>> GetUsersByRoleAsync(string role)
        {
            return await _context.Users.Where(u => u.Role == role).ToListAsync();
        }

        // Add a new user to the database
        public async Task<User> AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user; // EF Core will populate the ID after SaveChangesAsync is called.
        }

        // Get a user by id from the database
        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        // Get a user by username or email from the database
        public async Task<User> GetUserByUsernameOrEmailAsync(string usernameOrEmail)
        {
            return await _context.Users.FirstOrDefaultAsync(
                u => u.Username.Equals(usernameOrEmail) ||
                    u.Email.Equals(usernameOrEmail));
        }

        // Check if a user exists in the database
        public async Task<bool> UserExistsAsync(string username, string email, string phone, int? excludeUserId = null)
        {
            return await _context.Users.AnyAsync(u =>
                u.UserId != excludeUserId && // Exclude the user with the specified ID
                (u.Username == username || u.Email == email || u.Phone == phone));
        }

        // Get the total number of users in the database
        public async Task<int> GetTotalUsersAsync()
        {
            return await _context.Users.CountAsync();
        }

        // Get the total number of users by role in the database
        public async Task<int> GetTotalUsersByRoleAsync(string role)
        {
            return await _context.Users.Where(u => u.Role == role).CountAsync();
        }

        // Update an existing user in the database
        public async Task UpdateUserAsync(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        // Delete a user from the database
        public async Task DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        // Save changes to the database
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
