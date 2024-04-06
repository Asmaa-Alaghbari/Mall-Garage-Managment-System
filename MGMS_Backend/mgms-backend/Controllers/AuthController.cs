using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using mgms_backend.Models;
using mgms_backend.DTO;
using mgms_backend.Data;
using Microsoft.AspNetCore.Authorization;

namespace mgms_backend.Controllers
{
    [Route("api/[controller]")] // Route to the controller endpoint 
    [ApiController] // Attribute for Web API controller
    [Authorize] // Secure the controller with JWT authentication
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration; // Configuration object to access app settings
        private readonly ApplicationDbContext _context; // Database context to interact with the database

        public AuthController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        // GET: api/auth/GetAll
        [HttpGet("GetAll")] // Route to the GetAll endpoint
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            // Get all the users from the Users table in the database
            var users = await _context.Users.ToListAsync();
            return Ok(users); // Return the list of users as a response
        }

        // GET: api/auth/GetById
        [HttpGet("GetById")] // Route to the GetById endpoint
        [Authorize (Roles = "Admin")]
        public async Task<IActionResult> GetUserById(int UserId)
        {
            // Find the user with the given id in the database
            var user = await _context.Users.FindAsync(UserId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }   

            return Ok(user); // Return the user object as a response
        }

        // POST: api/auth/Register 
        [HttpPost("Register")] // Route to the Register endpoint 
        [AllowAnonymous] // Allow unauthenticated access to the endpoint
        public async Task<ActionResult<User>> Register(RegisterDto request)
        {
            // Check if the user with the given username/email/phone already exists in the database
            var userExists = await _context.Users.AnyAsync(
                u => u.Email == request.Email ||
                u.Username == request.Username ||
                u.Phone == request.Phone
                );

            try
            {
                if (userExists)
                {
                    return BadRequest("User already exists!");
                }

                // Hash the password using BCrypt.Net library 
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create a new user object and set the user data from the request
                var newUser = new User
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Username = request.Username,
                    Email = request.Email,
                    Password = passwordHash,
                    Phone = request.Phone,
                    Role = "User", // Assuming default role as User
                    DateCreated = DateTime.UtcNow // Set the current date and time
                };

                // Add the new user to the Users table in the database
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();

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
            // Check if the username or email is provided in the request
            if (string.IsNullOrEmpty(request.Username))
            {
                return BadRequest("Username or Email is required.");
            }

            // Check if the password is provided in the request
            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Password is required.");
            }

            // Find the user with the given username or email in the database
            var user = await _context.Users.FirstOrDefaultAsync(
                u => u.Username == request.Username
                || u.Email == request.Username);

            // Check if the user exists in the database
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // Verify the password using BCrypt.Net library
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return BadRequest("Invalid password.");
            }

            // Create a JWT token with the user data and return it
            string token = CreateToken(user);
            return Ok(new { token });
        }

        // PUT: api/auth/Update
        [HttpPut("Update")] // Route to the Update endpoint
        [Authorize] // The user should only be able to update their own profile
        public async Task<ActionResult<User>> UpdateUser(RegisterDto request)
        {
            // Find the user with the given id in the database
            var user = await _context.Users.FindAsync(request.UserId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if the username/email/phone is being updated to a value that already exists for another user
            var userExists = await _context.Users.AnyAsync(u =>
                (request.Email != user.Email && u.Email == request.Email) ||
                (request.Username != user.Username && u.Username == request.Username) ||
                (request.Phone != user.Phone && u.Phone == request.Phone));

            if (userExists)
            {
                return BadRequest("A user with the given username, email, or phone already exists.");
            }

            // Check if the information is unchanged
            if (request.Email == user.Email && request.Username == user.Username && request.Phone == user.Phone)
            {
                return BadRequest("No new information was provided for the update.");
            }

            // Update the user data with the new values from the request
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Username = request.Username;
            user.Email = request.Email;
            user.Phone = request.Phone;

            // Save the changes to the database
            await _context.SaveChangesAsync();

            return Ok(user); // Return the updated user object as a response
        }

        // DELETE: api/auth/Delete
        [HttpDelete("Delete")] // Route to the Delete endpoint
        [Authorize (Roles = "Admin")] // Allow only Admin role to access the endpoint
        public async Task<ActionResult<User>> DeleteUser(int UserId)
        {
            // Find the user with the given id in the database
            var user = await _context.Users.FindAsync(UserId);

            // Check if the user exists
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Remove the user from the Users table in the database
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(user); // Return the deleted user object as a response
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
