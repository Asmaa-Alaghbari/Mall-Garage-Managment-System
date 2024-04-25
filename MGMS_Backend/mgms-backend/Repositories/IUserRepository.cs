using mgms_backend.Models;

namespace mgms_backend.Repositories
{
    // Interface for the UserRepository class to define the methods for interacting with the User entity 
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync(); // Get all users from the database
        Task<User> GetUserByIdAsync(int userId); // Get a user by id from the database
        Task<User> AddUserAsync(User user); // Add a new user to the database
        Task UpdateUserAsync(User user); // Update an existing user in the database
        Task DeleteUserAsync(int userId); // Delete a user from the database
        Task SaveChangesAsync(); // Save changes to the database
        Task<bool> UserExistsAsync(string username, string email, string phone, int? excludeUserId = null); // Check if a user exists in the database
        Task<User> GetUserByUsernameOrEmailAsync(string usernameOrEmail); // Get a user by username or email from the database
        Task<int> GetTotalUsersAsync(); // Get the total number of users in the database
        Task<int> GetTotalUsersByRoleAsync(string role); // Get the total number of users by role in the database
    }
}
