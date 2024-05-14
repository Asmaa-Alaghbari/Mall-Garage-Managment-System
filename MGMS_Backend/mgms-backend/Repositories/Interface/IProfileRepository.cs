using mgms_backend.Entities.Users;

namespace mgms_backend.Repositories.Interface
{
    public interface IProfileRepository
    {
        Task<Profile> GetProfileByUserIdAsync(int userId); // Get the profile of a user by their ID
        Task AddProfileAsync(Profile newProfile); // Add a new profile to the database
        Task UpdateProfileAsync(Profile profile); // Update the profile of a user
        Task SaveChangesAsync(); // Save changes to the database
    }
}
