namespace mgms_backend.Entities.Users
{
    // Represents the search criteria for users
    public class UserSearchCriteria
    {
        public string? Text { get; set; } // Search text
        public string? Role { get; set; } // Role of the user
        public string? SortByProperty { get; set; } // Property to sort by
    }
}
