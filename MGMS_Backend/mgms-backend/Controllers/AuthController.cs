using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using MGMSBackend.Models;
using MGMSBackend.DTO;
using MGMSBackend.Data;

namespace MGMSBackend.Controllers
{
    [Route("api/[controller]")] // Route to the controller endpoint 
    [ApiController] // Attribute for Web API controller
    public class AuthController : ControllerBase
    {
        public static User user = new User(); // Create a new user object to store the user data
        public IConfiguration _configuration; // Configuration object to access app settings
        private readonly ApplicationDbContext _context; // Database context to interact with the database

        public AuthController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        // POST: api/auth/Register 
        [HttpPost("Register")] // Route to the Register endpoint 
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

        // Create a JWT token with user data 
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.Role, "User"),
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

            // Write the token as a string and return it 
            try
            {
                var jwt = new JwtSecurityTokenHandler().WriteToken(token);
                return jwt; // jwt.io can be used to decode the token and view the claims
            }
            catch (Exception ex)
            {
                // Log the exception or return an error response
                Console.WriteLine(ex.Message);
                return null; // Or handle the error appropriately
            }
        }

    }
}