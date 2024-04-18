using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using mgms_backend.Models;
using mgms_backend.DTO;
using mgms_backend.Repositories;

namespace mgms_backend.Controllers
{
    [Route("api/[controller]")] // Route to the controller endpoint 
    [ApiController] // Attribute for Web API controller
    [Authorize] // Secure the controller with JWT authentication
    public class AuthController : ControllerBase
    {
        // Dependency injection for the UserRepository and IConfiguration services
        private readonly IUserRepository _userRepository; // Repository for user-related operations 
        private readonly IConfiguration _configuration; // Configuration settings for the application 

        public AuthController(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        // GET: api/auth/GetAll
        [HttpGet("GetAll")] // Route to the GetAll endpoint
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetAll()
        {
            // Get all the users from the Users table in the database
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users); // Return the list of users as a response
        }

        // GET: api/auth/GetById
        [HttpGet("GetById")] // Route to the GetById endpoint
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetUserById(int UserId)
        {
            // Find the user with the given id in the database
            var user = await _userRepository.GetUserByIdAsync(UserId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found."); // 404 
            }

            return Ok(user); // Return the user object as a response
        }

        // GET: api/auth/GetUser
        [HttpGet("GetUser")] // Route to the GetUser endpoint
        [Authorize] // The user should only be able to access their own profile
        public async Task<IActionResult> GetUser()
        {
            // Extract the username from the JWT token
            var username = User.Identity?.Name; // Ccontains the username from the token

            // Check if the username is null or empty (should not happen with JWT authentication) 
            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized("Invalid token data."); // 401
            }

            try
            {
                // Fetch the user details from the database
                var user = await _userRepository.GetUserByUsernameOrEmailAsync(username);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Return the user data as a response (excluding sensitive fields like password)
                return Ok(new
                {
                    user.UserId,
                    user.FirstName,
                    user.LastName,
                    user.Username,
                    user.Email,
                    user.Phone,
                    user.Role
                });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine(ex.ToString());
                return StatusCode(500, "An error occurred while retrieving user data.");
            }
        }

        // POST: api/auth/Register 
        [HttpPost("Register")] // Route to the Register endpoint 
        [AllowAnonymous] // Allow unauthenticated access to the endpoint
        public async Task<ActionResult<User>> Register(RegisterDto request)
        {
            // Trim the username and email to remove leading and trailing whitespace
            var cleanedUsername = request.Username?.Trim();
            var cleanedEmail = request.Email?.Trim();

            // Check if the cleaned username or email contains spaces
            if (cleanedUsername?.Contains(" ") == true || cleanedEmail?.Contains(" ") == true)
            {
                return StatusCode(422, "Username or Email should not contain spaces.");
            }

            // Check if the user with the given username/email/phone already exists in the database
            var userExists = await _userRepository.UserExistsAsync(
                cleanedUsername, cleanedEmail, request.Phone);

            try
            {
                if (userExists)
                {
                    return Conflict("A user with the given username, email, or phone already exists."); // 409
                }

                // Convert the role to lowercase to make the role check case-insensitive
                string role = string.IsNullOrWhiteSpace(request.Role) ? "user" : request.Role.ToUpper();

                // Ensure the role is either "User" or "Admin"
                if (role != "USER" && role != "ADMIN")
                {
                    role = "USER"; // Set the default role to "User" if an invalid role is provided
                }

                // Hash the password using BCrypt.Net library 
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create a new user object and set the user data from the request
                var newUser = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Username = cleanedUsername,
                    Email = cleanedEmail,
                    Password = passwordHash,
                    Phone = request.Phone,
                    Role = role, // Set the role of the user (USER or ADMIN)
                    DateCreated = DateTime.UtcNow // Set the current date and time
                };

                // Add the new user to the Users table in the database
                await _userRepository.AddUserAsync(newUser);
                await _userRepository.SaveChangesAsync();

                // Create a JWT token with the user data
                string token = CreateToken(newUser);

                return Ok(new { message = "Registration successful!" });
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.WriteLine(ex.ToString());
                // Return a generic error message or a detailed one based on your security policies
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // POST: api/auth/Login
        [HttpPost("Login")] // Route to the Login endpoint
        [AllowAnonymous] // Allow unauthenticated access to the endpoint
        public async Task<ActionResult> Login(LoginDto request)
        {
            Console.WriteLine("Login request received");
            // Check if the username or email is provided in the request
            if (string.IsNullOrEmpty(request.Username))
            {
                return BadRequest("Username or Email is required."); // 400
            }

            // Check if the password is provided in the request
            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Password is required."); // 400
            }

            // Trim any leading or trailing whitespace from the username
            var cleanedUsername = request.Username.Trim();

            // Find the user with the given username or email in the database
            var user = await _userRepository.GetUserByUsernameOrEmailAsync(cleanedUsername);

            // Check if the user exists in the database
            if (user == null)
            {
                return NotFound("User not found."); // 404
            }

            // Verify the password using BCrypt.Net library
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return Unauthorized("Invalid password."); // 401
            }

            // Create a JWT token with the user data and return it
            string token = CreateToken(user);
            return Ok(new
            {
                message = "Login successful!",
                token,
                userId = user.UserId,
                role = user.Role
            });
        }

        // PUT: api/auth/Update
        [HttpPut("Update")] // Route to the Update endpoint
        [Authorize] // The user should only be able to update their own profile
        public async Task<ActionResult> UpdateUser(int userId, RegisterDto request)
        {
            // Find the user with the given id in the database
            var user = await _userRepository.GetUserByIdAsync(userId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // This check ensures that only admins can change roles, or users can update their own data without changing roles
            if (!User.IsInRole("ADMIN") && request.Role != user.Role)
            {
                return StatusCode(403, "Only admins can change roles!"); // 403
            }

            // Check if the username/email/phone is being updated to a value that already exists for another user
            var userExists = await _userRepository.UserExistsAsync(
                               request.Username, request.Email, request.Phone, user.UserId);

            if (userExists)
            {
                return Conflict("A user with the given username, email, or phone already exists.");
            }

            // Check if the information is unchanged (including Role)
            if (request.FirstName == user.FirstName &&
                request.LastName == user.LastName &&
                request.Username == user.Username &&
                request.Email == user.Email &&
                BCrypt.Net.BCrypt.Verify(request.Password, user.Password) &&
                request.Phone == user.Phone &&
                request.Role == user.Role)
            {
                return StatusCode(304, "No new information was provided for the update!");
            }

            // Update the user data with the new values from the request
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Username = request.Username;
            user.Email = request.Email;
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.Phone = request.Phone;
            user.Role = request.Role;

            // Save the changes to the database
            await _userRepository.UpdateUserAsync(user);

            return Ok(new { message = "User updated successfully!", user }); // Return the updated user object as a response 
        }

        // DELETE: api/auth/Delete
        [HttpDelete("Delete")] // Route to the Delete endpoint
        [Authorize(Roles = "ADMIN")] // Allow only Admin role to access the endpoint
        public async Task<ActionResult<User>> DeleteUser(int UserId)
        {
            // Find the user with the given id in the database
            var user = await _userRepository.GetUserByIdAsync(UserId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Remove the user from the Users table in the database
            await _userRepository.DeleteUserAsync(UserId);
            await _userRepository.SaveChangesAsync();

            return Ok(new { message = $"User with ID {UserId} deleted successfully!" }); // Return a success message
        }

        // Create a JWT token with user data 
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Create a symmetric security key using the app settings token (Secret key for token generation) 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!)); // ! is used to avoid null reference exception

            // Create signing credentials using the HMACSHA512 signature algorithm (Hash-based Message Authentication Code)
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // Create a JWT token with the claims, expiration date, and signing credentials
            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

            // Return the JWT token as a string 
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
