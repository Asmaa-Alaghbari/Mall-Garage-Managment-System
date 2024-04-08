using mgms_backend.Data;
using mgms_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace mgms_backend.Repositories
{
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

        // Get a user by id from the database
        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        // Check if a user exists in the database
        public async Task<bool> UserExistsAsync(string username, string email, string phone, int? excludeUserId = null)
        {
            return await _context.Users.AnyAsync(u =>
                (u.UserId != excludeUserId) && // Exclude the user with the specified ID
                (u.Username == username || u.Email == email || u.Phone == phone));
        }

        // Add a new user to the database
        public async Task<User> AddUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user; // EF Core will populate the ID after SaveChangesAsync is called.
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

        // Get a user by username or email from the database
        public async Task<User> GetUserByUsernameOrEmailAsync(string username)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username || u.Email == username);
        }
    }
}

