using System.Security.Principal;

namespace mgms_backend.Helpers
{
    // Helper class for user-related operations 
    public interface IUserHelper
    {
        Task<int> GetUserIdForSearchCriteria(IIdentity? identity); // Get the user ID from the search criteria
    }
}
