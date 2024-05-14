using mgms_backend.Repositories.Interface;
using System.Security.Principal;

namespace mgms_backend.Helpers
{
    // Helper class for user-related operations 
    public class UserHelper : IUserHelper
    {
        private readonly IUserRepository _userRepository;

        public UserHelper(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Get the user ID from the search criteria 
        public async Task<int> GetUserIdForSearchCriteria(IIdentity? identity)
        {
            // Check if the identity is null
            if (ReferenceEquals(null, identity))
            {
                return 0;
            }

            // Get the username from the identity
            var username = identity.Name;
            if (string.IsNullOrEmpty(username))
            {
                return 0;
            }

            // Get the user by username or email
            var user = await _userRepository.GetUserByUsernameOrEmailAsync(username);
            if (user is { Role: "ADMIN" })
            {
                return 0;
            }

            return user?.UserId ?? 0; // Return the user ID or 0 if the user is not found
        }
    }
}
