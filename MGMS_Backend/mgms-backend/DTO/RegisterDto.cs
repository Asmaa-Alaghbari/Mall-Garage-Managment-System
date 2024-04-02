namespace MGMSBackend.DTO
{
    // Represent the user entity in the database for registration
    public class RegisterDto
    {
        public int UserId { get; set; } // Primary key
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty; 
        public string Username { get; set; } // Unique username
        public required string Email { get; set; } // Unique email address
        public required string Password { get; set; } // Hashed password
        public required string Phone { get; set; } = string.Empty; // Phone number
        public string Role { get; set; } // Role of the user (Admin, User) 
        public DateTime DateCreated { get; set; } // Date the user account was created
    }
}