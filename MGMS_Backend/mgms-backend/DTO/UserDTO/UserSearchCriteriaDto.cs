namespace mgms_backend.DTO.UserDTO
{
    // User search criteria data transfer object (DTO) for user search criteria
    public class UserSearchCriteriaDto
    {
        public string? Text { get; set; } // Search text 
        public string? Role { get; set; } // Role of the user (Admin, User)
        public string? SortByProperty { get; set; } // Property to sort by
    }
}
