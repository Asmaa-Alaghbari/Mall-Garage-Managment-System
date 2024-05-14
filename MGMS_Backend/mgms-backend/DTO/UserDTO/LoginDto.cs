namespace mgms_backend.DTO.UserDTO
{
    // Represent the user entity in the database for login
    public class LoginDto
    {
        public string Username { get; set; } // Unique username or email address
        public string Password { get; set; } // Hashed password
    }
}
